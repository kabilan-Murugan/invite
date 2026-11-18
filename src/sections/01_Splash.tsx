import React, { useState, useEffect, useRef } from 'react';
import { useWedding } from '../context/WeddingContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

type AnimationStage = 'closed' | 'opening' | 'card-out' | 'expanding';

export const Splash: React.FC = () => {
  const { wedding, hasOpened, openInvitation, playAudio, language } = useWedding();
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<AnimationStage>('closed');
  const timerRefs = useRef<number[]>([]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      timerRefs.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  if (hasOpened) return null;

  // Derives monogram initials from couple's names (e.g. K & A for Karthik & Ananya)
  const groomInitial = (wedding.couple.groom.nameEn[0] || 'K').toUpperCase();
  const brideInitial = (wedding.couple.bride.nameEn[0] || 'A').toUpperCase();

  const isMalayalam = language === 'ml';
  const groomName = isMalayalam ? wedding.couple.groom.nameMl : wedding.couple.groom.nameEn;
  const brideName = isMalayalam ? wedding.couple.bride.nameMl : wedding.couple.bride.nameEn;

  // Primary event info
  const venueTitle = isMalayalam
    ? wedding.venue.nameMl || 'ഗ്രാൻഡ് ഹയാത്ത് ബോൾഗാട്ടി, കൊച്ചി'
    : wedding.venue.nameEn || 'Grand Hyatt Bolgatty • Kochi, Kerala';

  const handleOpen = () => {
    if (stage !== 'closed') return;

    setStage('opening');

    // Trigger music on user gesture
    try {
      playAudio();
    } catch {
      // Audio autoplay policy fallback
    }

    if (prefersReducedMotion) {
      openInvitation();
      return;
    }

    // Step 1: Flap folds open (0ms - 550ms)
    // Step 2: Card glides UP out of the pocket (550ms)
    const t1 = window.setTimeout(() => {
      setStage('card-out');
    }, 550);

    // Step 3: Card expands gently and envelope fades out (2800ms)
    const t2 = window.setTimeout(() => {
      setStage('expanding');
    }, 2800);

    // Step 4: Unlock page and reveal full wedding celebration (3400ms)
    const t3 = window.setTimeout(() => {
      openInvitation();
    }, 3400);

    timerRefs.current = [t1, t2, t3];
  };

  const accelerateFinish = () => {
    timerRefs.current.forEach((id) => clearTimeout(id));
    setStage('expanding');
    const t = window.setTimeout(() => {
      openInvitation();
    }, 400);
    timerRefs.current = [t];
  };

  return (
    <div
      id="entrance"
      className={`wax-entrance stage-${stage}`}
      role="dialog"
      aria-modal="true"
      aria-label={isMalayalam ? 'വിവാഹ ക്ഷണക്കത്ത് എൻവലപ്പ്' : 'Wedding Invitation Envelope'}
      onClick={() => {
        if (stage === 'card-out') accelerateFinish();
      }}
    >
      <div className="wax-stage">
        <div className="wax-envelope-wrapper">
          {/* 1. Interior Pocket Back Wall */}
          <div className="wax-envelope-back" aria-hidden="true" />

          {/* 2. Top Flap Inside Liner (Revealed above when flap folds open in 3D) */}
          <div className="wax-flap-liner-back" aria-hidden="true" />

          {/* 3. The Letter Invitation Card (Emerges out of envelope pocket) */}
          <div
            id="invitationCard"
            className="wax-invitation-card"
            onClick={(e) => {
              e.stopPropagation();
              if (stage === 'card-out') accelerateFinish();
            }}
          >
            {/* Elegant Ornamental Gold Frame */}
            <div className="card-inner-frame" aria-hidden="true" />
            <div className="card-corner card-corner-tl" aria-hidden="true" />
            <div className="card-corner card-corner-tr" aria-hidden="true" />
            <div className="card-corner card-corner-bl" aria-hidden="true" />
            <div className="card-corner card-corner-br" aria-hidden="true" />

            {/* Auspicious Heading */}
            <div className="card-header-tag">
              {isMalayalam ? '✨ മംഗള മുഹൂർത്തം ✨' : '✨ AUSPICIOUS WEDDING ✨'}
            </div>

            {/* Couple Names */}
            <div className="card-couple-block">
              <div className={`card-names ${isMalayalam ? 'font-malayalam-display font-bold' : 'font-wedding-display'}`}>
                {groomName} &amp; {brideName}
              </div>
              <div className="card-divider" aria-hidden="true">
                <div className="card-divider-line" />
                <span className="card-divider-symbol">❦</span>
                <div className="card-divider-line" />
              </div>
            </div>

            {/* Auspicious Invitation Text */}
            <div className={`card-invite-text ${isMalayalam ? 'font-malayalam-body text-[12px] sm:text-[13px]' : 'font-wedding-serif'}`}>
              {isMalayalam
                ? 'ഞങ്ങളുടെ മംഗളകരമായ വിവാഹ ചടങ്ങിലേക്ക് കുടുംബസമേതം സ്നേഹപൂർവ്വം സ്വാഗതം ചെയ്യുന്നു.'
                : '"Together with our families, we cordially invite you to celebrate our sacred union of love & bliss."'}
            </div>

            {/* Venue & Invitation Badge (Date & Timings hidden as requested) */}
            <div className="card-footer-block">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f6efe1] border border-[#d4af37]/40 text-[#0F4336] text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider mb-2 shadow-sm">
                <span className="text-[#d4af37]">✦</span>
                <span>{isMalayalam ? 'വിവാഹ ക്ഷണക്കത്ത്' : 'WEDDING INVITATION'}</span>
                <span className="text-[#d4af37]">✦</span>
              </div>
              <div className={`card-venue ${isMalayalam ? 'font-malayalam-body text-[12px]' : ''}`}>
                {venueTitle}
              </div>
            </div>
          </div>

          {/* 4. Envelope Front Pocket (Covers lower portion of card) */}
          <div className="wax-envelope-pocket" aria-hidden="true" />

          {/* 5. Envelope Top Flap (Folds open 180deg upward in 3D) */}
          <div className="wax-envelope-flap" aria-hidden="true" />

          {/* Monogram on Top Flap Wreath */}
          <div className="wax-flap-monogram" aria-hidden="true">
            <span className="monogram-text">
              {groomInitial}&amp;{brideInitial}
            </span>
          </div>

          {/* 6. Authentic 3D Wax Seal Stamp (Clickable trigger) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            disabled={stage !== 'closed'}
            className="wax-seal-btn"
            aria-label={isMalayalam ? 'വിവാഹ ക്ഷണക്കത്ത് തുറക്കുക' : 'Touch wax seal to open wedding invitation'}
            title={isMalayalam ? 'തുറക്കാൻ തൊടുക' : 'Touch to open'}
          >
            <div className="wax-seal-halo" aria-hidden="true" />
            <img
              src="/photos/wax-seal-stamp.png"
              alt="Golden Wax Seal"
              className="wax-seal-img"
              width={86}
              height={86}
              loading="eager"
            />
          </button>

          {/* 7. Instruction Label */}
          <div className="wax-touch-label" aria-hidden="true">
            {isMalayalam ? 'ക്ഷണക്കത്ത് തുറക്കാൻ തൊടുക' : 'TOUCH HERE TO OPEN'}
          </div>
        </div>
      </div>
    </div>
  );
};
