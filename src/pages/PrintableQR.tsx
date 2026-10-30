import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Printer, ArrowLeft, Heart, Sparkles, MapPin, Calendar } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

interface PrintableQRProps {
  onBack: () => void;
}

export const PrintableQR: React.FC<PrintableQRProps> = ({ onBack }) => {
  const { wedding } = useWedding();
  const printCardRef = useRef<HTMLDivElement | null>(null);

  const siteUrl =
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : wedding.seo.siteUrl);

  const handlePrint = () => {
    window.print();
  };

  const muhurtham = wedding.events[2] || wedding.events[0];

  return (
    <div className="min-h-screen bg-stone-100 py-6 px-4">
      {/* Non-printed Controls Bar */}
      <div className="max-w-md mx-auto mb-6 flex items-center justify-between no-print">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invitation</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0F4336] text-white text-xs font-semibold hover:bg-[#0A2B23] active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#F3E198]" />
          <span>Print A5 Card</span>
        </button>
      </div>

      {/* Printable Card Container: Formatted exactly for A5 (148mm x 210mm) */}
      <div
        ref={printCardRef}
        className="w-full max-w-[420px] mx-auto bg-[#FDFBF7] rounded-2xl shadow-xl border-4 border-[#D4AF37] p-8 text-center relative overflow-hidden"
      >
        {/* Decorative Inner Border */}
        <div className="border border-[#D4AF37]/40 p-6 rounded-xl relative">
          {/* Corner Flourishes */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />

          {/* Blessing line */}
          <div className="flex items-center justify-center gap-1 text-[11px] font-serif uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Subham Bhavatu</span>
            <Sparkles className="w-3 h-3" />
          </div>

          <p className="text-xs uppercase tracking-widest text-[#0F4336] font-medium">
            WEDDING INVITATION
          </p>

          {/* Names */}
          <h1 className="text-3xl font-wedding-display text-[#0F4336] font-bold py-2">
            {wedding.couple.groom.nameEn} <span className="text-[#D4AF37]">&amp;</span> {wedding.couple.bride.nameEn}
          </h1>

          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto my-2" />

          {/* Date & Venue */}
          <div className="my-3 space-y-1 text-xs text-stone-700">
            <div className="flex items-center justify-center gap-1.5 font-semibold text-[#0F4336]">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{muhurtham?.dateEn}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-600">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span>{muhurtham?.venueNameEn}, {wedding.venue.addressEn.split(',')[1]}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-white rounded-xl shadow-sm border border-stone-200 inline-block my-3">
            <QRCodeCanvas
              value={siteUrl}
              size={160}
              level="H"
              fgColor="#0F4336"
              bgColor="#FFFFFF"
            />
          </div>

          <p className="text-xs font-semibold text-[#0F4336] mt-1">
            Scan to View Interactive Invitation &amp; RSVP
          </p>
          <p className="text-[10px] text-stone-500 font-light mt-0.5">
            Compatible with any smartphone camera
          </p>

          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-center gap-1 text-[11px] text-[#D4AF37] font-serif font-semibold">
            <Heart className="w-3 h-3 fill-[#D4AF37]" />
            <span>{wedding.hashtag}</span>
            <Heart className="w-3 h-3 fill-[#D4AF37]" />
          </div>
        </div>
      </div>
    </div>
  );
};
