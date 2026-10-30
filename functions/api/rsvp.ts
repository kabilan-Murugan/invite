// Cloudflare Pages Function: /functions/api/rsvp.ts

interface Env {
  DB?: any; // D1Database
  RSVP_RATE_LIMIT?: any; // KVNamespace (optional)
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    let body: any;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const { name, guests, attending, events, message, honeypot } = body;

    // Honeypot check: Bots fill hidden inputs
    if (honeypot && String(honeypot).trim().length > 0) {
      // Deceive bot into thinking it succeeded
      return new Response(JSON.stringify({ success: true, message: 'Received' }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 25) {
      return new Response(JSON.stringify({ error: 'Valid guest count between 1 and 25 is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (attending !== 'yes' && attending !== 'no') {
      return new Response(JSON.stringify({ error: 'Attendance status must be yes or no' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const eventsStr = Array.isArray(events) ? events.join(', ') : (events || '');
    const cleanMessage = message ? String(message).slice(0, 500) : '';

    // If Cloudflare D1 is bound
    if (env.DB) {
      // Rate limiting: Check if more than 5 submissions from this IP in the last 10 minutes
      try {
        const recentCount = await env.DB.prepare(
          "SELECT COUNT(*) as count FROM rsvps WHERE ip_address = ? AND created_at > datetime('now', '-10 minutes')"
        ).bind(ip).first('count');

        if (recentCount && Number(recentCount) >= 5) {
          return new Response(
            JSON.stringify({ error: 'Too many submissions. Please try again after 10 minutes or use WhatsApp.' }),
            {
              status: 429,
              headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            }
          );
        }

        // Insert RSVP record
        await env.DB.prepare(
          'INSERT INTO rsvps (name, guests, attending, events, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          name.trim(),
          guestCount,
          attending,
          eventsStr,
          cleanMessage,
          ip,
          userAgent.slice(0, 250)
        ).run();

        return new Response(
          JSON.stringify({
            success: true,
            source: 'd1',
            message: 'RSVP recorded in database successfully',
          }),
          {
            status: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          }
        );
      } catch (dbErr: any) {
        console.error('D1 error:', dbErr);
        // Fallback response with warning so client proceeds to WhatsApp
        return new Response(
          JSON.stringify({
            success: true,
            source: 'fallback',
            warning: 'Database temporarily unavailable. Forwarding to WhatsApp.',
          }),
          {
            status: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Graceful degradation when D1 is not bound (static/preview mode)
    return new Response(
      JSON.stringify({
        success: true,
        source: 'unbound',
        message: 'No D1 binding detected. Please confirm via WhatsApp.',
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
};

