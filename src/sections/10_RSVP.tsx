import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HeartHandshake, CheckCircle2, MessageCircle, Send, RefreshCw } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { buildRsvpWhatsAppUrl } from '../lib/whatsapp';
import { fireCelebrationConfetti } from '../components/lazy/LazyConfetti';
import { GoldDivider } from '../components/common/GoldDivider';

const rsvpSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your name or family name' }),
  guests: z.coerce.number().min(1, 'Minimum 1 guest').max(20, 'Maximum 20 guests'),
  attending: z.enum(['yes', 'no']),
  events: z.array(z.string()).min(1, 'Please select at least one ceremony'),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

type RsvpFormValues = z.infer<typeof rsvpSchema>;

export const RSVP: React.FC = () => {
  const { wedding, t, language } = useWedding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<RsvpFormValues | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: '',
      guests: 1,
      attending: 'yes',
      events: ['Engagement', 'Reception', 'Muhurtham'],
      message: '',
      honeypot: '',
    },
  });

  const attendingStatus = watch('attending');

  const onSubmit = async (values: RsvpFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await response.json();
      setSubmittedData(values);
      setIsSubmitted(true);
      fireCelebrationConfetti();
    } catch (err: any) {
      console.warn('Online RSVP submission failed, enabling WhatsApp fallback:', err);
      // Graceful degradation: record locally and let user confirm via WhatsApp
      setSubmittedData(values);
      setIsSubmitted(true);
      fireCelebrationConfetti();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <section id="rsvp" className="py-16 sm:py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{t.rsvp.heading}</span>
            <HeartHandshake className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-wedding-serif font-bold text-[#0F4336]">
            {language === 'ml' ? 'സാന്നിധ്യം അറിയിക്കൂ' : 'Kindly Respond'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-2 max-w-sm mx-auto">
            {t.rsvp.subheading}
          </p>
          <p className="text-xs text-[#D4AF37] font-medium mt-1">
            {t.rsvp.deadlineNote}
          </p>
          <GoldDivider variant="lotus" />
        </div>

        {/* RSVP Card */}
        <div className="relative p-6 sm:p-10 rounded-3xl glass-card border border-[#D4AF37]/35 shadow-xl">
          {isSubmitted && submittedData ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <h3 className="text-2xl font-wedding-serif font-bold text-[#0F4336]">
                {t.rsvp.successTitle}
              </h3>
              <p className="text-sm text-stone-600 font-light max-w-md mx-auto">
                {t.rsvp.successMessage}
              </p>

              {/* WhatsApp Fallback Confirmation Button */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-[#D4AF37]/30 mt-6 text-left">
                <p className="text-xs text-stone-700 font-medium mb-3">
                  {t.rsvp.whatsappFallbackPrompt}
                </p>
                <a
                  href={buildRsvpWhatsAppUrl(
                    {
                      name: submittedData.name,
                      guests: submittedData.guests,
                      attending: submittedData.attending,
                      events: submittedData.events,
                      message: submittedData.message,
                    },
                    wedding.contacts.groomSide.whatsapp
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md active:scale-98 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.rsvp.sendViaWhatsapp}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#0F4336] font-medium pt-4 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.rsvp.submitAnother}</span>
              </button>
            </div>
          ) : (
            /* RSVP Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Hidden Honeypot Field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="honeypot">Leave blank</label>
                <input
                  id="honeypot"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('honeypot')}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  {t.rsvp.nameLabel} <span className="text-[#0F4336]">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t.rsvp.namePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-stone-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 text-sm text-[#1E2723] placeholder:text-stone-400 outline-none transition-all"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Attending Radio Buttons */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  {t.rsvp.attendingLabel} <span className="text-[#0F4336]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer min-h-[44px] transition-all text-xs sm:text-sm font-semibold ${
                      attendingStatus === 'yes'
                        ? 'bg-[#0F4336] text-white border-[#0F4336] shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value="yes"
                      className="sr-only"
                      {...register('attending')}
                    />
                    <span>{t.rsvp.attendingYes}</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer min-h-[44px] transition-all text-xs sm:text-sm font-semibold ${
                      attendingStatus === 'no'
                        ? 'bg-stone-700 text-white border-stone-700 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value="no"
                      className="sr-only"
                      {...register('attending')}
                    />
                    <span>{t.rsvp.attendingNo}</span>
                  </label>
                </div>
              </div>

              {/* Number of Guests */}
              {attendingStatus === 'yes' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    {t.rsvp.guestsLabel}
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-stone-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 text-sm text-[#1E2723] outline-none transition-all cursor-pointer min-h-[44px]"
                    {...register('guests')}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ceremonies Attending */}
              {attendingStatus === 'yes' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    {t.rsvp.eventsLabel}
                  </label>
                  <div className="space-y-2">
                    {wedding.events.map((eventItem) => (
                      <label
                        key={eventItem.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={eventItem.titleEn}
                          className="w-4 h-4 accent-[#0F4336] rounded cursor-pointer"
                          {...register('events')}
                        />
                        <span className="text-xs sm:text-sm text-stone-800 font-medium">
                          {language === 'ml' ? eventItem.titleMl : eventItem.titleEn}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.events && (
                    <p className="text-xs text-red-600 mt-1">{errors.events.message}</p>
                  )}
                </div>
              )}

              {/* Blessings / Warm Wishes Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  {t.rsvp.messageLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.rsvp.messagePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-stone-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 text-sm text-[#1E2723] placeholder:text-stone-400 outline-none transition-all resize-none"
                  {...register('message')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 min-h-[48px] w-full px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E6C86E] via-[#D4AF37] to-[#B68E1B] text-[#0A2B23] font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-98 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0A2B23]" />
                    <span>{t.rsvp.submitting}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#0A2B23]" />
                    <span>{t.rsvp.submitButton}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
