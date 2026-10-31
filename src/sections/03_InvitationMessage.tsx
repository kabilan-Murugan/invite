import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { GoldDivider } from '../components/common/GoldDivider';

export const InvitationMessage: React.FC = () => {
  const { wedding, t, language, guestName } = useWedding();

  const groom = wedding.couple.groom;
  const bride = wedding.couple.bride;

  const groomDisplay = {
    name: language === 'ml' ? groom.fullNameMl : groom.fullNameEn,
    qual: language === 'ml' ? groom.qualificationMl : groom.qualificationEn,
    parents: language === 'ml' ? groom.parentsMl : groom.parentsEn,
    home: language === 'ml' ? groom.familyHomeMl : groom.familyHomeEn,
  };

  const brideDisplay = {
    name: language === 'ml' ? bride.fullNameMl : bride.fullNameEn,
    qual: language === 'ml' ? bride.qualificationMl : bride.qualificationEn,
    parents: language === 'ml' ? bride.parentsMl : bride.parentsEn,
    home: language === 'ml' ? bride.familyHomeMl : bride.familyHomeEn,
  };

  return (
    <section id="invitation" className="py-16 sm:py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#F4EFE6] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#F4EFE6] to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="relative p-6 sm:p-10 rounded-3xl glass-card shadow-xl shadow-[#0F4336]/5 border border-[#D4AF37]/35 text-center"
        >
          {/* Sacred Mangala Slokam / Blessing */}
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif italic text-[#D4AF37] font-semibold tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.invitation.blessing}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          {/* Guest Personalization Pill */}
          <div className="my-4">
            {guestName ? (
              <div className="inline-block px-5 py-2 rounded-2xl bg-[#F4EFE6] border border-[#0F4336]/20 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-[#0F4336]/70 font-medium block">
                  {t.invitation.dearGuest}
                </span>
                <span className="text-lg sm:text-xl font-serif font-bold text-[#0F4336]">
                  {guestName}
                </span>
              </div>
            ) : (
              <h2 className="text-lg sm:text-xl font-serif text-[#0F4336] font-medium">
                {t.invitation.greetingFallback}
              </h2>
            )}
          </div>

          {/* Invitation Copy */}
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-light mt-3 mb-6 max-w-lg mx-auto">
            {t.invitation.message1}
          </p>

          <GoldDivider variant="lotus" />

          {/* Couple & Parents Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-left">
            {/* Groom's Family */}
            <div className="p-4 rounded-2xl bg-white/80 border border-[#D4AF37]/25 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                  {language === 'ml' ? 'വരൻ' : 'The Groom'}
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0F4336] mt-0.5">
                  {groomDisplay.name}
                </h3>
                <p className="text-xs text-stone-500 font-medium">{groomDisplay.qual}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <p className="text-stone-400 text-[10px] uppercase tracking-wider">
                  {language === 'ml' ? 'രക്ഷിതാക്കൾ' : 'Proud Parents'}
                </p>
                <p className="font-medium text-[#1E2723]">{groomDisplay.parents}</p>
                <p className="text-stone-400 text-[11px] mt-0.5">{groomDisplay.home}</p>
              </div>
            </div>

            {/* Bride's Family */}
            <div className="p-4 rounded-2xl bg-white/80 border border-[#D4AF37]/25 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                  {language === 'ml' ? 'വധു' : 'The Bride'}
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0F4336] mt-0.5">
                  {brideDisplay.name}
                </h3>
                <p className="text-xs text-stone-500 font-medium">{brideDisplay.qual}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <p className="text-stone-400 text-[10px] uppercase tracking-wider">
                  {language === 'ml' ? 'രക്ഷിതാക്കൾ' : 'Proud Parents'}
                </p>
                <p className="font-medium text-[#1E2723]">{brideDisplay.parents}</p>
                <p className="text-stone-400 text-[11px] mt-0.5">{brideDisplay.home}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed font-light max-w-lg mx-auto">
            {t.invitation.message2}
          </p>

          {/* Invitation Signed Off */}
          <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-center gap-2 text-xs font-serif italic text-[#0F4336]">
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
            <span>{t.invitation.invitationBy}</span>
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
