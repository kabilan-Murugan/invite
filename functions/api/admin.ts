// Cloudflare Pages Function: /functions/api/admin.ts

interface Env {
  DB?: any; // D1Database
  ADMIN_PASSWORD?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-password',
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

function verifyAuth(request: Request, env: Env): boolean {
  const configuredPassword = env.ADMIN_PASSWORD || 'wedding2026'; // Default fallback password if env var not set
  const headerPassword = request.headers.get('x-admin-password');
  const authHeader = request.headers.get('Authorization');

  if (headerPassword && headerPassword === configuredPassword) {
    return true;
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    if (token === configuredPassword) {
      return true;
    }
  }

  // Also allow URL query parameter for simple direct CSV download link in browser: ?pass=...
  const url = new URL(request.url);
  const queryPass = url.searchParams.get('pass');
  if (queryPass && queryPass === configuredPassword) {
    return true;
  }

  return false;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  if (!verifyAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Invalid admin password.' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get('format');

  if (!env.DB) {
    return new Response(
      JSON.stringify({
        error: 'Cloudflare D1 is not configured in this environment.',
        stats: { totalRsvps: 0, totalGuests: 0, attendingCount: 0, declinedCount: 0 },
        records: [],
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, guests, attending, events, message, ip_address, created_at FROM rsvps ORDER BY created_at DESC'
    ).all();

    const records = results || [];

    // Calculate statistics
    let totalGuests = 0;
    let attendingCount = 0;
    let declinedCount = 0;

    for (const r of records) {
      if (r.attending === 'yes') {
        attendingCount++;
        totalGuests += Number(r.guests) || 0;
      } else {
        declinedCount++;
      }
    }

    // CSV Export option
    if (format === 'csv') {
      const csvHeader = 'ID,Name,Guests,Attending,Events,Message,Date (UTC)\n';
      const csvRows = records.map((r: any) => {
        const cleanName = `"${(r.name || '').replace(/"/g, '""')}"`;
        const cleanEvents = `"${(r.events || '').replace(/"/g, '""')}"`;
        const cleanMsg = `"${(r.message || '').replace(/"/g, '""')}"`;
        return `${r.id},${cleanName},${r.guests},${r.attending},${cleanEvents},${cleanMsg},${r.created_at}`;
      }).join('\n');

      return new Response(csvHeader + csvRows, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="wedding-rsvps.csv"',
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalRsvps: records.length,
          totalGuests,
          attendingCount,
          declinedCount,
        },
        records,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
};

