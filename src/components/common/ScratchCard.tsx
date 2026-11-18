import React, { useRef, useState, useEffect } from 'react';
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
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  const isMalayalam = language === 'ml';

  // Draw gold foil texture with diagonal pinstripes on canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // 1. Base Gold Gradient
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#B38728');
    grad.addColorStop(0.3, '#FBF5B7');
    grad.addColorStop(0.5, '#DAA520');
    grad.addColorStop(0.7, '#AA771C');
    grad.addColorStop(1, '#8A5D10');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // 2. Diagonal Gold Texture Pinstripes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.5;
    const spacing = 12;
    for (let x = -rect.height; x < rect.width + rect.height; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + rect.height, rect.height);
      ctx.stroke();
    }

    // 3. Subtle Inner Border
    ctx.strokeStyle = 'rgba(255, 248, 220, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);

    // 4. "SCRATCH TO REVEAL" label on foil
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;

    ctx.fillStyle = '#261B08';
    ctx.font = '600 13px "Playfair Display", Georgia, serif';
    const label = isMalayalam ? '✦ ചുരണ്ടി തീയതി കാണുക ✦' : '✦ SCRATCH TO REVEAL ✦';
    ctx.letterSpacing = '0.14em';
    ctx.fillText(label, rect.width / 2, rect.height / 2);
    ctx.restore();
  };

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      if (!isRevealed) initCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isRevealed, isMalayalam]);

  // Scratch handling
  const scratchAt = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    checkPercent();
  };

  // Check how much of canvas has been scratched
  const checkPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sample pixels across a 30x20 grid to be extremely lightweight
    const stepX = Math.floor(canvas.width / 30);
    const stepY = Math.floor(canvas.height / 20);
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

    const pct = Math.round((transparentCount / totalSamples) * 100);

    if (pct >= 38) {
      revealFull();
    }
  };

  const revealFull = () => {
    if (isRevealed) return;
    setIsRevealed(true);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#F3E198', '#FFFFFF', '#0F4336'],
      });
    } catch {
      // Confetti fallback
    }

    if (onRevealed) onRevealed();
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    const touch = e.touches[0];
    scratchAt(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratching) return;
    const touch = e.touches[0];
    scratchAt(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratchAt(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    scratchAt(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  return (
    <div className="w-full max-w-[340px] sm:max-w-[380px] mx-auto my-6 select-none">
      <div
        ref={containerRef}
        className="relative w-full h-[150px] sm:h-[165px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] bg-[#FDFBF7]"
        style={{ touchAction: 'none' }}
      >
        {/* UNDERNEATH LAYER: The Revealed Wedding Date */}
        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#FFFDF9] via-[#FAF5E9] to-[#F3EAD5]">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#8C680A] uppercase tracking-widest mb-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>{isMalayalam ? 'വിവാഹ തീയതി' : 'WEDDING DATE'}</span>
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          </div>

          <div className="text-xl sm:text-2xl font-serif font-bold text-[#0F4336] leading-snug drop-shadow-sm">
            {dateText}
          </div>

          <div className="text-xs sm:text-sm font-semibold text-[#8C680A] mt-0.5">
            {dayText} • {muhurthamText}
          </div>

          <div className="text-[11px] sm:text-xs text-stone-600 font-medium mt-1">
            📍 {venueText}
          </div>

          <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#0F4336] bg-emerald-100/60 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3 text-emerald-600" />
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
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="absolute inset-0 cursor-pointer z-10"
              title={isMalayalam ? 'തീയതി കാണാൻ വിരൽ കൊണ്ട് ചുരണ്ടുക' : 'Scratch with finger or mouse to reveal date'}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Accessible Quick Reveal Button & Hint */}
      {!isRevealed && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={revealFull}
            className="text-[11px] sm:text-xs text-[#F3E198]/90 hover:text-white underline underline-offset-4 font-medium transition-colors cursor-pointer"
          >
            {isMalayalam ? 'നേരിട്ട് തീയതി കാണാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക ✦' : 'Click here to instantly reveal date ✦'}
          </button>
        </div>
      )}
    </div>
  );
};
