import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { useWedding } from '../context/WeddingContext';

interface CountdownUnitProps {
  value: number;
  label: string;
}

const CountdownFlipUnit: React.FC<CountdownUnitProps> = ({ value, label }) => {
  const formatted = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      {/* Flip Card Unit */}
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl glass-card-emerald border border-[#F3E198]/40 shadow-xl flex items-center justify-center overflow-hidden">
        {/* Subtle Horizontal Card Crease */}
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/30 z-10" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-2xl sm:text-4xl font-serif font-bold text-[#F3E198] drop-shadow-sm"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-100/90 mt-2">
        {label}
      </span>
    </div>
  );
};

export const Countdown: React.FC = () => {
  const { wedding, t } = useWedding();
  const { days, hours, minutes, seconds, isExpired } = useCountdown(wedding.countdownTargetIso);

  return (
    <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-[#0A2B23] to-[#0F4336] text-[#FDFBF7] relative overflow-hidden">
      {/* Background Mandala Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="w-[500px] h-[500px] rounded-full border-2 border-dashed border-[#F3E198]" />
      </div>

      <div className="max-w-xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#F3E198]/30 text-xs uppercase tracking-widest text-[#F3E198] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{t.countdown.heading}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>

        <p className="text-xs sm:text-sm text-emerald-100/80 font-light mb-8 max-w-md mx-auto">
          {t.countdown.subheading}
        </p>

        {isExpired ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 rounded-3xl glass-card-emerald border border-[#F3E198]/50 shadow-2xl max-w-md mx-auto"
          >
            <Heart className="w-10 h-10 text-[#F3E198] fill-[#F3E198] mx-auto mb-3 animate-pulse" />
            <h3 className="text-2xl sm:text-3xl font-wedding-display text-[#F3E198]">
              {t.countdown.celebrationMessage}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 font-light">
              {t.countdown.togetherForever}
            </p>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center gap-2.5 sm:gap-4">
            <CountdownFlipUnit value={days} label={t.countdown.days} />
            <span className="text-2xl sm:text-3xl font-serif text-[#F3E198]/60 self-center -mt-6">:</span>
            <CountdownFlipUnit value={hours} label={t.countdown.hours} />
            <span className="text-2xl sm:text-3xl font-serif text-[#F3E198]/60 self-center -mt-6">:</span>
            <CountdownFlipUnit value={minutes} label={t.countdown.minutes} />
            <span className="text-2xl sm:text-3xl font-serif text-[#F3E198]/60 self-center -mt-6">:</span>
            <CountdownFlipUnit value={seconds} label={t.countdown.seconds} />
          </div>
        )}
      </div>
    </section>
  );
};
