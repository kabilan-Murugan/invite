import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Music, ChevronDown } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { ResponsiveWeddingImage } from '../components/common/ResponsiveWeddingImage';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const Hero: React.FC = () => {
  const { wedding, t, language, isPlayingAudio, toggleAudio } = useWedding();
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 70]);
  const opacityParallax = useTransform(scrollY, [0, 500], [1, 0.35]);

  const isMalayalam = language === 'ml';
  const groomName = isMalayalam ? wedding.couple.groom.nameMl : wedding.couple.groom.nameEn;
  const brideName = isMalayalam ? wedding.couple.bride.nameMl : wedding.couple.bride.nameEn;

  const groomParents = isMalayalam ? wedding.couple.groom.parentsMl : wedding.couple.groom.parentsEn;
  const brideParents = isMalayalam ? wedding.couple.bride.parentsMl : wedding.couple.bride.parentsEn;

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-12 sm:py-16 select-none bg-[#FCFBF8]"
    >
      {/* Radiant High-Key Background Image with Subtle Parallax */}
      <motion.div
        style={{ y: yParallax }}
        className="absolute inset-0 w-full h-[112%] -top-[6%] z-0"
      >
        <ResponsiveWeddingImage
          id="couple-01"
          alt={`${wedding.couple.groom.nameEn} & ${wedding.couple.bride.nameEn}`}
          priority={true}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[0.98] scale-105"
        />

        {/* Ethereal Pearl & Champagne Light Vignette Overlays */}
        <div className="absolute inset-0 bg-[#FCFBF8]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FCFBF8]/80 via-[#FCFBF8]/30 to-[#FCFBF8]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(252,251,248,0.75)_100%)]" />
      </motion.div>

      {/* Luxury Frosted Pearl Alabaster Card with Embossed Gold Framing */}
      <motion.div
        style={{ opacity: opacityParallax }}
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[390px] sm:max-w-[430px] mx-auto rounded-[28px] sm:rounded-[34px] bg-white/85 sm:bg-white/80 backdrop-blur-2xl border border-[#D4AF37]/50 px-6 py-8 sm:px-9 sm:py-10 text-center shadow-[0_25px_60px_-15px_rgba(197,160,56,0.22),0_12px_35px_rgba(45,36,36,0.07)]"
      >
        {/* Fine Gilded Inner Hairline Frame */}
        <div className="absolute inset-2 sm:inset-2.5 rounded-[22px] sm:rounded-[28px] border border-[#D4AF37]/25 pointer-events-none" />

        {/* Top Regal Header: ✦ WEDDING INVITATION ✦ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="inline-flex items-center gap-2 mb-5 sm:mb-6"
        >
          <span className="text-[#C5A038] text-[10px]">✦</span>
          <span className="text-[11px] sm:text-xs font-serif uppercase tracking-[0.32em] text-[#9B7722] font-semibold">
            {t.hero.weddingInvitation || 'WEDDING INVITATION'}
          </span>
          <span className="text-[#C5A038] text-[10px]">✦</span>
        </motion.div>

        {/* Elegant Script Cursive Couple Names */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center justify-center my-1"
        >
          <span
            className={`text-[#1E2421] font-normal leading-tight tracking-wide drop-shadow-sm ${
              isMalayalam
                ? 'font-malayalam-display text-3xl sm:text-4xl font-bold text-[#1E2421]'
                : 'font-wedding-display text-4xl sm:text-5xl md:text-[56px]'
            }`}
          >
            {groomName}
          </span>
          <span
            className={`text-[#C5A038] my-1 leading-none ${
              isMalayalam ? 'text-lg sm:text-xl font-serif' : 'font-wedding-display text-3xl sm:text-4xl'
            }`}
          >
            &amp;
          </span>
          <span
            className={`text-[#1E2421] font-normal leading-tight tracking-wide drop-shadow-sm ${
              isMalayalam
                ? 'font-malayalam-display text-3xl sm:text-4xl font-bold text-[#1E2421]'
                : 'font-wedding-display text-4xl sm:text-5xl md:text-[56px]'
            }`}
          >
            {brideName}
          </span>
        </motion.div>

        {/* Delicate Golden Filigree Line */}
        <div className="flex items-center justify-center gap-2 my-5 opacity-75">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C5A038]" />
          <span className="text-[#C5A038] text-[9px]">❖</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C5A038]" />
        </div>

        {/* Romantic Italic Serif Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className={`font-serif italic text-[13.5px] sm:text-[15px] leading-relaxed text-[#5C5248] max-w-[310px] mx-auto my-4 sm:my-5 px-1 whitespace-pre-line font-medium ${
            isMalayalam ? 'font-malayalam-serif not-italic' : ''
          }`}
        >
          {t.hero.quote ||
            '“United in love, surrounded by grace,\nwe invite you to witness the beginning of\nour forever.”'}
        </motion.p>

        {/* Groom Lineage Details */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-4 sm:mb-5 pt-1"
        >
          <h2
            className={`font-serif font-bold text-xl sm:text-[22px] text-[#1E2421] tracking-wide leading-tight ${
              isMalayalam ? 'font-malayalam-display font-bold' : ''
            }`}
          >
            {groomName}
          </h2>
          <p className="font-serif text-xs sm:text-[13.5px] text-[#6E6459] mt-1 leading-snug font-normal">
            {isMalayalam ? `${groomParents} എന്നിവരുടെ മകൻ` : `S/o ${groomParents}`}
          </p>
        </motion.div>

        {/* Bride Lineage Details */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2
            className={`font-serif font-bold text-xl sm:text-[22px] text-[#1E2421] tracking-wide leading-tight ${
              isMalayalam ? 'font-malayalam-display font-bold' : ''
            }`}
          >
            {brideName}
          </h2>
          <p className="font-serif text-xs sm:text-[13.5px] text-[#6E6459] mt-1 leading-snug font-normal">
            {isMalayalam ? `${brideParents} എന്നിവരുടെ മകൾ` : `D/o ${brideParents}`}
          </p>
        </motion.div>
      </motion.div>

      {/* Floating Audio Button: Pearl White Circle with Luxury Champagne Gold Rim & Music Note */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        type="button"
        onClick={toggleAudio}
        className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#9B7722] border-2 border-[#C5A038] shadow-[0_4px_20px_rgba(197,160,56,0.35),0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A038]/50"
        aria-label={isPlayingAudio ? t.header.audioPause : t.header.audioPlay}
        title={isPlayingAudio ? t.header.audioPause : t.header.audioPlay}
      >
        <Music className={`w-4 h-4 text-[#9B7722] ${isPlayingAudio ? 'animate-pulse' : ''}`} />
      </motion.button>

      {/* Subtle Scroll Down Prompt at Bottom Center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center text-[#9B7722]/80 text-[10px] uppercase tracking-widest gap-1 pointer-events-none"
      >
        <ChevronDown className="w-3.5 h-3.5 text-[#C5A038] animate-bounce" />
      </motion.div>
    </section>
  );
};
