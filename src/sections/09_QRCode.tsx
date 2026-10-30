import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, Share2, Printer, Check } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { shareInvitation } from '../lib/share';
import { GoldDivider } from '../components/common/GoldDivider';

interface QRCodeSectionProps {
  onOpenPrintable?: () => void;
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({ onOpenPrintable }) => {
  const { wedding, t, language } = useWedding();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement | null>(null);

  const siteUrl =
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : wedding.seo.siteUrl);

  const groomName = language === 'ml' ? wedding.couple.groom.nameMl : wedding.couple.groom.nameEn;
  const brideName = language === 'ml' ? wedding.couple.bride.nameMl : wedding.couple.bride.nameEn;

  // Download QR Canvas as high-resolution PNG
  const handleDownloadQr = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `karthik-ananya-wedding-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareLink = async () => {
    const result = await shareInvitation({
      title: `${groomName} & ${brideName} - Wedding Invitation`,
      text: `Together with our families, we invite you to our wedding celebrations!`,
      url: siteUrl,
    });

    if (result.fallbackCopied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="qr" className="py-16 sm:py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-xl mx-auto text-center">
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
          <QrCode className="w-3.5 h-3.5" />
          <span>{t.qr.heading}</span>
          <QrCode className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-wedding-serif font-bold text-[#0F4336]">
          {t.qr.subheading}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-light mt-2 max-w-sm mx-auto">
          {t.qr.scanPrompt}
        </p>

        <GoldDivider variant="knot" />

        {/* QR Card Container */}
        <div className="relative p-6 sm:p-8 rounded-3xl glass-card border-2 border-[#D4AF37]/40 shadow-xl max-w-sm mx-auto my-6">
          {/* Corner Florals */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

          {/* QR Code Canvas */}
          <div
            ref={qrRef}
            className="p-4 bg-white rounded-2xl shadow-inner inline-block border border-stone-200"
          >
            <QRCodeCanvas
              value={siteUrl}
              size={200}
              level="H"
              fgColor="#0F4336"
              bgColor="#FFFFFF"
              imageSettings={{
                src: '/favicon.svg',
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>

          <div className="mt-4">
            <h3 className="font-wedding-display text-2xl text-[#0F4336] font-bold">
              {groomName} &amp; {brideName}
            </h3>
            <p className="text-[11px] text-[#D4AF37] font-semibold tracking-wider uppercase mt-0.5">
              {wedding.events[2]?.dateEn}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Download PNG */}
          <button
            type="button"
            onClick={handleDownloadQr}
            className="flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-2xl bg-white border border-[#D4AF37]/40 text-[#0F4336] text-xs sm:text-sm font-semibold hover:bg-stone-50 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.qr.downloadPng}</span>
          </button>

          {/* Share Invitation Link */}
          <button
            type="button"
            onClick={handleShareLink}
            className="flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#0F4336] text-white text-xs sm:text-sm font-semibold hover:bg-[#0A2B23] active:scale-95 transition-all shadow-md cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{t.qr.linkCopied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#F3E198]" />
                <span>{t.qr.shareLink}</span>
              </>
            )}
          </button>

          {/* Printable A5 Route Trigger */}
          <button
            type="button"
            onClick={onOpenPrintable}
            className="flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#0F4336]/20 text-[#0F4336] text-xs sm:text-sm font-semibold hover:bg-[#E8DFC8] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#0F4336]" />
            <span>{t.qr.printCard}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
