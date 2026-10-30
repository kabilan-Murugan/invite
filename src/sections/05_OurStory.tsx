import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { GoldDivider } from '../components/common/GoldDivider';

export const OurStory: React.FC = () => {
  const { wedding, t, language } = useWedding();

  return (
    <section id="story" className="py-16 sm:py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.story.heading}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-wedding-serif font-bold text-[#0F4336]">
            {language === 'ml' ? 'ഞങ്ങളുടെ സ്നേഹയാത്ര' : 'How Forever Began'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-2 max-w-md mx-auto">
            {t.story.subheading}
          </p>
          <GoldDivider variant="paisley" />
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Golden Connecting Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#D4AF37] via-[#F3E198] to-[#D4AF37] sm:-translate-x-1/2 opacity-50" />

          <div className="space-y-12">
            {wedding.story.map((item, index) => {
              const isEven = index % 2 === 0;
              const title = language === 'ml' ? item.titleMl : item.titleEn;
              const desc = language === 'ml' ? item.descriptionMl : item.descriptionEn;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-center gap-6 pl-10 sm:pl-0 ${
                    isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Node Heart */}
                  <div className="absolute left-4 sm:left-1/2 top-6 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-[#0F4336] border-2 border-[#D4AF37] shadow-md flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-[#F3E198] fill-[#F3E198]" />
                  </div>

                  {/* Content Card */}
                  <div className="w-full sm:w-[46%] p-5 rounded-2xl glass-card border border-[#D4AF37]/30 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4EFE6]">
                        {item.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#0F4336] mb-2">
                      {title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                      {desc}
                    </p>
                  </div>

                  {/* Photo Thumbnail */}
                  <div className="w-full sm:w-[46%]">
                    <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white/80 group">
                      <img
                        src={item.image}
                        alt={title}
                        loading="lazy"
                        className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
