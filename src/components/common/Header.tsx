import React from 'react';
import { Volume2, VolumeX, Globe } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';

export const Header: React.FC = () => {
  const { wedding, language, toggleLanguage, t, isPlayingAudio, toggleAudio } = useWedding();

  return (
    <header className="fixed top-3 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Monogram / Brand */}
        <a
          href="#hero"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-[#D4AF37]/40 shadow-sm hover:scale-105 active:scale-95 transition-all text-[#0F4336]"
          aria-label="Back to top"
        >
          <span className="font-wedding-display text-xl sm:text-2xl font-bold leading-none text-[#0F4336]">
            {wedding.couple.groom.nameEn[0]} &amp; {wedding.couple.bride.nameEn[0]}
          </span>
          <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold border-l border-[#D4AF37]/30 pl-2">
            Wedding
          </span>
        </a>

        {/* Actions Group: Music & Language Toggle */}
        <div className="flex items-center gap-2">
          {/* Music Controller */}
          <button
            onClick={toggleAudio}
            type="button"
            className="flex items-center gap-2 min-h-[44px] px-3.5 py-1.5 rounded-full glass-card border border-[#D4AF37]/40 shadow-sm hover:border-[#D4AF37] active:scale-95 transition-all text-[#0F4336] cursor-pointer group"
            title={isPlayingAudio ? t.header.audioPause : t.header.audioPlay}
            aria-label={isPlayingAudio ? t.header.audioPause : t.header.audioPlay}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                {/* Audio Equalizer Bars */}
                <div className="flex items-end gap-[2px] h-3.5 w-3.5 overflow-hidden" aria-hidden="true">
                  <span className="w-1 bg-[#0F4336] rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
                  <span className="w-1 bg-[#D4AF37] rounded-full animate-[bounce_1s_infinite_300ms] h-2/3" />
                  <span className="w-1 bg-[#0F4336] rounded-full animate-[bounce_1s_infinite_200ms] h-4/5" />
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400 group-hover:text-[#0F4336]" />
                <span className="text-xs font-medium text-stone-600 hidden sm:inline">Music</span>
              </>
            )}
          </button>

          {/* Language Toggle: English <-> മലയാളം */}
          <button
            onClick={toggleLanguage}
            type="button"
            className="flex items-center gap-1.5 min-h-[44px] px-3.5 py-1.5 rounded-full glass-card border border-[#D4AF37]/40 shadow-sm hover:border-[#D4AF37] active:scale-95 transition-all text-[#0F4336] cursor-pointer font-medium text-xs sm:text-sm"
            aria-label={t.header.toggleLanguage}
            title={t.header.toggleLanguage}
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className={language === 'ml' ? 'font-sans' : 'font-malayalam-body font-semibold'}>
              {t.header.languageName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
