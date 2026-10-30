import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Heart } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const Splash: React.FC = () => {
  const { wedding, hasOpened, openInvitation, t, language } = useWedding();
  const [isOpening, setIsOpening] = useState(false);

  const groomName = language === 'ml' ? wedding.couple.groom.nameMl : wedding.couple.groom.nameEn;
  const brideName = language === 'ml' ? wedding.couple.bride.nameMl : wedding.couple.bride.nameEn;
  const muhurthamDate = language === 'ml' ? wedding.events[2]?.dateMl : wedding.events[2]?.dateEn;

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      openInvitation();
    }, 600);
  };

  if (hasOpened) return null;

  return (
    <AnimatePresence>
      {!hasOpened && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2B23] overflow-hidden"
        >
          {/* Subtle Ambient Emerald Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B5E4B]/60 via-[#0F4336] to-[#061D17]" />

          {/* Ornamental Background Mandala Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[500px] h-[500px] rounded-full border border-[#D4AF37] animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-[#F3E198] animate-[spin_40s_linear_infinite_reverse]" />
          </div>

          {/* Envelope Card Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: isOpening ? 1.05 : 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full max-w-sm sm:max-w-md mx-auto z-10"
          >
            {/* Royal Emerald Border */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F4336] to-[#0A2B23] border-2 border-[#D4AF37]/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center">
              {/* Corner Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#F3E198]" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#F3E198]" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#F3E198]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#F3E198]" />

              {/* Mangala Subham Motif */}
              <div className="flex items-center justify-center gap-2 text-[#F3E198] text-xs tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-semibold">{t.splash.weddingInvitation}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>

              {/* Couple Names */}
              <h1 className="text-3xl sm:text-4xl text-[#FDFBF7] font-wedding-display py-2">
                {groomName} <span className="text-[#F3E198]">&amp;</span> {brideName}
              </h1>

              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-3" />

              <p className="text-emerald-100/80 text-xs sm:text-sm font-light mb-6 px-4">
                {muhurthamDate || wedding.events[2]?.dateEn}
              </p>

              {/* Royal Kasavu Gold Tap Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                disabled={isOpening}
                className="relative group mx-auto flex flex-col items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/50 rounded-full"
                aria-label={t.splash.tapToOpen}
              >
                {/* Glowing Aura Ring */}
                <span className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#E6C86E] via-[#D4AF37] to-[#B68E1B] opacity-60 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />

                {/* Wax Seal Disk */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#F3E198] via-[#D4AF37] to-[#8C680A] shadow-inner flex flex-col items-center justify-center border-2 border-[#FDFBF7]/40">
                  <div className="w-20 h-20 rounded-full border border-dashed border-[#0A2B23]/30 flex flex-col items-center justify-center">
                    <Mail className="w-6 h-6 text-[#0A2B23] mb-1 group-hover:scale-110 transition-transform" />
                    <Heart className="w-3.5 h-3.5 text-[#0F4336] fill-[#0F4336]" />
                  </div>
                </div>

                {/* Button Label */}
                <span className="mt-4 px-5 py-2 rounded-full bg-[#FDFBF7] text-[#0F4336] text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-md group-hover:bg-[#F3E198] transition-colors">
                  {isOpening ? 'Opening...' : t.splash.tapToOpen}
                </span>
              </motion.button>

              <p className="mt-4 text-[11px] text-emerald-200/70 font-light">
                {t.splash.openEnvelope}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
