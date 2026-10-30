import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations, type Language, type Translations } from '../data/translations';
import { weddingData, type WeddingConfig } from '../data/wedding';

interface WeddingContextType {
  wedding: WeddingConfig;
  updateWeddingConfig: (updated: WeddingConfig) => void;
  resetToDefaultConfig: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  guestName: string | null;
  hasOpened: boolean;
  openInvitation: () => void;
  isPlayingAudio: boolean;
  toggleAudio: () => void;
  playAudio: () => void;
  pauseAudio: () => void;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

const STORAGE_KEY_CONFIG = 'wedding_custom_config_v2';
const STORAGE_KEY_LANG = 'wedding_lang_v2';

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Wedding Configuration with LocalStorage sync (No DB needed!)
  const [wedding, setWedding] = useState<WeddingConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...weddingData,
            ...parsed,
            couple: {
              groom: { ...weddingData.couple.groom, ...(parsed.couple?.groom || {}) },
              bride: { ...weddingData.couple.bride, ...(parsed.couple?.bride || {}) },
            },
            contacts: {
              groomSide: { ...weddingData.contacts.groomSide, ...(parsed.contacts?.groomSide || {}) },
              brideSide: { ...weddingData.contacts.brideSide, ...(parsed.contacts?.brideSide || {}) },
            },
            venue: { ...weddingData.venue, ...(parsed.venue || {}) },
            events: parsed.events || weddingData.events,
            story: parsed.story || weddingData.story,
            galleryPhotos: parsed.galleryPhotos || weddingData.galleryPhotos,
            theme: parsed.theme ? { ...weddingData.theme, ...parsed.theme } : weddingData.theme,
            seo: { ...weddingData.seo, ...(parsed.seo || {}) },
            audio: { ...weddingData.audio, ...(parsed.audio || {}) },
            countdownTargetIso: parsed.countdownTargetIso || weddingData.countdownTargetIso,
            hashtag: parsed.hashtag || weddingData.hashtag,
            adminPassword: parsed.adminPassword || weddingData.adminPassword,
          };
        }
      } catch (err) {
        console.warn('Could not parse saved wedding config from localStorage:', err);
      }
    }
    return weddingData;
  });

  // Apply dynamic theme colors to root document style
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const theme = wedding.theme || weddingData.theme;
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-primary-dark', theme.primaryDark);
    root.style.setProperty('--theme-primary-light', theme.primaryLight);
    root.style.setProperty('--theme-gold', theme.gold);
    root.style.setProperty('--theme-gold-light', theme.goldLight);
    root.style.setProperty('--theme-gold-dark', theme.goldDark);
    root.style.setProperty('--theme-bg', theme.background);
    root.style.setProperty('--theme-card-bg', theme.cardBg);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-muted', theme.textMuted);

    const hexToRgb = (hex: string) => {
      const clean = hex.replace('#', '');
      const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    };

    try {
      root.style.setProperty('--theme-primary-rgb', hexToRgb(theme.primary));
      root.style.setProperty('--theme-primary-dark-rgb', hexToRgb(theme.primaryDark));
      root.style.setProperty('--theme-gold-rgb', hexToRgb(theme.gold));
      root.style.setProperty('--theme-gold-light-rgb', hexToRgb(theme.goldLight));
      root.style.setProperty('--theme-bg-rgb', hexToRgb(theme.background));
    } catch {
      // fallback
    }
  }, [wedding.theme]);

  const updateWeddingConfig = (newConfig: WeddingConfig) => {
    setWedding(newConfig);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
      } catch (e) {
        console.error('Failed to save wedding config to localStorage', e);
      }
    }
  };

  const resetToDefaultConfig = () => {
    setWedding(weddingData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_CONFIG);
    }
  };

  // 2. Language state (English / Malayalam)
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LANG) as Language;
      if (saved === 'en' || saved === 'ml') return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ml' : 'en');
  };

  const t = translations[language];

  // 3. Guest personalization via URL: ?guest=Rahul%20Family
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const guest = params.get('guest');
      if (guest && guest.trim().length > 0) {
        setGuestName(guest.trim());
      }
    }
  }, []);

  // 4. Splash open state
  const [hasOpened, setHasOpened] = useState(false);

  // 5. Background Audio player
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const audio = new Audio(wedding.audio.src);
    audio.loop = true;
    audio.preload = 'auto';
    if (wedding.audio.volume !== undefined) {
      audio.volume = Math.max(0, Math.min(1, wedding.audio.volume));
    }
    audioRef.current = audio;

    const onPlay = () => setIsPlayingAudio(true);
    const onPause = () => setIsPlayingAudio(false);
    const onEnded = () => setIsPlayingAudio(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [wedding.audio.src, wedding.audio.volume]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.warn('Audio playback prevented by browser:', err);
      });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const openInvitation = () => {
    setHasOpened(true);
    if (wedding.audio.enabledByDefault) {
      playAudio();
    }
  };

  return (
    <WeddingContext.Provider
      value={{
        wedding,
        updateWeddingConfig,
        resetToDefaultConfig,
        language,
        setLanguage,
        toggleLanguage,
        t,
        guestName,
        hasOpened,
        openInvitation,
        isPlayingAudio,
        toggleAudio,
        playAudio,
        pauseAudio,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = (): WeddingContextType => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
