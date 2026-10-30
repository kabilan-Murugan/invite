import type { WeddingEvent } from '../data/wedding';

// Helper to format ISO date string to UTC format required by iCalendar: YYYYMMDDTHHMMSSZ
function formatDateToIcs(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generateIcsContent(event: WeddingEvent, coupleNames: string): string {
  const start = formatDateToIcs(event.startDateIso);
  const end = formatDateToIcs(event.endDateIso);
  const now = formatDateToIcs(new Date().toISOString());
  const uid = `${event.id}-${Date.now()}@wedding-invitation.com`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${coupleNames} - ${event.titleEn}`,
    `DESCRIPTION:${event.taglineEn}\\nVenue: ${event.venueNameEn}\\nAddress: ${event.addressEn}`,
    `LOCATION:${event.venueNameEn}, ${event.addressEn}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcsFile(event: WeddingEvent, coupleNames: string) {
  const icsData = generateIcsContent(event, coupleNames);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.id}-wedding-invitation.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function generateGoogleCalendarUrl(event: WeddingEvent, coupleNames: string): string {
  const start = formatDateToIcs(event.startDateIso);
  const end = formatDateToIcs(event.endDateIso);
  const title = encodeURIComponent(`${coupleNames} - ${event.titleEn}`);
  const details = encodeURIComponent(`${event.taglineEn}\n\nVenue: ${event.venueNameEn}\nAddress: ${event.addressEn}\nMaps: ${event.mapLink}`);
  const location = encodeURIComponent(`${event.venueNameEn}, ${event.addressEn}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}
