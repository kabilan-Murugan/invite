import React, { useState, Suspense, lazy } from 'react';
import { MapPin, Navigation, Share2, Car, Hotel, Compass, Check, ChevronDown } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { shareInvitation } from '../lib/share';
import { GoldDivider } from '../components/common/GoldDivider';

const LazyMap = lazy(() => import('../components/lazy/LazyMap'));

export const VenueMap: React.FC = () => {
  const { wedding, t, language } = useWedding();
  const [copied, setCopied] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('parking');

  const venue = wedding.venue;
  const venueName = language === 'ml' ? venue.nameMl : venue.nameEn;
  const address = language === 'ml' ? venue.addressMl : venue.addressEn;
  const parkingTips = language === 'ml' ? venue.parkingTipsMl : venue.parkingTipsEn;
  const stayTips = language === 'ml' ? venue.stayTipsMl : venue.stayTipsEn;
  const landmarks = language === 'ml' ? venue.landmarksMl : venue.landmarksEn;

  const handleShareLocation = async () => {
    const result = await shareInvitation({
      title: `${venueName} - Location`,
      text: `${venueName}, ${address}`,
      url: venue.googleMapsUrl,
    });

    if (result.fallbackCopied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <section id="venue" className="py-16 sm:py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.venue.heading}</span>
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-wedding-serif font-bold text-[#0F4336]">
            {venueName}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-2 max-w-md mx-auto">
            {address}
          </p>
          <GoldDivider variant="paisley" />
        </div>

        {/* Map Container */}
        <div className="mb-8">
          <Suspense
            fallback={
              <div className="w-full h-[340px] rounded-2xl bg-stone-100 flex items-center justify-center border border-[#D4AF37]/30">
                <p className="text-sm text-stone-500 font-medium">Loading interactive venue map...</p>
              </div>
            }
          >
            <LazyMap
              lat={venue.lat}
              lng={venue.lng}
              venueName={venueName}
              address={address}
            />
          </Suspense>
        </div>

        {/* Map Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <a
            href={venue.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-2xl bg-[#0F4336] text-white text-xs sm:text-sm font-semibold hover:bg-[#0A2B23] active:scale-98 transition-all shadow-md text-center"
          >
            <MapPin className="w-4 h-4 text-[#F3E198]" />
            <span>{t.venue.openGoogleMaps}</span>
          </a>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-2xl bg-white border border-[#D4AF37]/40 text-[#0F4336] text-xs sm:text-sm font-semibold hover:bg-stone-50 active:scale-98 transition-all shadow-sm text-center"
          >
            <Navigation className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.venue.getDirections}</span>
          </a>

          <button
            type="button"
            onClick={handleShareLocation}
            className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-2xl bg-white border border-[#D4AF37]/40 text-[#0F4336] text-xs sm:text-sm font-semibold hover:bg-stone-50 active:scale-98 transition-all shadow-sm text-center cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{t.venue.copied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.venue.shareLocation}</span>
              </>
            )}
          </button>
        </div>

        {/* Expandable Travel & Stay Tips Accordion */}
        <div className="space-y-3 max-w-2xl mx-auto">
          {/* Parking & Valet */}
          <div className="rounded-2xl glass-card border border-[#D4AF37]/30 overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => toggleAccordion('parking')}
              className="w-full flex items-center justify-between p-4 text-left font-serif font-bold text-[#0F4336] cursor-pointer hover:bg-white/40"
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm sm:text-base">{t.venue.parkingTitle}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${
                  openAccordion === 'parking' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openAccordion === 'parking' && (
              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 font-light border-t border-stone-100">
                {parkingTips}
              </div>
            )}
          </div>

          {/* Stay & Accommodation */}
          <div className="rounded-2xl glass-card border border-[#D4AF37]/30 overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => toggleAccordion('stay')}
              className="w-full flex items-center justify-between p-4 text-left font-serif font-bold text-[#0F4336] cursor-pointer hover:bg-white/40"
            >
              <div className="flex items-center gap-2.5">
                <Hotel className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm sm:text-base">{t.venue.stayTitle}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${
                  openAccordion === 'stay' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openAccordion === 'stay' && (
              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 font-light border-t border-stone-100">
                {stayTips}
              </div>
            )}
          </div>

          {/* Key Landmarks */}
          <div className="rounded-2xl glass-card border border-[#D4AF37]/30 overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => toggleAccordion('landmarks')}
              className="w-full flex items-center justify-between p-4 text-left font-serif font-bold text-[#0F4336] cursor-pointer hover:bg-white/40"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm sm:text-base">{t.venue.landmarksTitle}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${
                  openAccordion === 'landmarks' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openAccordion === 'landmarks' && (
              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 font-light border-t border-stone-100">
                {landmarks}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
