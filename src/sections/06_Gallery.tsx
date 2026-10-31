import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  LayoutGrid,
  Layers,
  Sparkles,
  ZoomIn,
  Heart,
  MapPin,
  MoveHorizontal,
} from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { GoldDivider } from '../components/common/GoldDivider';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LazyLightbox = lazy(() => import('../components/lazy/LazyLightbox'));

const CATEGORIES = [
  { id: 'all', labelEn: 'All Moments', labelMl: 'എല്ലാം' },
  { id: 'traditional', labelEn: 'Traditional', labelMl: 'പരമ്പരാഗതം' },
  { id: 'sunset', labelEn: 'Sunset Vibe', labelMl: 'സന്ധ്യാഭംഗി' },
  { id: 'candid', labelEn: 'Candid Love', labelMl: 'കളിചിരികൾ' },
  { id: 'scenic', labelEn: 'Scenic Romance', labelMl: 'മനോഹര കാഴ്ചകൾ' },
] as const;

export const Gallery: React.FC = () => {
  const { wedding, t, language } = useWedding();
  const prefersReducedMotion = useReducedMotion();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'coverflow' | 'grid'>('coverflow');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Gallery photos from dynamic wedding context (editable in Admin or wedding.ts)
  const allPhotos = wedding.galleryPhotos || [];

  // Filter photos based on category pill
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return allPhotos;
    return allPhotos.filter((p) => p.category === activeCategory);
  }, [allPhotos, activeCategory]);

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  // Auto-sliding interval (3.8 seconds)
  useEffect(() => {
    if (!isAutoPlaying || isHovered || prefersReducedMotion || viewMode !== 'coverflow') return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredPhotos.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, prefersReducedMotion, viewMode, filteredPhotos.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  // Touch Swipe & Drag Handling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.touches[0].clientX - touchStartXRef.current;
    if (Math.abs(diffX) > 12) {
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsHovered(false);
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartXRef.current;
    const diffY = endY - touchStartYRef.current;

    // Trigger horizontal swipe if movement was predominantly horizontal and > 36px
    if (Math.abs(diffX) > 36 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        handleNext(); // Swiped left -> next photo
      } else {
        handlePrev(); // Swiped right -> previous photo
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  };

  // Framer Motion Pan & Drag on active center card
  const handleFramerDragEnd = (_e: any, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -36 || velocity.x < -300) {
      handleNext();
    } else if (offset.x > 36 || velocity.x > 300) {
      handlePrev();
    }
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  };

  const openLightboxForIndex = (index: number) => {
    if (isDraggingRef.current) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Slides array for yet-another-react-lightbox
  const lightboxSlides = useMemo(() => {
    return filteredPhotos.map((p) => ({
      src: p.src,
      title: language === 'ml' ? p.titleMl : p.titleEn,
      description: language === 'ml' ? p.taglineMl : p.taglineEn,
    }));
  }, [filteredPhotos, language]);

  return (
    <section
      id="gallery"
      className="py-16 sm:py-24 pb-28 sm:pb-24 px-3 sm:px-6 bg-[#FDFBF7] relative overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.gallery.heading}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-wedding-serif font-bold text-[#0F4336]">
            {language === 'ml' ? 'പ്രീ-വെഡ്ഡിംഗ് ചിത്രങ്ങൾ' : 'Captured Moments'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 font-light mt-2 max-w-md mx-auto">
            {t.gallery.subheading}
          </p>

          <GoldDivider variant="lotus" />

          {/* Top Category Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mt-4 max-w-2xl mx-auto">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const label = language === 'ml' ? cat.labelMl : cat.labelEn;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0F4336] text-[#FDFBF7] shadow-md shadow-[#0F4336]/20 ring-2 ring-[#D4AF37]/50 scale-105'
                      : 'bg-white/80 text-stone-600 hover:text-[#0F4336] hover:bg-white border border-stone-200/80 shadow-sm'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#F3E198] animate-pulse" />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Mode Switcher & Auto-Slide Indicator Pill */}
          <div className="flex items-center justify-between max-w-xl mx-auto mt-6 px-2 text-xs">
            {/* View Mode Switcher */}
            <div className="inline-flex p-1 rounded-full bg-stone-200/80 border border-stone-300/80 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode('coverflow')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'coverflow'
                    ? 'bg-[#0F4336] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#0F4336]'
                }`}
                title="3D Modern Coverflow View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Arc Flow</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0F4336] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#0F4336]'
                }`}
                title="Masonry Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>

            {/* Auto-Slide Play / Pause Toggle */}
            {viewMode === 'coverflow' && (
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/40 text-[#0F4336] text-xs font-medium shadow-sm hover:bg-white cursor-pointer transition-all"
                title={isAutoPlaying ? 'Pause Auto Slide' : 'Resume Auto Slide'}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="hidden sm:inline">Auto Sliding</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="hidden sm:inline">Play Slide</span>
                  </>
                )}
                {isAutoPlaying && !isHovered && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-0.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: MODERN 3D PERSPECTIVE COVERFLOW CAROUSEL (DEFAULT)     */}
        {/* ============================================================== */}
        {viewMode === 'coverflow' ? (
          <div className="relative py-4 sm:py-6">
            {/* 3D Perspective Stage Container with Full Touch Swipe Gestures */}
            <div
              className="relative w-full h-[400px] sm:h-[490px] flex items-center justify-center overflow-hidden touch-pan-y"
              style={{
                perspective: '1200px',
                transformStyle: 'preserve-3d',
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {filteredPhotos.map((photo, index) => {
                const count = filteredPhotos.length;
                let offset = index - activeIndex;

                if (offset > count / 2) offset -= count;
                if (offset < -count / 2) offset += count;

                const isVisible = Math.abs(offset) <= 2;
                if (!isVisible) return null;

                const isCenter = offset === 0;

                let translateX = '0%';
                let translateZ = '80px';
                let rotateY = 0;
                let scale = 1.1;
                let opacity = 1;
                let zIndex = 30;

                if (offset === -1) {
                  translateX = '-62%';
                  translateZ = '-40px';
                  rotateY = 24;
                  scale = 0.88;
                  opacity = 0.75;
                  zIndex = 20;
                } else if (offset === 1) {
                  translateX = '62%';
                  translateZ = '-40px';
                  rotateY = -24;
                  scale = 0.88;
                  opacity = 0.75;
                  zIndex = 20;
                } else if (offset === -2) {
                  translateX = '-112%';
                  translateZ = '-110px';
                  rotateY = 36;
                  scale = 0.72;
                  opacity = 0.4;
                  zIndex = 10;
                } else if (offset === 2) {
                  translateX = '112%';
                  translateZ = '-110px';
                  rotateY = -36;
                  scale = 0.72;
                  opacity = 0.4;
                  zIndex = 10;
                }

                return (
                  <motion.div
                    key={photo.id}
                    drag={isCenter ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragStart={() => {
                      isDraggingRef.current = true;
                      setIsHovered(true);
                    }}
                    onDragEnd={handleFramerDragEnd}
                    animate={{
                      x: translateX,
                      z: translateZ,
                      rotateY: rotateY,
                      scale: scale,
                      opacity: opacity,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.65,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    style={{
                      zIndex,
                      position: 'absolute',
                      transformStyle: 'preserve-3d',
                    }}
                    onClick={() => {
                      if (isDraggingRef.current) return;
                      if (isCenter) {
                        openLightboxForIndex(index);
                      } else {
                        setActiveIndex(index);
                      }
                    }}
                    className={`w-[245px] sm:w-[320px] md:w-[340px] h-[355px] sm:h-[450px] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing transition-shadow select-none ${
                      isCenter
                        ? 'shadow-[0_25px_50px_-12px_rgba(15,67,54,0.45)] ring-4 ring-[#D4AF37]/70'
                        : 'shadow-lg hover:brightness-105'
                    }`}
                  >
                    {/* Image Layer: Uses photo.src (e.g. /photos/photo-X.jpg) */}
                    <img
                      src={photo.src}
                      alt={language === 'ml' ? photo.titleMl : photo.titleEn}
                      loading="lazy"
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Top Corner Pill: Frame Counter */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-emerald-100/90 font-mono border border-white/20">
                      {index + 1} / {filteredPhotos.length}
                    </div>

                    {/* Bottom Caption Card */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                      <div className="flex items-center gap-1 text-[11px] text-[#F3E198] font-semibold mb-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        <span className="truncate">{language === 'ml' ? photo.locationMl : photo.locationEn}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-serif font-bold leading-snug drop-shadow-md">
                        {language === 'ml' ? photo.titleMl : photo.titleEn}
                      </h3>

                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100/90"
                        >
                          <span className="text-[11px] font-light truncate max-w-[200px]">
                            {language === 'ml' ? photo.taglineMl : photo.taglineEn}
                          </span>
                          <span className="p-1 rounded-full bg-[#0F4336] text-white shadow-md">
                            <ZoomIn className="w-3.5 h-3.5 text-[#F3E198]" />
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Circular Controls Bar & Swipe Indicator */}
            <div className="mt-7 flex flex-col items-center justify-center gap-3">
              {/* Swipe Guidance Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#D4AF37]/30 text-stone-600 text-[11px] font-medium shadow-sm">
                <MoveHorizontal className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span>
                  {language === 'ml'
                    ? 'ചിത്രങ്ങൾ മാറ്റാൻ ഇടത്തോട്ടും വലത്തോട്ടും സ്വൈപ്പ് ചെയ്യാം'
                    : 'Swipe left / right on photos to explore'}
                </span>
              </div>

              {/* Navigation Arrows & Counter */}
              <div className="flex items-center gap-4">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-[#D4AF37]/40 text-[#0F4336] shadow-md hover:border-[#D4AF37] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
                  aria-label="Previous photograph"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                {/* Progress Dots Indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-200/60 border border-stone-300/50">
                  {filteredPhotos.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Jump to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeIndex === idx
                          ? 'w-6 bg-[#0F4336]'
                          : 'w-2 bg-stone-400/60 hover:bg-stone-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-[#D4AF37]/40 text-[#0F4336] shadow-md hover:border-[#D4AF37] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
                  aria-label="Next photograph"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Tap to view tip */}
              <p className="text-[11px] text-stone-500 font-light flex items-center gap-1">
                <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                <span>
                  {language === 'ml'
                    ? 'വലുതായി കാണാൻ മധ്യത്തിലെ ഫോട്ടോയിൽ തൊടുക'
                    : 'Tap center photo to open full-resolution lightbox with zoom'}
                </span>
              </p>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW 2: MASONRY GRID (FOR QUICK OVERVIEW OF ALL MOMENTS)       */
          /* ============================================================== */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-6">
            {filteredPhotos.map((photo, index) => {
              const isLarge = index === 0 || index === 7;
              return (
                <div
                  key={photo.id}
                  onClick={() => openLightboxForIndex(index)}
                  className={`relative rounded-3xl overflow-hidden shadow-md group border border-[#D4AF37]/25 cursor-pointer ${
                    isLarge ? 'col-span-2 md:col-span-2' : 'col-span-1'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={language === 'ml' ? photo.titleMl : photo.titleEn}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition-all duration-500"
                    style={{ aspectRatio: isLarge ? '16 / 9' : index % 2 === 0 ? '4 / 5' : '1 / 1' }}
                  />

                  {/* Hover Caption Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                    <p className="text-xs font-serif font-bold text-[#F3E198]">
                      {language === 'ml' ? photo.titleMl : photo.titleEn}
                    </p>
                    <p className="text-[10px] text-emerald-100/80 font-light truncate">
                      {language === 'ml' ? photo.locationMl : photo.locationEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Touch Lightbox */}
      {lightboxOpen && (
        <Suspense fallback={null}>
          <LazyLightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={lightboxSlides}
          />
        </Suspense>
      )}
    </section>
  );
};
