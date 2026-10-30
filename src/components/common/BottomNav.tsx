import React, { useState } from 'react';
import { Calendar, MapPin, HeartHandshake, Share2, Check } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { shareInvitation } from '../../lib/share';

export const BottomNav: React.FC = () => {
  const { wedding, t, language } = useWedding();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const groomName = language === 'ml' ? wedding.couple.groom.nameMl : wedding.couple.groom.nameEn;
    const brideName = language === 'ml' ? wedding.couple.bride.nameMl : wedding.couple.bride.nameEn;
    const title = `${groomName} & ${brideName} Wedding Invitation`;
    const shareUrl = window.location.href;

    const result = await shareInvitation({
      title,
      text: `${title} - Join our wedding celebrations!`,
      url: shareUrl,
    });

    if (result.fallbackCopied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none md:hidden">
      <nav
        aria-label="Mobile quick actions"
        className="max-w-md mx-auto glass-card-emerald rounded-2xl shadow-2xl shadow-black/25 border border-[#F3E198]/40 px-2 py-1.5 flex items-center justify-around pointer-events-auto backdrop-blur-lg"
      >
        {/* Events / Schedule */}
        <a
          href="#events"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[56px] px-2 py-1 text-emerald-100 hover:text-[#F3E198] active:scale-95 transition-all text-center"
        >
          <Calendar className="w-4 h-4 text-[#F3E198] mb-0.5" />
          <span className="text-[10px] font-medium leading-tight">{t.bottomNav.events}</span>
        </a>

        {/* Venue / Map */}
        <a
          href="#venue"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[56px] px-2 py-1 text-emerald-100 hover:text-[#F3E198] active:scale-95 transition-all text-center"
        >
          <MapPin className="w-4 h-4 text-[#F3E198] mb-0.5" />
          <span className="text-[10px] font-medium leading-tight">{t.bottomNav.venue}</span>
        </a>

        {/* RSVP (Primary Accent) */}
        <a
          href="#rsvp"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[64px] px-3 py-1 bg-gradient-to-r from-[#E6C86E] via-[#D4AF37] to-[#B68E1B] text-[#0A2B23] font-bold rounded-xl shadow-md active:scale-95 transition-all text-center"
        >
          <HeartHandshake className="w-4 h-4 text-[#0A2B23] mb-0.5" />
          <span className="text-[10px] uppercase tracking-wider">{t.bottomNav.rsvp}</span>
        </a>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[56px] px-2 py-1 text-emerald-100 hover:text-[#F3E198] active:scale-95 transition-all text-center cursor-pointer"
          aria-label={t.bottomNav.share}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300 mb-0.5 animate-bounce" />
              <span className="text-[10px] font-medium text-emerald-200">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#F3E198] mb-0.5" />
              <span className="text-[10px] font-medium leading-tight">{t.bottomNav.share}</span>
            </>
          )}
        </button>
      </nav>
    </div>
  );
};
