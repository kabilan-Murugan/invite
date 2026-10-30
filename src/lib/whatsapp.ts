export interface RsvpWhatsAppPayload {
  name: string;
  guests: number;
  attending: 'yes' | 'no';
  events: string[];
  message?: string;
}

export function buildRsvpWhatsAppUrl(payload: RsvpWhatsAppPayload, defaultPhone: string): string {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || defaultPhone;
  const cleanPhone = phone.replace(/\D/g, '');

  const attendanceEmoji = payload.attending === 'yes' ? '🎉 Joyfully Accepting' : '🙏 Regretfully Declining';
  const eventsList = payload.events.length > 0 ? payload.events.join(', ') : 'All events';
  const notes = payload.message ? `\n💬 *Blessings:* ${payload.message}` : '';

  const text = `*💍 WEDDING RSVP CONFIRMATION*\n\n` +
    `👤 *Name / Family:* ${payload.name}\n` +
    `👥 *Guests:* ${payload.guests}\n` +
    `✨ *Status:* ${attendanceEmoji}\n` +
    `📅 *Ceremonies:* ${eventsList}` +
    notes +
    `\n\n_Sent via digital wedding invitation_`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildShareInvitationWhatsAppUrl(coupleTitle: string, url: string): string {
  const text = `✨ *Wedding Invitation: ${coupleTitle}* ✨\n\n` +
    `Together with our families, we joyfully invite you to celebrate our wedding ceremonies!\n\n` +
    `📖 View our interactive invitation, events, and location here:\n${url}\n\n` +
    `We seek your blessings and warm presence! 🙏`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildDirectContactWhatsAppUrl(phone: string, greeting: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`;
}

