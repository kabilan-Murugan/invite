import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
  onRevealed?: () => void;
  language?: 'en' | 'ml';
  dateText: string;
  dayText: string;
  muhurthamText: string;
  venueText: string;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  onRevealed,
  language = 'ml',
  dateText,
  dayText,
  muhurthamText,
  venueText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const checkTimerRef = useRef<number | null>(null);
  const hasScratchedRef = useRef<boolean>(false);
  const lastDimsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  const isMalayalam = language === 'ml';

  // Draw gold foil texture with diagonal pinstripes on canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const canvasWidth = Math.round(rect.width * dpr);
    const canvasHeight = Math.round(rect.height * dpr);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    lastDimsRef.current = { width: rect.width, height: rect.height };

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Use DPR scaling for the initial texture draw
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // 1. Base Luxury Gold Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#B38728');
    grad.addColorStop(0.2, '#E5C068');
    grad.addColorStop(0.4, '#FBF5B7');
    grad.addColorStop(0.6, '#DAA520');
    grad.addColorStop(0.85, '#AA771C');
    grad.addColorStop(1, '#8A5D10');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // 2. Diagonal Gold Texture Pinstripes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.lineWidth = 1.5;
    const spacing = 12;
    for (let x = -rect.height; x < rect.width + rect.height; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + rect.height, rect.height);
      ctx.stroke();
    }

    // 3. Subtle Inner Border
    ctx.strokeStyle = 'rgba(255, 248, 220, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);

    // 4. "SCRATCH TO REVEAL" label on foil
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;

    ctx.fillStyle = '#261B08';
    ctx.font = '600 13px "Playfair Display", Georgia, serif';
    const label = isMalayalam ? '✦ ചുരണ്ടി തീയതി കാണുക ✦' : '✦ SCRATCH TO REVEAL ✦';
    ctx.letterSpacing = '0.14em';
    ctx.fillText(label, rect.width / 2, rect.height / 2);
    ctx.restore();
  }, [isMalayalam]);

  // Handle Resize & Container sizing without wiping ongoing scratches
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    initCanvas();

    const ro = new ResizeObserver((entries) => {
      if (isRevealed || hasScratchedRef.current) return;
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (
          Math.abs(width - lastDimsRef.current.width) > 10 ||
          Math.abs(height - lastDimsRef.current.height) > 10
        ) {
          initCanvas();
        }
      }
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [initCanvas, isRevealed]);

  const revealFull = useCallback(() => {
    if (isRevealed) return;
    setIsRevealed(true);

    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#F3E198', '#FFFFFF', '#0F4336', '#B38728'],
      });
    } catch {
      // Confetti fallback
    }

    if (onRevealed) onRevealed();
  }, [isRevealed, onRevealed]);

  // Check how much of canvas has been scratched (sampled for performance)
  const checkPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const stepX = Math.max(1, Math.floor(canvas.width / 24));
    const stepY = Math.max(1, Math.floor(canvas.height / 16));
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentCount = 0;
    let totalSamples = 0;

    for (let y = 0; y < canvas.height; y += stepY) {
      for (let x = 0; x < canvas.width; x += stepX) {
        const idx = (y * canvas.width + x) * 4 + 3; // alpha channel
        if (imgData.data[idx] < 128) {
          transparentCount++;
        }
        totalSamples++;
      }
    }

    const pct = totalSamples > 0 ? Math.round((transparentCount / totalSamples) * 100) : 0;
    setScratchProgress(pct);

    // Responsive threshold: 22% scratched triggers complete reveal
    if (pct >= 22) {
      revealFull();
    }
  }, [isRevealed, revealFull]);

  // Throttled percent check
  const scheduleCheckPercent = useCallback(() => {
    if (checkTimerRef.current !== null) return;
    checkTimerRef.current = window.setTimeout(() => {
      checkPercent();
      checkTimerRef.current = null;
    }, 90);
  }, [checkPercent]);

  // Core scratching logic operating directly in raw canvas pixel coordinates
  const scratchToPoint = useCallback(
    (clientX: number, clientY: number, isStarting: boolean) => {
      if (isRevealed) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Exact pixel scaling factor to match canvas resolution
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const currentX = (clientX - rect.left) * scaleX;
      const currentY = (clientY - rect.top) * scaleY;
      const brushRadius = Math.max(26, Math.round(rect.width * 0.08)) * scaleX;

      hasScratchedRef.current = true;

      ctx.save();
      // Reset transform to identity so we draw in exact canvas pixel coordinates
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'destination-out';

      if (isStarting || !lastPointRef.current) {
        // Single circle on tap or stroke initiation
        ctx.beginPath();
        ctx.arc(currentX, currentY, brushRadius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Smooth line interpolation between consecutive points
        ctx.beginPath();
        ctx.lineWidth = brushRadius * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(currentX, currentY, brushRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      lastPointRef.current = { x: currentX, y: currentY };

      scheduleCheckPercent();
    },
    [isRevealed, scheduleCheckPercent]
  );

  // Modern Pointer Events & Native Non-Passive Touch Listeners for mobile & desktop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    let isInteracting = false;

    // Pointer Events (Unified modern touch, stylus, and mouse)
    const handlePointerDown = (e: PointerEvent) => {
      isInteracting = true;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Ignore fallback
      }
      scratchToPoint(e.clientX, e.clientY, true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isInteracting) return;
      scratchToPoint(e.clientX, e.clientY, false);
    };

    const handlePointerUp = (e: PointerEvent) => {
      isInteracting = false;
      lastPointRef.current = null;
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore fallback
      }
    };

    // Direct non-passive touch events to prevent screen scroll while scratching
    const handleTouchStart = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      isInteracting = true;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        scratchToPoint(touch.clientX, touch.clientY, true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (!isInteracting || e.touches.length === 0) return;
      const touch = e.touches[0];
      scratchToPoint(touch.clientX, touch.clientY, false);
    };

    const handleTouchEnd = () => {
      isInteracting = false;
      lastPointRef.current = null;
    };

    if (window.PointerEvent) {
      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.addEventListener('pointercancel', handlePointerUp);
    } else {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      if (window.PointerEvent) {
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerup', handlePointerUp);
        canvas.removeEventListener('pointercancel', handlePointerUp);
      } else {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, [isRevealed, scratchToPoint]);

  return (
    <div className="w-full max-w-[340px] sm:max-w-[390px] mx-auto my-6 select-none">
      <div
        ref={containerRef}
        role="progressbar"
        aria-valuenow={scratchProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative w-full h-[155px] sm:h-[170px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] bg-[#FDFBF7]"
        style={{ touchAction: 'none' }}
      >
        {/* UNDERNEATH LAYER: The Revealed Wedding Date */}
        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#FFFDFD] via-[#FDF5F7] to-[#F7E7EC]">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[var(--theme-gold-dark)] uppercase tracking-widest mb-1">
            <Sparkles className="w-3 h-3 text-[var(--theme-gold)]" />
            <span>{isMalayalam ? 'വിവാഹ തീയതി' : 'WEDDING DATE'}</span>
            <Sparkles className="w-3 h-3 text-[var(--theme-gold)]" />
          </div>

          <div className="text-xl sm:text-2xl font-serif font-bold text-[var(--theme-primary-dark)] leading-snug drop-shadow-sm">
            {dateText}
          </div>

          <div className="text-xs sm:text-sm font-semibold text-[var(--theme-gold-dark)] mt-0.5">
            {dayText} • {muhurthamText}
          </div>

          <div className="text-[11px] sm:text-xs text-stone-600 font-medium mt-1">
            📍 {venueText}
          </div>

          <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[var(--theme-primary-dark)] bg-[var(--theme-primary)]/15 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3 text-[var(--theme-primary)]" />
            <span>{isMalayalam ? 'തീയതി വെളിപ്പെടുത്തി!' : 'Date Revealed!'}</span>
          </div>
        </div>

        {/* TOP LAYER: Canvas Scratch Foil */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0 cursor-pointer z-10 touch-none select-none"
              style={{ touchAction: 'none' }}
              title={isMalayalam ? 'തീയതി കാണാൻ വിരൽ കൊണ്ട് ചുരണ്ടുക' : 'Scratch with finger or mouse to reveal date'}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Progress & Quick Reveal Controls */}
      {!isRevealed && (
        <div className="mt-3 flex flex-col items-center justify-center gap-1.5 text-center">
          {scratchProgress > 0 && (
            <div className="w-full max-w-[180px] mx-auto mb-1 flex flex-col items-center gap-1 transition-all">
              <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden border border-[#D4AF37]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E198] to-[#D4AF37] transition-all duration-150 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((scratchProgress / 22) * 100))}%` }}
                />
              </div>
              <span className="text-[10px] text-[#F3E198] font-medium tracking-wide">
                {isMalayalam
                  ? `${Math.min(100, Math.round((scratchProgress / 22) * 100))}% ചുരണ്ടി`
                  : `${Math.min(100, Math.round((scratchProgress / 22) * 100))}% scratched`}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={revealFull}
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#F3E198] hover:text-white bg-black/45 hover:bg-black/65 px-4 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-md font-medium transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isMalayalam ? 'തീയതി നേരിട്ട് കാണുക ✦' : 'Tap to reveal date instantly ✦'}</span>
          </button>
          <span className="text-[10px] text-stone-300/80">
            {isMalayalam ? 'വിരൽ കൊണ്ട് മുകളിൽ ചുരണ്ടുക' : 'Or swipe your finger across the gold foil'}
          </span>
        </div>
      )}
    </div>
  );
};
