
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Navigation } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { type WeddingEvent } from '../data/wedding';
import { generateGoogleCalendarUrl } from '../lib/ics';

export const EventDetails: React.FC = () => {
  const { wedding, language } = useWedding();
  const isMalayalam = language === 'ml';

  const coupleTitle = `${wedding.couple.groom.nameEn} & ${wedding.couple.bride.nameEn}`;

  // Parse event date safely
  const parseEventDateParts = (event: WeddingEvent) => {
    try {
      if (!event.startDateIso) return null;

      const d = new Date(event.startDateIso);

      if (isNaN(d.getTime())) return null;

      const monthNamesEn = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL',
        'MAY', 'JUNE', 'JULY', 'AUGUST',
        'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
      ];

      const monthNamesMl = [
        'ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ',
        'മേയ്', 'ജൂൺ', 'ജൂലൈ', 'ഓഗസ്റ്റ്',
        'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ',
      ];

      const weekDaysEn = [
        'SUNDAY', 'MONDAY', 'TUESDAY',
        'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY',
      ];

      const weekDaysMl = [
        'ഞായറാഴ്ച', 'തിങ്കളാഴ്ച', 'ചൊവ്വാഴ്ച',
        'ബുധനാഴ്ച', 'വ്യാഴാഴ്ച', 'വെള്ളിയാഴ്ച', 'ശനിയാഴ്ച',
      ];

      return {
        dayNum: d.getDate().toString(),
        month: isMalayalam
          ? monthNamesMl[d.getMonth()]
          : monthNamesEn[d.getMonth()],
        yearWeekday: `${d.getFullYear()} • ${isMalayalam
            ? weekDaysMl[d.getDay()]
            : weekDaysEn[d.getDay()]
          }`,
      };
    } catch {
      return null;
    }
  };

  // Event category label
  const getCategoryLabel = (key: WeddingEvent['key']) => {
    if (isMalayalam) {
      switch (key) {
        case 'muhurtham':
          return 'വിവാഹ മുഹൂർത്തം';
        case 'reception':
          return 'വിവാഹ സൽക്കാരം';
        case 'engagement':
          return 'വിവാഹനിശ്ചയം';
        default:
          return 'മംഗള ചടങ്ങ്';
      }
    }

    switch (key) {
      case 'muhurtham':
        return 'MARRIAGE';
      case 'reception':
        return 'RECEPTION';
      case 'engagement':
        return 'ENGAGEMENT';
      default:
        return 'CELEBRATION';
    }
  };

  // Event count label
  const eventCountWord = () => {
    const count = wedding.events.length;

    if (isMalayalam) {
      if (count === 2) return 'രണ്ട് മംഗള ചടങ്ങുകൾ';
      if (count === 3) return 'മൂന്ന് മംഗള ചടങ്ങുകൾ';
      return `${count} മംഗള ചടങ്ങുകൾ`;
    }

    const words = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];

    return `${words[count - 1] || count} BEAUTIFUL CELEBRATIONS`;
  };

  return (
    <section
      id="events"
      className="py-20 sm:py-28 px-4 bg-gradient-to-b from-[#FDF8F9] via-[#F9EFF2] to-[#FDF8F9] text-[var(--theme-text)] relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(140,59,85,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16">
          <div className="text-[10.5px] sm:text-xs uppercase tracking-[0.28em] text-[var(--theme-gold-dark)] font-bold mb-3">
            {eventCountWord()}
          </div>

          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl text-[var(--theme-primary-dark)] font-normal italic tracking-wide drop-shadow-sm ${isMalayalam
                ? 'font-malayalam-display not-italic font-bold text-3xl sm:text-4xl'
                : 'font-wedding-serif'
              }`}
          >
            {isMalayalam ? 'വിവാഹ ചടങ്ങുകൾ' : 'Wedding Events'}
          </h2>
        </div>

        {/* Calendar Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 max-w-5xl mx-auto items-start">

          {wedding.events.map((event, index) => {
            const dateParts = parseEventDateParts(event);

            const dayNum = dateParts?.dayNum ?? '--';
            const month = dateParts?.month ?? '';
            const yearWeekday = dateParts?.yearWeekday ?? '';

            const category = getCategoryLabel(event.key);

            // Support English and Malayalam time values
            const time = isMalayalam
              ? (event.timeMl || event.timeEn || '')
              : (event.timeEn || event.timeMl || '');

            const venue = isMalayalam
              ? event.venueNameMl
              : event.venueNameEn;

            const address = isMalayalam
              ? event.addressMl
              : event.addressEn;

            const googleCalUrl = generateGoogleCalendarUrl(
              event,
              coupleTitle
            );

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                className="relative pt-4 w-full max-w-[360px] mx-auto"
              >

                {/* Metallic Binder Rings */}
                <div className="absolute top-0 left-[22%] -translate-x-1/2 z-20 flex flex-col items-center">
                  <div className="w-3.5 h-8 rounded-full bg-gradient-to-r from-[#d8d8d8] via-[#ffffff] to-[#999999] shadow-md border border-stone-400/60" />
                </div>

                <div className="absolute top-0 right-[22%] translate-x-1/2 z-20 flex flex-col items-center">
                  <div className="w-3.5 h-8 rounded-full bg-gradient-to-r from-[#d8d8d8] via-[#ffffff] to-[#999999] shadow-md border border-stone-400/60" />
                </div>

                {/* Calendar Sheet */}
                <div className="relative rounded-[28px] bg-white text-[#1c1c1c] p-6 sm:p-7 shadow-[0_20px_45px_rgba(140,59,85,0.12)] border border-[var(--theme-primary)]/15 flex flex-col justify-between min-h-[460px]">

                  {/* Punch Holes */}
                  <div className="absolute top-4 left-[22%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-stone-200 shadow-inner z-10" />

                  <div className="absolute top-4 right-[22%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-stone-200 shadow-inner z-10" />

                  <div>

                    {/* Event Category */}
                    <div className="text-center pt-3 pb-4">
                      <span className="text-[11px] sm:text-[12px] font-serif font-semibold tracking-[0.22em] text-[var(--theme-gold-dark)] uppercase">
                        {category}
                      </span>
                    </div>

                    {/* Calendar Date */}
                    <div className="flex items-center justify-center gap-4 py-3 border-b border-stone-200/60 mb-4">

                      {/* Day Number */}
                      <span className="font-serif text-5xl sm:text-6xl font-bold text-[var(--theme-primary-dark)] tracking-tight">
                        {dayNum}
                      </span>

                      {/* Month and Year */}
                      <div className="flex flex-col text-left">
                        <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[var(--theme-primary)] uppercase leading-none">
                          {month}
                        </span>

                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-1">
                          {yearWeekday}
                        </span>
                      </div>
                    </div>

                    {/* Time - Only show if available */}
                    {time?.trim() && (
                      <div className="text-center mb-4">
                        <span className="text-xs sm:text-sm font-semibold text-[var(--theme-text-muted)]">
                          {time}
                        </span>
                      </div>
                    )}

                    {/* Venue Name and Address */}
                    <div className="text-center my-3 min-h-[70px] flex flex-col justify-center">
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#181818] leading-snug">
                        {venue}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-stone-500 mt-1 leading-relaxed max-w-[260px] mx-auto">
                        {address}
                      </p>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5 pt-4 mt-2">

                    {/* Open Map */}
                    {event.mapLink && <a
                      href={event.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-[var(--theme-primary-dark)] hover:bg-[var(--theme-primary)] text-white text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[var(--theme-gold-light)]" />

                      <span>
                        {isMalayalam ? 'മാപ്പിൽ കാണുക' : 'OPEN MAP'}
                      </span>
                    </a>}

                    {/* Add to Calendar */}
                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[var(--theme-gold)] to-[var(--theme-gold-dark)] hover:opacity-95 text-white text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98"
                    >
                      <Calendar className="w-3.5 h-3.5 text-white" />

                      <span>
                        {isMalayalam
                          ? 'കലണ്ടറിൽ ചേർക്കുക'
                          : 'ADD TO CALENDAR'}
                      </span>
                    </a>

                  </div>
                </div>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
};
