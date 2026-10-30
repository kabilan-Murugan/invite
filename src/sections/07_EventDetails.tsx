import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles, Navigation, Download, Shirt } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { type WeddingEvent } from '../data/wedding';
import { downloadIcsFile, generateGoogleCalendarUrl } from '../lib/ics';
import { GoldDivider } from '../components/common/GoldDivider';

export const EventDetails: React.FC = () => {
  const { wedding, t, language } = useWedding();

  const coupleTitle = `${wedding.couple.groom.nameEn} & ${wedding.couple.bride.nameEn}`;

  const renderIcon = (iconName: WeddingEvent['iconName']) => {
    switch (iconName) {
      case 'ring':
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-100/70 border border-[#D4AF37]/40 flex items-center justify-center text-[#0F4336] shadow-sm">
            <svg className="w-6 h-6 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="14" r="7" />
              <path d="M12 7l2-4h-4l2 4z" fill="#D4AF37" />
            </svg>
          </div>
        );
      case 'celebration':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 border border-[#D4AF37]/40 flex items-center justify-center text-[#0F4336] shadow-sm">
            <Sparkles className="w-6 h-6 text-[#0F4336]" />
          </div>
        );
      case 'mandapam':
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-200/80 border border-[#D4AF37] flex items-center justify-center text-[#0A2B23] shadow-sm">
            <svg className="w-6 h-6 text-[#8C680A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />
            </svg>
          </div>
        );
    }
  };

  return (
    <section id="events" className="py-16 sm:py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.events.heading}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-wedding-serif font-bold text-[#0F4336]">
            {language === 'ml' ? 'ശുഭ മുഹൂർത്ത & സൽക്കാര ചടങ്ങുകൾ' : 'Auspicious Ceremonies'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-2 max-w-md mx-auto">
            {t.events.subheading}
          </p>
          <GoldDivider variant="lotus" />
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wedding.events.map((event, index) => {
            const title = language === 'ml' ? event.titleMl : event.titleEn;
            const tagline = language === 'ml' ? event.taglineMl : event.taglineEn;
            const date = language === 'ml' ? event.dateMl : event.dateEn;
            const time = language === 'ml' ? event.timeMl : event.timeEn;
            const venue = language === 'ml' ? event.venueNameMl : event.venueNameEn;
            const address = language === 'ml' ? event.addressMl : event.addressEn;
            const dress = language === 'ml' ? event.dressCodeMl : event.dressCodeEn;

            const googleCalUrl = generateGoogleCalendarUrl(event, coupleTitle);
            const isMuhurtham = event.key === 'muhurtham';

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative rounded-3xl p-6 flex flex-col justify-between shadow-lg transition-all hover:shadow-xl ${
                  isMuhurtham
                    ? 'bg-gradient-to-b from-[#FFFEFA] to-[#F4EFE6] border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/20'
                    : 'glass-card border border-[#D4AF37]/30'
                }`}
              >
                {/* Most Auspicious Crown Badge */}
                {isMuhurtham && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#E6C86E] via-[#D4AF37] to-[#B68E1B] text-[#0A2B23] text-[10px] font-bold uppercase tracking-widest shadow-md">
                    {language === 'ml' ? '★ താലികെട്ട് മുഹൂർത്തം' : '★ Auspicious Muhurtham'}
                  </div>
                )}

                <div>
                  {/* Top Bar: Icon & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    {renderIcon(event.iconName)}
                    <span className="text-[11px] font-semibold text-[#0F4336] px-2.5 py-1 rounded-full bg-white/80 border border-[#D4AF37]/20">
                      Step {index + 1}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-serif font-bold text-[#0F4336] mb-1">
                    {title}
                  </h3>
                  <p className="text-xs text-stone-500 font-light mb-4 min-h-[32px]">
                    {tagline}
                  </p>

                  <div className="space-y-3 py-3 border-y border-stone-200/60 text-xs sm:text-sm text-stone-700">
                    {/* Date */}
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span className="font-semibold text-stone-800">{date}</span>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{time}</span>
                    </div>

                    {/* Venue */}
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#0F4336]">{venue}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">{address}</p>
                      </div>
                    </div>

                    {/* Dress Code */}
                    {dress && (
                      <div className="flex items-start gap-2.5 pt-1">
                        <Shirt className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">
                            {t.events.dressCode}
                          </span>
                          <span className="text-[11px] text-stone-600 font-medium">{dress}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Add to Calendar & Get Directions */}
                <div className="mt-6 pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Google Calendar Link */}
                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 min-h-[44px] px-2 py-2 rounded-xl bg-white border border-[#D4AF37]/40 text-[#0F4336] text-xs font-semibold hover:bg-stone-50 active:scale-95 transition-all text-center"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Google Cal</span>
                    </a>

                    {/* .ics Download Button */}
                    <button
                      type="button"
                      onClick={() => downloadIcsFile(event, coupleTitle)}
                      className="flex items-center justify-center gap-1.5 min-h-[44px] px-2 py-2 rounded-xl bg-white border border-[#D4AF37]/40 text-[#0F4336] text-xs font-semibold hover:bg-stone-50 active:scale-95 transition-all text-center cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>.ICS File</span>
                    </button>
                  </div>

                  {/* Directions Button */}
                  <a
                    href={event.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 min-h-[44px] w-full px-4 py-2 rounded-xl bg-[#0F4336] text-[#FDFBF7] text-xs font-semibold hover:bg-[#0A2B23] active:scale-98 transition-all shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#F3E198]" />
                    <span>{t.events.getDirections}</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
