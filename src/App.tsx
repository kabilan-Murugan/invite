import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { WeddingProvider } from './context/WeddingContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { PetalsCanvas } from './components/common/PetalsCanvas';
import { ScrollProgress } from './components/common/ScrollProgress';
import { Splash } from './sections/01_Splash';
import { Hero } from './sections/02_Hero';
import { InvitationMessage } from './sections/03_InvitationMessage';
import { Countdown } from './sections/04_Countdown';
import { OurStory } from './sections/05_OurStory';
import { Gallery } from './sections/06_Gallery';
import { EventDetails } from './sections/07_EventDetails';
import { VenueMap } from './sections/08_VenueMap';
import { QRCodeSection } from './sections/09_QRCode';
import { RSVP } from './sections/10_RSVP';
import { Footer } from './sections/11_Footer';
import { PrintableQR } from './pages/PrintableQR';
import { AdminPage } from './pages/AdminPage';
import { useReducedMotion } from './hooks/useReducedMotion';

type PageRoute = 'invitation' | 'qr-print' | 'admin';

const MainWeddingContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/qr' || hash === '#printable-qr') return 'qr-print';
      if (path === '/admin' || hash === '#admin') return 'admin';
    }
    return 'invitation';
  });

  const prefersReducedMotion = useReducedMotion();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (prefersReducedMotion || currentPage !== 'invitation') return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.8,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [prefersReducedMotion, currentPage]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/qr' || hash === '#printable-qr') {
        setCurrentPage('qr-print');
      } else if (path === '/admin' || hash === '#admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('invitation');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const newPath = page === 'qr-print' ? '/qr' : page === 'admin' ? '/admin' : '/';
    window.history.pushState(null, '', newPath);
  };

  if (currentPage === 'qr-print') {
    return <PrintableQR onBack={() => navigateTo('invitation')} />;
  }

  if (currentPage === 'admin') {
    return <AdminPage onBack={() => navigateTo('invitation')} />;
  }

  return (
    <div className="relative min-h-screen bg-[#FFF8F0] text-[#2D2424] overflow-x-hidden selection:bg-[#C9A227]/30 selection:text-[#6B1E2E]">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Falling Floral Rose Petals & Starlight Sparkles */}
      <PetalsCanvas />

      {/* Floating Header */}
      <Header />

      {/* Section 1: Splash Envelope Reveal */}
      <Splash />

      {/* Desktop Wrapper: Centers content in phone-first reading column or responsive two-column */}
      <main className="w-full max-w-4xl mx-auto shadow-2xl shadow-[#6B1E2E]/10 bg-[#FFF8F0] min-h-screen">
        {/* Section 2: Hero */}
        <Hero />

        {/* Section 3: Invitation Message with Guest Personalization */}
        <InvitationMessage />

        {/* Section 4: Live IST Countdown */}
        <Countdown />

        {/* Section 5: Our Story Milestones */}
        <OurStory />

        {/* Section 6: Pre-wedding Photo Gallery */}
        <Gallery />

        {/* Section 7: Auspicious Events & Calendars */}
        <EventDetails />

        {/* Section 8: Venue & Map */}
        <VenueMap />

        {/* Section 9: QR Code & Sharing */}
        <QRCodeSection onOpenPrintable={() => navigateTo('qr-print')} />

        {/* Section 10: RSVP Form */}
        <RSVP />

        {/* Section 11: Contact & Family Greetings Footer */}
        <Footer />
      </main>

      {/* Thumb-friendly Sticky Bottom Navigation (Mobile & Tablet) */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <WeddingProvider>
      <MainWeddingContent />
    </WeddingProvider>
  );
}
