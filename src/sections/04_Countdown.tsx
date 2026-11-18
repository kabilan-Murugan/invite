import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { useWedding } from '../context/WeddingContext';
import { ScratchCard } from '../components/common/ScratchCard';

interface CountdownUnitProps {
  value: number;
  label: string;
  padTo3?: boolean;
}

const CountdownBox: React.FC<CountdownUnitProps> = ({ value, label, padTo3 = false }) => {
  const formatted = padTo3 ? value.toString().padStart(3, '0') : value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      {/* Sleek Dark Box from User's Reference */}
      <div className="w-[72px] h-[78px] sm:w-[86px] sm:h-[92px] rounded-2xl bg-black/65 backdrop-blur-md border border-white/15 shadow-2xl flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-widest drop-shadow-md"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-stone-300/80 mt-2">
        {label}
      </span>
    </div>
  );
};

export const Countdown: React.FC = () => {
  const { wedding, t, language } = useWedding();
  const { days, hours, minutes, seconds, isExpired } = useCountdown(wedding.countdownTargetIso);

  const isMalayalam = language === 'ml';

  // Primary event info for scratch card reveal
  const mainEvent = wedding.events.find((e) => e.key === 'muhurtham') || wedding.events[0];
  const dateText = isMalayalam
    ? mainEvent?.dateMl || 'ഞായറാഴ്ച, നവംബർ 29, 2026'
    : mainEvent?.dateEn || 'Sunday, November 29, 2026';
  const dayText = isMalayalam ? 'മംഗള മുഹൂർത്ത ദിനം' : 'The Big Day';
  const muhurthamText = isMalayalam
    ? mainEvent?.timeMl || 'രാവിലെ 09:00 – 10:30'
    : mainEvent?.timeEn || '09:00 AM – 10:30 AM';
  const venueText = isMalayalam
    ? wedding.venue.nameMl || 'ദി ഗ്രാൻഡ് ഹെറിറ്റേജ് പാലസ്, കൊച്ചി'
    : wedding.venue.nameEn || 'The Grand Heritage Palace, Kochi';

  return (
    <section
      id="countdown"
      className="relative py-20 sm:py-28 px-4 text-[#FDFBF7] overflow-hidden min-h-[90vh] flex items-center justify-center"
    >
      {/* 1. Romantic Black & White Background with Vignette (Matching Reference) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/photos/couple-01.jpg"
          alt="Couple holding hands"
          className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-[0.22] scale-105"
        />
        {/* Soft Dusky Romantic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c0d13]/90 via-[#12080d]/75 to-[#1c0d13]/95" />
      </div>

      <div className="max-w-xl mx-auto text-center relative z-10 w-full">
        {/* Section 1: "Remember the Date" & Scratch to Reveal */}
        <div id="remember-date" className="mb-12">
          {/* Subtitle in clean small caps */}
          <div className="text-[10px] sm:text-[11.5px] font-semibold tracking-[0.25em] text-stone-300 uppercase mb-2">
            {isMalayalam ? 'ഞങ്ങളുടെ ഹൃദയങ്ങളിൽ കുറിച്ച ആ സുദിനം' : 'A DATE WRITTEN IN OUR HEARTS FOREVER'}
          </div>

          {/* Heading in elegant Playfair cursive script matching Reference */}
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl text-white font-normal italic tracking-wide mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] ${
              isMalayalam ? 'font-malayalam-display not-italic font-bold text-3xl sm:text-4xl' : 'font-wedding-serif'
            }`}
          >
            {isMalayalam ? 'ആ വിശേഷദിനം' : 'Remember the Date'}
          </h2>

          {/* Interactive Scratch-to-Reveal Card */}
          <ScratchCard
            language={language}
            dateText={dateText}
            dayText={dayText}
            muhurthamText={muhurthamText}
            venueText={venueText}
          />
        </div>

        {/* Section 2: "The Countdown Begins" */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3
            className={`text-3xl sm:text-4xl text-white font-normal italic tracking-wide mb-6 drop-shadow-md ${
              isMalayalam ? 'font-malayalam-display not-italic font-bold text-2xl sm:text-3xl' : 'font-wedding-serif'
            }`}
          >
            {isMalayalam ? 'വിവാഹത്തിനായുള്ള കൗണ്ട്ഡൗൺ' : 'The Countdown Begins'}
          </h3>

          {isExpired ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-3xl bg-black/60 border border-[#D4AF37]/50 shadow-2xl max-w-md mx-auto"
            >
              <Heart className="w-10 h-10 text-[#F3E198] fill-[#F3E198] mx-auto mb-3 animate-pulse" />
              <h4 className="text-2xl sm:text-3xl font-wedding-display text-[#F3E198]">
                {t.countdown.celebrationMessage}
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 font-light">
                {t.countdown.togetherForever}
              </p>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center gap-2 sm:gap-3.5 max-w-md mx-auto">
              <CountdownBox value={days} label={isMalayalam ? 'ദിവസങ്ങൾ' : 'DAYS'} padTo3={true} />
              <CountdownBox value={hours} label={isMalayalam ? 'മണിക്കൂർ' : 'HOURS'} />
              <CountdownBox value={minutes} label={isMalayalam ? 'മിനിറ്റ്' : 'MINUTES'} />
              <CountdownBox value={seconds} label={isMalayalam ? 'സെക്കൻഡ്' : 'SECONDS'} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
