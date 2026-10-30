import React, { useState } from 'react';
import { Phone, MessageCircle, Copy, Check, Heart } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { buildDirectContactWhatsAppUrl } from '../lib/whatsapp';
import { GoldDivider } from '../components/common/GoldDivider';

export const Footer: React.FC = () => {
  const { wedding, t, language } = useWedding();
  const [hashtagCopied, setHashtagCopied] = useState(false);

  const groomSide = wedding.contacts.groomSide;
  const brideSide = wedding.contacts.brideSide;

  const handleCopyHashtag = async () => {
    try {
      await navigator.clipboard.writeText(wedding.hashtag);
      setHashtagCopied(true);
      setTimeout(() => setHashtagCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <footer id="contact" className="pt-16 pb-28 md:pb-16 px-4 bg-[#0A2B23] text-[#FDFBF7] relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0F4336]/60 via-[#0A2B23] to-[#04130F]" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#F3E198] font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
            <span>{t.contact.heading}</span>
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-wedding-serif font-bold text-[#FDFBF7]">
            {t.contact.subheading}
          </h2>
          <GoldDivider variant="lotus" />
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Groom's Family Contact */}
          <div className="p-6 rounded-3xl glass-card-emerald border border-[#F3E198]/30 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#F3E198] font-bold">
                {language === 'ml' ? groomSide.relationMl : groomSide.relationEn}
              </span>
              <h3 className="text-lg font-serif font-bold text-white mt-1">
                {groomSide.name}
              </h3>
              <p className="text-xs text-emerald-100/70 mt-0.5">{groomSide.phone}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <a
                href={`tel:${groomSide.phone}`}
                className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] text-xs font-semibold border border-white/20 active:scale-95 transition-all text-center"
              >
                <Phone className="w-3.5 h-3.5 text-[#F3E198]" />
                <span>Call</span>
              </a>

              <a
                href={buildDirectContactWhatsAppUrl(groomSide.whatsapp, `Hello! Regarding the wedding celebrations of ${wedding.couple.groom.nameEn} & ${wedding.couple.bride.nameEn}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold active:scale-95 transition-all shadow-md text-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Bride's Family Contact */}
          <div className="p-6 rounded-3xl glass-card-emerald border border-[#F3E198]/30 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#F3E198] font-bold">
                {language === 'ml' ? brideSide.relationMl : brideSide.relationEn}
              </span>
              <h3 className="text-lg font-serif font-bold text-white mt-1">
                {brideSide.name}
              </h3>
              <p className="text-xs text-emerald-100/70 mt-0.5">{brideSide.phone}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <a
                href={`tel:${brideSide.phone}`}
                className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] text-xs font-semibold border border-white/20 active:scale-95 transition-all text-center"
              >
                <Phone className="w-3.5 h-3.5 text-[#F3E198]" />
                <span>Call</span>
              </a>

              <a
                href={buildDirectContactWhatsAppUrl(brideSide.whatsapp, `Hello! Regarding the wedding celebrations of ${wedding.couple.groom.nameEn} & ${wedding.couple.bride.nameEn}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold active:scale-95 transition-all shadow-md text-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Wedding Hashtag Pill */}
        <div className="text-center mb-10">
          <button
            type="button"
            onClick={handleCopyHashtag}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card-emerald border border-[#F3E198]/40 text-[#F3E198] text-sm sm:text-base font-serif font-bold tracking-wider hover:border-[#F3E198] active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span>{wedding.hashtag}</span>
            {hashtagCopied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-emerald-200/80" />
            )}
          </button>
          <p className="text-[11px] text-emerald-100/60 mt-2">
            {hashtagCopied ? t.contact.hashtagCopied : t.contact.copyHashtag}
          </p>
        </div>

        {/* With Love & Copyright Footer */}
        <div className="border-t border-[#F3E198]/20 pt-8 text-center text-xs text-emerald-100/60 space-y-2">
          <p className="font-serif italic text-sm text-emerald-100/90">
            {t.contact.withLove}
          </p>
          <p className="text-[11px] font-light">
            {t.contact.credit}
          </p>
        </div>
      </div>
    </footer>
  );
};
