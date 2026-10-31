import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, ChevronDown, Heart } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { ResponsiveWeddingImage } from '../components/common/ResponsiveWeddingImage';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const Hero: React.FC = () => {
  const { wedding, t, language } = useWedding();
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 120]);
  const opacityParallax = useTransform(scrollY, [0, 450], [1, 0.2]);

  const groomName = language === 'ml' ? wedding.couple.groom.nameMl : wedding.couple.groom.nameEn;
  const brideName = language === 'ml' ? wedding.couple.bride.nameMl : wedding.couple.bride.nameEn;
  const muhurthamEvent = wedding.events.find(e => e.key === 'muhurtham') || wedding.events[2];
  const dateFormatted = language === 'ml' ? muhurthamEvent.dateMl : muhurthamEvent.dateEn;

  return (
    <section id="hero" className="relative min-h-[92vh] sm:min-h-screen flex items-end justify-center overflow-hidden pb-16 pt-24">
      {/* Background Hero Image with Parallax */}
      <motion.div
        style={{ y: yParallax }}
        className="absolute inset-0 w-full h-[115%] -top-[10%] z-0"
      >
        <ResponsiveWeddingImage
          id="couple-01"
          alt={`${wedding.couple.groom.nameEn} and ${wedding.couple.bride.nameEn}`}
          priority={true}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover object-center filter brightness-[0.85] saturate-[1.1]"
        />
        {/* Royal Emerald & Sandalwood Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2B23] via-[#0F4336]/60 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_50%,_rgba(10,43,35,0.85)_100%)]" />
      </motion.div>

      {/* Foreground Content Card */}
      <motion.div
        style={{ opacity: opacityParallax }}
        className="relative z-10 w-full max-w-3xl mx-auto px-4 text-center text-[#FDFBF7]"
      >
        {/* Save The Date Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-[#F3E198]/40 text-[#F3E198] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4 shadow-lg"
        >
          <Heart className="w-3.5 h-3.5 text-[#F3E198] fill-[#F3E198]" />
          <span>{t.hero.saveTheDate}</span>
          <Heart className="w-3.5 h-3.5 text-[#F3E198] fill-[#F3E198]" />
        </motion.div>

        {/* Couple Names - Auto-fitting & Resilient Typography */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className={`w-full max-w-3xl mx-auto px-2 text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] leading-tight py-2 ${
            language === 'ml'
              ? 'font-malayalam-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-normal'
              : 'font-wedding-display text-4xl sm:text-6xl md:text-7xl font-bold'
          }`}
        >
          <span className="inline-block break-words">{groomName}</span>
          <span className="inline-block text-2xl sm:text-4xl lg:text-5xl font-serif text-[#F3E198] mx-2 sm:mx-3">&amp;</span>
          <span className="inline-block break-words">{brideName}</span>
        </motion.h1>

        {/* Wedding Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-base text-emerald-100 font-light tracking-wide mt-2 mb-6"
        >
          {t.hero.gettingMarried}
        </motion.p>

        {/* Date & Location Pill Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="p-4 rounded-2xl glass-card-emerald max-w-md mx-auto shadow-2xl flex flex-col sm:flex-row items-center justify-around gap-3 text-xs sm:text-sm text-emerald-50"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F3E198]" />
            <span className="font-medium">{dateFormatted}</span>
          </div>
          <div className="hidden sm:block w-[1px] h-4 bg-[#D4AF37]/40" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#F3E198]" />
            <span>{t.hero.venueCity}</span>
          </div>
        </motion.div>

        {/* Scroll down prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 flex flex-col items-center justify-center text-emerald-200/80 text-[11px] uppercase tracking-widest gap-1"
        >
          <span>{t.hero.scrollDown}</span>
          <ChevronDown className="w-4 h-4 text-[#F3E198] animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  );
};
