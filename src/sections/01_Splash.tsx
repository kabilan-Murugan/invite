import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';

export const Splash: React.FC = () => {
  const { wedding, hasOpened, openInvitation, playAudio, language } = useWedding();
  const [isOpening, setIsOpening] = useState(false);

  if (hasOpened) return null;

  // Derives monogram initials from couple's names (e.g. K & A for Karthik & Ananya)
  const groomInitial = (wedding.couple.groom.nameEn[0] || 'K').toUpperCase();
  const brideInitial = (wedding.couple.bride.nameEn[0] || 'A').toUpperCase();

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Start background music immediately on user gesture
    try {
      playAudio();
    } catch {
      // Audio playback fallback
    }

    // Allow full smooth 2.1s flap opening animation to finish before unlocking page
    setTimeout(() => {
      openInvitation();
    }, 2200);
  };

  return (
    <div
      id="entrance"
      className={`wax-entrance ${isOpening ? 'opening' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation Envelope"
    >
      <div className="wax-envelope-wrapper">
        {/* Underlying letter base */}
        <div className="wax-letter-base" aria-hidden="true" />

        {/* Top envelope panel (slides up on open) */}
        <div className="reference-top-slide" aria-hidden="true" />

        {/* Bottom envelope panel (slides down on open) */}
        <div className="reference-bottom-slide" aria-hidden="true" />

        {/* Dynamic Monogram nested inside the floral watercolor wreath */}
        <div
          className="wreath-monogram absolute top-[31%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 select-none text-center"
          aria-hidden="true"
        >
          <span className="font-wedding-display text-5xl sm:text-7xl text-[#463120] font-bold italic tracking-tight drop-shadow-[0_1px_2px_rgba(255,245,225,0.85)]">
            {groomInitial}&amp;{brideInitial}
          </span>
        </div>

        {/* The 3D Wax Seal Button (Exact clickable seal in artwork with glowing gold halo) */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={isOpening}
          className="wax-touch-btn"
          aria-label={language === 'ml' ? 'വിവാഹ ക്ഷണക്കത്ത് തുറക്കുക' : 'Touch the wax seal to open the wedding invitation'}
          title="Touch the wax seal to open"
        />

        {/* Opening Guidance Text */}
        <div className="wax-touch-label" aria-hidden="true">
          {language === 'ml' ? 'ക്ഷണക്കത്ത് തുറക്കാൻ ഇവിടെ തൊടുക' : 'TOUCH HERE TO OPEN'}
        </div>
      </div>
    </div>
  );
};
