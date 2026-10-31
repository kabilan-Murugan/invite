import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  XCircle,
  Download,
  Search,
  AlertCircle,
  Save,
  RotateCcw,
  Copy,
  Plus,
  Trash2,
  Calendar,
  Users,
  Image as ImageIcon,
  Clock,
  Phone,
  Palette,
  Music,
  MapPin,
  Sparkles,
  Play,
  Pause,
  Upload,
  Volume2,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import {
  type WeddingConfig,
  type StoryMilestone,
  type GalleryPhotoItem,
  type ThemeConfig,
  THEME_PRESETS,
  AUDIO_PRESETS,
} from '../data/wedding';

export type AdminTabId =
  | 'theme'
  | 'music'
  | 'couple'
  | 'events'
  | 'countdown'
  | 'story'
  | 'gallery'
  | 'venue'
  | 'contacts'
  | 'rsvps';

export interface AdminTabDef {
  id: AdminTabId;
  label: string;
  short: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

export const ADMIN_TABS: AdminTabDef[] = [
  { id: 'theme', label: 'Colors & Theme', short: 'Colors', emoji: '🎨', icon: Palette, category: 'Design' },
  { id: 'music', label: 'Music & Songs', short: 'Music', emoji: '🎵', icon: Music, category: 'Media' },
  { id: 'couple', label: 'Couple & Names', short: 'Couple', emoji: '💍', icon: Users, category: 'Details' },
  { id: 'events', label: 'Ceremonies & Dates', short: 'Events', emoji: '📅', icon: Calendar, category: 'Schedule' },
  { id: 'countdown', label: 'Countdown & SEO', short: 'Countdown', emoji: '⏳', icon: Clock, category: 'Schedule' },
  { id: 'story', label: 'Timeline (Our Story)', short: 'Timeline', emoji: '📖', icon: Sparkles, category: 'Story' },
  { id: 'gallery', label: 'Photo Gallery', short: 'Gallery', emoji: '📸', icon: ImageIcon, category: 'Media' },
  { id: 'venue', label: 'Venue, Map & Travel', short: 'Venue', emoji: '📍', icon: MapPin, category: 'Location' },
  { id: 'contacts', label: 'Contacts & Security', short: 'Contacts', emoji: '📞', icon: Phone, category: 'Security' },
  { id: 'rsvps', label: 'Guest RSVPs', short: 'RSVPs', emoji: '✉️', icon: CheckCircle, category: 'Responses' },
];

interface RsvpRecord {
  id: number;
  name: string;
  guests: number;
  attending: 'yes' | 'no';
  events: string;
  message?: string;
  created_at: string;
}

interface AdminStats {
  totalRsvps: number;
  totalGuests: number;
  attendingCount: number;
  declinedCount: number;
}

export const AdminPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { wedding, updateWeddingConfig, resetToDefaultConfig } = useWedding();

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTabId>('theme');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Flexible menu layout: 'wrap' (multi-line pills) or 'scroll' (horizontal strip with arrows)
  const [menuLayout, setMenuLayout] = useState<'wrap' | 'scroll'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('wedding_admin_menu_layout') as 'wrap' | 'scroll') || 'wrap';
    }
    return 'wrap';
  });

  const tabStripRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  const handleSetMenuLayout = (layout: 'wrap' | 'scroll') => {
    setMenuLayout(layout);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding_admin_menu_layout', layout);
    }
  };

  const scrollTabStrip = (direction: 'left' | 'right') => {
    if (tabStripRef.current) {
      const amount = direction === 'left' ? -240 : 240;
      tabStripRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Keep active tab centered in scroll view
  useEffect(() => {
    if (menuLayout === 'scroll' && activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeTab, menuLayout]);

  // Editable Draft state initialized with current wedding config
  const [formData, setFormData] = useState<WeddingConfig>(() => JSON.parse(JSON.stringify(wedding)));

  // RSVP Management state
  const [records, setRecords] = useState<RsvpRecord[]>([]);
  const [stats] = useState<AdminStats>({
    totalRsvps: 3,
    totalGuests: 6,
    attendingCount: 2,
    declinedCount: 1,
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Preview state inside Admin
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  // Clean up preview audio on unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  // Live preview color effect while tweaking inside admin
  useEffect(() => {
    if (!formData.theme) return;
    const theme = formData.theme;
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
      const num = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
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
  }, [formData.theme]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const validPassword = formData.adminPassword || wedding.adminPassword || 'wedding2026';
    // Accepts the configured password or default fallback
    if (password === validPassword || password === 'wedding2026') {
      setIsAuthenticated(true);
      setAuthError(null);
      // Sample starter RSVPs for demonstration
      setRecords([
        {
          id: 1,
          name: 'Dr. Suresh Kumar & Family',
          guests: 4,
          attending: 'yes',
          events: 'Engagement, Reception, Muhurtham',
          message: 'Heartiest congratulations to Karthik & Ananya! Wishing you endless bliss and happiness.',
          created_at: '2026-10-28 14:30:00',
        },
        {
          id: 2,
          name: 'Arjun & Meera',
          guests: 2,
          attending: 'yes',
          events: 'Reception, Muhurtham',
          message: 'Looking forward to the wonderful celebration in Kochi!',
          created_at: '2026-10-29 11:15:00',
        },
        {
          id: 3,
          name: 'Deepak Varma',
          guests: 1,
          attending: 'no',
          events: '',
          message: 'Sending our heartfelt blessings and warm wishes from Dubai.',
          created_at: '2026-10-29 18:40:00',
        },
      ]);
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handleSave = () => {
    updateWeddingConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all wedding details to original template values?')) {
      resetToDefaultConfig();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const handleCopyCode = () => {
    const code = `import { WeddingConfig, THEME_PRESETS } from './wedding';\n\nexport const weddingData: WeddingConfig = ${JSON.stringify(formData, null, 2)};\n`;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Theme preset selection
  const handleSelectPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      setFormData({
        ...formData,
        theme: { ...preset },
      });
    }
  };

  const handleCustomColorChange = (key: keyof ThemeConfig, val: string) => {
    setFormData({
      ...formData,
      theme: {
        ...formData.theme,
        presetId: 'custom',
        [key]: val,
      },
    });
  };

  // Audio Testing & Customization helpers
  const handleTogglePreviewAudio = () => {
    if (!previewAudioRef.current) {
      const audio = new Audio(formData.audio.src);
      audio.volume = formData.audio.volume ?? 0.8;
      audio.onplay = () => setIsPreviewPlaying(true);
      audio.onpause = () => setIsPreviewPlaying(false);
      audio.onended = () => setIsPreviewPlaying(false);
      previewAudioRef.current = audio;
    }

    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
    } else {
      previewAudioRef.current.src = formData.audio.src;
      previewAudioRef.current.volume = formData.audio.volume ?? 0.8;
      previewAudioRef.current.play().catch((err) => {
        console.warn('Preview playback error:', err);
      });
    }
  };

  const handleSelectAudioPreset = (preset: typeof AUDIO_PRESETS[0]) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    setFormData({
      ...formData,
      audio: {
        ...formData.audio,
        src: preset.src,
        title: preset.title,
        artist: preset.artist,
      },
    });
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        if (previewAudioRef.current) {
          previewAudioRef.current.pause();
        }
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setFormData({
          ...formData,
          audio: {
            ...formData.audio,
            src: result,
            title: cleanName,
            artist: 'Uploaded Custom Song',
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Story Milestone management helpers
  const handleAddMilestone = () => {
    const newMilestone: StoryMilestone = {
      id: String(Date.now()),
      year: '2026',
      titleEn: 'New Milestone',
      titleMl: 'പുതിയ ഓർമ്മക്കുറിപ്പ്',
      descriptionEn: 'Describe your romantic memory or milestone here...',
      descriptionMl: 'നിങ്ങളുടെ പ്രണയനിമിഷം ഇവിടെ രേഖപ്പെടുത്തുക...',
      image: '/photos/photo-1.jpg',
    };
    setFormData({
      ...formData,
      story: [...formData.story, newMilestone],
    });
  };

  const handleDeleteMilestone = (index: number) => {
    if (window.confirm('Delete this milestone memory?')) {
      const updated = formData.story.filter((_, i) => i !== index);
      setFormData({ ...formData, story: updated });
    }
  };

  // Photo Gallery management helpers
  const handleAddPhoto = () => {
    const photoNumber = formData.galleryPhotos.length + 1;
    const newPhoto: GalleryPhotoItem = {
      id: String(Date.now()),
      src: `/photos/photo-${photoNumber <= 10 ? photoNumber : '1'}.jpg`,
      titleEn: `Romantic Moment ${photoNumber}`,
      titleMl: `പ്രണയ നിമിഷം ${photoNumber}`,
      locationEn: 'Kerala, India',
      locationMl: 'കേരളം',
      taglineEn: 'Cherished pre-wedding memories',
      taglineMl: 'മനോഹരമായ നിമിഷങ്ങൾ',
      category: 'candid',
    };
    setFormData({
      ...formData,
      galleryPhotos: [...formData.galleryPhotos, newPhoto],
    });
  };

  const handleDeletePhoto = (index: number) => {
    if (window.confirm('Remove this photo from the gallery?')) {
      const updated = formData.galleryPhotos.filter((_, i) => i !== index);
      setFormData({ ...formData, galleryPhotos: updated });
    }
  };

  // CSV Export for RSVPs
  const exportToCsv = () => {
    const headers = ['ID', 'Guest Name', 'Guests Count', 'Attending', 'Ceremonies', 'Message', 'Submitted At'];
    const rows = records.map((r) => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.guests,
      r.attending,
      `"${r.events.replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      r.created_at,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.events.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.message && r.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderTabFooterNav = (tabId: AdminTabId) => {
    const currentIndex = ADMIN_TABS.findIndex((t) => t.id === tabId);
    const prevTab = currentIndex > 0 ? ADMIN_TABS[currentIndex - 1] : null;
    const nextTab = currentIndex < ADMIN_TABS.length - 1 ? ADMIN_TABS[currentIndex + 1] : null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-8 border-t border-stone-200">
        <div>
          {prevTab ? (
            <button
              type="button"
              onClick={() => {
                setActiveTab(prevTab.id);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-stone-500" />
              <span>Previous: {prevTab.emoji} {prevTab.short}</span>
            </button>
          ) : (
            <div />
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0F4336] text-white text-xs font-semibold hover:bg-[#0A2B23] active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#F3E198]" />
          <span>{saveSuccess ? 'Saved Live to Website!' : 'Save Changes'}</span>
        </button>

        <div>
          {nextTab ? (
            <button
              type="button"
              onClick={() => {
                setActiveTab(nextTab.id);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F4336]/10 text-[#0F4336] border border-[#0F4336]/20 text-xs font-semibold hover:bg-[#0F4336]/20 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>Next: {nextTab.emoji} {nextTab.short}</span>
              <ChevronRight className="w-4 h-4 text-[#0F4336]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invitation</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans pb-24">
      {/* Top Banner Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invitation</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <h1 className="font-serif font-bold text-lg text-[#0F4336]">
                  Wedding Host Editor &amp; Admin Portal
                </h1>
              </div>
              <p className="text-[11px] text-stone-500 font-light">
                Edit colors, music, couple names, ceremonies, timeline, photos, and map in 1 place (No DB required).
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F4336] text-white text-xs font-semibold hover:bg-[#0A2B23] active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-[#F3E198]" />
                <span>{saveSuccess ? 'Saved Live!' : 'Save Changes'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
                title="Copy ready-to-paste wedding.ts code"
              >
                <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
                title="Download configuration as JSON file"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl bg-white border border-stone-300 text-stone-500 hover:text-red-600 active:scale-95 transition-all cursor-pointer"
                title="Reset to template defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          /* Password Authentication Form (Clean - No password leaked) */
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-stone-200 text-center my-12">
            <div className="w-14 h-14 rounded-2xl bg-[#0F4336]/10 text-[#0F4336] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-serif font-bold text-[#0F4336] mb-2">
              Family &amp; Host Login
            </h2>
            <p className="text-xs text-stone-500 mb-6 font-light">
              Enter your family admin password to customize wedding details, music, colors, timeline, and view RSVPs.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 text-sm outline-none text-center"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 justify-center">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0F4336] text-white font-semibold text-sm hover:bg-[#0A2B23] active:scale-98 transition-all shadow-md cursor-pointer"
              >
                Unlock Editor
              </button>
            </form>
          </div>
        ) : (
          /* ============================================================== */
          /* AUTHENTICATED ALL-IN-ONE CUSTOMIZER & RSVP DASHBOARD            */
          /* ============================================================== */
          <div className="space-y-6 mt-6">
            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Changes saved successfully to browser storage! Your live website reflects this immediately.</span>
              </div>
            )}

            {/* Flexible Admin Navigation Menu */}
            <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3 sticky top-2 z-30 transition-all">
              {/* Menu Subheader: Current Section Status & Layout Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Section {ADMIN_TABS.findIndex((t) => t.id === activeTab) + 1} of {ADMIN_TABS.length}:
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4336]/10 text-[#0F4336] text-xs font-bold border border-[#0F4336]/15">
                    <span>{ADMIN_TABS.find((t) => t.id === activeTab)?.emoji}</span>
                    <span>{ADMIN_TABS.find((t) => t.id === activeTab)?.label}</span>
                  </div>
                </div>

                {/* View Layout Switcher (Wrap All vs Scroll Ribbon) */}
                <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl text-stone-600 border border-stone-200/80">
                  <button
                    type="button"
                    onClick={() => handleSetMenuLayout('wrap')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      menuLayout === 'wrap'
                        ? 'bg-white text-[#0F4336] shadow-sm font-bold'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                    title="Wrap all 10 section tabs into visible rows so none are ever cut off"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Wrap All (10)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetMenuLayout('scroll')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      menuLayout === 'scroll'
                        ? 'bg-white text-[#0F4336] shadow-sm font-bold'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                    title="Show single-line scrollable ribbon with arrow controls"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Scroll Ribbon</span>
                  </button>
                </div>
              </div>

              {/* Mobile Quick Dropdown (Visible on small screens) */}
              <div className="sm:hidden w-full">
                <div className="relative">
                  <select
                    id="admin-tab-dropdown"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value as AdminTabId)}
                    className="w-full appearance-none bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-9 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0F4336]"
                  >
                    {ADMIN_TABS.map((tab, idx) => (
                      <option key={tab.id} value={tab.id}>
                        {idx + 1}. {tab.emoji} {tab.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Tab Pills Rendering */}
              {menuLayout === 'wrap' ? (
                /* WRAP MODE: All 10 tabs wrap naturally into flexible rows - no clipping */
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {ADMIN_TABS.map((tab, idx) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#0F4336] text-white shadow-md ring-2 ring-[#D4AF37] scale-102 font-bold'
                            : 'bg-white text-stone-700 hover:text-[#0F4336] hover:bg-stone-50 border border-stone-200 hover:border-stone-400 active:scale-98'
                        }`}
                      >
                        <span className="text-sm">{tab.emoji}</span>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F3E198]' : 'text-stone-400 group-hover:text-[#0F4336]'}`} />
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* SCROLL MODE: Ribbon with smooth scroll arrow controls */
                <div className="relative flex items-center gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => scrollTabStrip('left')}
                    className="shrink-0 p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-[#0F4336] active:scale-90 shadow-sm cursor-pointer transition-all"
                    title="Scroll left"
                    aria-label="Scroll tabs left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div
                    ref={tabStripRef}
                    className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth scrollbar-thin scrollbar-thumb-stone-300 w-full"
                  >
                    {ADMIN_TABS.map((tab, idx) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          ref={isActive ? activeTabRef : undefined}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                            isActive
                              ? 'bg-[#0F4336] text-white shadow-md ring-2 ring-[#D4AF37] font-bold'
                              : 'bg-white text-stone-700 hover:text-[#0F4336] hover:bg-stone-50 border border-stone-200 hover:border-stone-400 active:scale-98'
                          }`}
                        >
                          <span className="text-sm">{tab.emoji}</span>
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F3E198]' : 'text-stone-400 group-hover:text-[#0F4336]'}`} />
                          <span>{tab.label}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                              isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollTabStrip('right')}
                    className="shrink-0 p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-[#0F4336] active:scale-90 shadow-sm cursor-pointer transition-all"
                    title="Scroll right"
                    aria-label="Scroll tabs right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: COLORS & THEME */}
            {activeTab === 'theme' && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0F4336] flex items-center gap-2">
                      <Palette className="w-5 h-5 text-[#D4AF37]" />
                      <span>Wedding Color Palette &amp; Theme Customizer</span>
                    </h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Choose a royal color preset or customize colors directly. Changes apply live across the whole website!
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-center">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Theme: {formData.theme?.name || 'Custom Theme'}</span>
                  </div>
                </div>

                {/* 1-Click Royal Theme Presets */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    1-Click Royal Wedding Color Presets
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                      const isSelected = formData.theme?.presetId === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSelectPreset(key)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-2 border-[#0F4336] bg-stone-50 shadow-md ring-2 ring-[#0F4336]/20'
                              : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-stone-800">{preset.name}</span>
                            {isSelected && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F4336] text-white">
                                Active
                              </span>
                            )}
                          </div>

                          {/* Color Swatch Bars */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-6 h-6 rounded-lg border border-black/10 shadow-sm"
                              style={{ backgroundColor: preset.primary }}
                              title={`Primary: ${preset.primary}`}
                            />
                            <span
                              className="w-6 h-6 rounded-lg border border-black/10 shadow-sm"
                              style={{ backgroundColor: preset.primaryDark }}
                              title={`Dark: ${preset.primaryDark}`}
                            />
                            <span
                              className="w-6 h-6 rounded-lg border border-black/10 shadow-sm"
                              style={{ backgroundColor: preset.gold }}
                              title={`Gold: ${preset.gold}`}
                            />
                            <span
                              className="w-6 h-6 rounded-lg border border-black/10 shadow-sm"
                              style={{ backgroundColor: preset.goldLight }}
                              title={`Light Gold: ${preset.goldLight}`}
                            />
                            <span
                              className="w-6 h-6 rounded-lg border border-black/10 shadow-sm"
                              style={{ backgroundColor: preset.background }}
                              title={`Background: ${preset.background}`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Controls */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Custom Hex Color Pickers</span>
                    <span className="text-[10px] font-normal text-stone-400 lowercase">(fine-tune any shade)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: 'Primary Brand Color', key: 'primary', desc: 'Main cards, buttons & headers' },
                      { label: 'Primary Dark Tone', key: 'primaryDark', desc: 'Gradient base & overlays' },
                      { label: 'Primary Light Tone', key: 'primaryLight', desc: 'Hover states & subtle badges' },
                      { label: 'Gold Accent Color', key: 'gold', desc: 'Borders, highlights & wax seal' },
                      { label: 'Light Gold Color', key: 'goldLight', desc: 'Shimmer text & sparkle accents' },
                      { label: 'Page Background', key: 'background', desc: 'Main ivory / sand backdrop' },
                      { label: 'Card Sand Accent', key: 'cardBg', desc: 'Secondary milestone card bg' },
                      { label: 'Body Text Color', key: 'text', desc: 'Main typography reading color' },
                    ].map((item) => {
                      const val = (formData.theme as any)?.[item.key] || '#000000';
                      return (
                        <div key={item.key} className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-stone-800">{item.label}</label>
                            <div
                              className="w-5 h-5 rounded-full border border-black/15 shadow-inner"
                              style={{ backgroundColor: val }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={val}
                              onChange={(e) => handleCustomColorChange(item.key as any, e.target.value)}
                              className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer p-0.5 bg-transparent"
                            />
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => handleCustomColorChange(item.key as any, e.target.value)}
                              className="flex-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-stone-300 text-stone-700 uppercase"
                            />
                          </div>
                          <p className="text-[10px] text-stone-400 font-light">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Interactive Preview Box */}
                <div
                  className="p-5 rounded-2xl border border-stone-200 space-y-3"
                  style={{ backgroundColor: formData.theme?.background }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Live Theme Preview
                  </span>

                  <div
                    className="p-6 rounded-2xl border max-w-md mx-auto text-center shadow-lg transition-all"
                    style={{
                      backgroundColor: formData.theme?.primary,
                      borderColor: formData.theme?.goldLight,
                      color: formData.theme?.background,
                    }}
                  >
                    <div
                      className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 border shadow-xs"
                      style={{
                        backgroundColor: `${formData.theme?.primaryDark}80`,
                        borderColor: formData.theme?.gold,
                        color: formData.theme?.goldLight,
                      }}
                    >
                      Save The Date
                    </div>

                    <h4 className="font-serif text-xl font-bold mb-1" style={{ color: formData.theme?.background }}>
                      {formData.couple.groom.nameEn} &amp; {formData.couple.bride.nameEn}
                    </h4>
                    <p className="text-xs opacity-90 font-light mb-4" style={{ color: formData.theme?.goldLight }}>
                      {formData.events[2]?.dateEn || 'Wedding Day'}
                    </p>

                    <button
                      type="button"
                      className="px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95"
                      style={{
                        backgroundColor: formData.theme?.gold,
                        color: formData.theme?.primaryDark,
                      }}
                    >
                      Confirm RSVP Attendance
                    </button>
                  </div>
                </div>

                {renderTabFooterNav('theme')}
              </div>
            )}

            {/* TAB 2: MUSIC & SONGS (NEW FULL CUSTOMIZATION) */}
            {activeTab === 'music' && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0F4336] flex items-center gap-2">
                      <Music className="w-5 h-5 text-[#D4AF37]" />
                      <span>Background Music &amp; Audio Customizer</span>
                    </h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Upload any MP3 from your device, choose from auspicious wedding melodies, or provide a custom URL.
                    </p>
                  </div>

                  {/* Live Testing Audio Button */}
                  <button
                    type="button"
                    onClick={handleTogglePreviewAudio}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer ${
                      isPreviewPlaying
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-[#0F4336] text-white hover:bg-[#0A2B23]'
                    }`}
                  >
                    {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPreviewPlaying ? 'Pause Test Audio' : 'Preview / Test Music'}</span>
                  </button>
                </div>

                {/* 1. Presets */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Select From Wedding Song Presets
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {AUDIO_PRESETS.map((preset) => {
                      const isSelected = formData.audio.src === preset.src;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectAudioPreset(preset)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-2 border-[#0F4336] bg-emerald-50/50 shadow-sm'
                              : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-stone-800">{preset.title}</span>
                            {isSelected && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F4336] text-white">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 font-medium">{preset.artist}</p>
                          <p className="text-[10px] text-stone-400 mt-2 font-light">{preset.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Device Audio Upload & Direct URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload from Phone / Laptop */}
                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-[#D4AF37]/30 space-y-3">
                    <h4 className="text-xs font-bold text-[#0F4336] uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-[#D4AF37]" />
                      <span>Upload Song From Your Device</span>
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                      Choose an MP3, WAV, or M4A audio file from your mobile or PC. It loads directly into the browser and saves with your invitation!
                    </p>

                    <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white border border-stone-300 hover:border-[#D4AF37] cursor-pointer text-xs font-semibold text-stone-700 shadow-sm hover:shadow transition-all">
                      <Upload className="w-4 h-4 text-[#0F4336]" />
                      <span>Select MP3 / Audio File</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Manual URL / Path */}
                  <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Or Enter Custom Audio Path / Web URL
                    </h4>
                    <p className="text-[11px] text-stone-500 font-light">
                      Place a file in <code>public/audio/song.mp3</code>, or paste an external HTTPS MP3 link:
                    </p>

                    <input
                      type="text"
                      value={formData.audio.src.startsWith('data:') ? '[Uploaded file from device]' : formData.audio.src}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== '[Uploaded file from device]') {
                          setFormData({
                            ...formData,
                            audio: { ...formData.audio, src: val },
                          });
                        }
                      }}
                      placeholder="/audio/song.mp3 or https://..."
                      className="w-full px-3 py-2 bg-white rounded-xl border text-xs font-mono text-stone-700"
                    />
                  </div>
                </div>

                {/* 3. Song Details & Playback Controls */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Song Display Information &amp; Playback
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Song Title (Display in Header)</label>
                      <input
                        type="text"
                        value={formData.audio.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            audio: { ...formData.audio, title: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white rounded-xl border text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Artist / Attribution</label>
                      <input
                        type="text"
                        value={formData.audio.artist}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            audio: { ...formData.audio, artist: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white rounded-xl border text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Volume Slider & Autoplay Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-stone-700 flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Background Volume</span>
                        </label>
                        <span className="text-[11px] font-mono text-stone-500">
                          {Math.round((formData.audio.volume ?? 0.8) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={formData.audio.volume ?? 0.8}
                        onChange={(e) => {
                          const vol = parseFloat(e.target.value);
                          setFormData({
                            ...formData,
                            audio: { ...formData.audio, volume: vol },
                          });
                          if (previewAudioRef.current) {
                            previewAudioRef.current.volume = vol;
                          }
                        }}
                        className="w-full accent-[#0F4336] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-2 sm:pt-4">
                      <input
                        type="checkbox"
                        id="autoplayEnvelope"
                        checked={formData.audio.enabledByDefault}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            audio: { ...formData.audio, enabledByDefault: e.target.checked },
                          })
                        }
                        className="w-4 h-4 rounded text-[#0F4336] cursor-pointer"
                      />
                      <label htmlFor="autoplayEnvelope" className="text-xs font-medium text-stone-700 cursor-pointer">
                        Start music automatically when guest taps to open envelope
                      </label>
                    </div>
                  </div>
                </div>

                {renderTabFooterNav('music')}
              </div>
            )}

            {/* TAB 3: COUPLE & NAMES */}
            {activeTab === 'couple' && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-serif font-bold text-lg text-[#0F4336]">
                    Couple &amp; Family Information
                  </h3>
                  <span className="text-xs text-stone-400">English + Malayalam</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Groom Details */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <h4 className="font-semibold text-xs text-[#0F4336] uppercase tracking-wider">
                      The Groom (വരൻ)
                    </h4>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Short Name (English)</label>
                      <input
                        type="text"
                        value={formData.couple.groom.nameEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, nameEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">പേര് (മലയാളം)</label>
                      <input
                        type="text"
                        value={formData.couple.groom.nameMl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, nameMl: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Full Title / Qualifications</label>
                      <input
                        type="text"
                        value={formData.couple.groom.fullNameEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, fullNameEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Degrees (English)</label>
                      <input
                        type="text"
                        value={formData.couple.groom.qualificationEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, qualificationEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Parents (English)</label>
                      <input
                        type="text"
                        value={formData.couple.groom.parentsEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, parentsEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">രക്ഷിതാക്കൾ (മലയാളം)</label>
                      <input
                        type="text"
                        value={formData.couple.groom.parentsMl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, parentsMl: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                  </div>

                  {/* Bride Details */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <h4 className="font-semibold text-xs text-[#0F4336] uppercase tracking-wider">
                      The Bride (വധു)
                    </h4>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Short Name (English)</label>
                      <input
                        type="text"
                        value={formData.couple.bride.nameEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, nameEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">പേര് (മലയാളം)</label>
                      <input
                        type="text"
                        value={formData.couple.bride.nameMl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, nameMl: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Full Title / Qualifications</label>
                      <input
                        type="text"
                        value={formData.couple.bride.fullNameEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, fullNameEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Degrees (English)</label>
                      <input
                        type="text"
                        value={formData.couple.bride.qualificationEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, qualificationEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Parents (English)</label>
                      <input
                        type="text"
                        value={formData.couple.bride.parentsEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, parentsEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">രക്ഷിതാക്കൾ (മലയാളം)</label>
                      <input
                        type="text"
                        value={formData.couple.bride.parentsMl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, parentsMl: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                  </div>
                </div>

                {renderTabFooterNav('couple')}
              </div>
            )}

            {/* TAB 4: CEREMONIES & DATES */}
            {activeTab === 'events' && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-serif font-bold text-lg text-[#0F4336]">
                    Ceremonies &amp; Timings (All 3 Events)
                  </h3>
                </div>

                <div className="space-y-6">
                  {formData.events.map((event, idx) => (
                    <div key={event.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between border-b pb-2 border-stone-200">
                        <span className="text-xs font-bold uppercase text-[#0F4336] flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#D4AF37]" />
                          <span>Ceremony {idx + 1}: {event.titleEn}</span>
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">key: {event.key}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">Title (English)</label>
                          <input
                            type="text"
                            value={event.titleEn}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].titleEn = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">ചടങ്ങിന്റെ പേര് (മലയാളം)</label>
                          <input
                            type="text"
                            value={event.titleMl}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].titleMl = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">Date (English)</label>
                          <input
                            type="text"
                            value={event.dateEn}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].dateEn = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">തീയതി (മലയാളം)</label>
                          <input
                            type="text"
                            value={event.dateMl}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].dateMl = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">Time (English)</label>
                          <input
                            type="text"
                            value={event.timeEn}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].timeEn = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">സമയം (മലയാളം)</label>
                          <input
                            type="text"
                            value={event.timeMl}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].timeMl = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">Venue Name (English)</label>
                          <input
                            type="text"
                            value={event.venueNameEn}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].venueNameEn = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">സ്ഥലം (മലയാളം)</label>
                          <input
                            type="text"
                            value={event.venueNameMl}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].venueNameMl = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-medium text-stone-600 block">Full Address</label>
                          <input
                            type="text"
                            value={event.addressEn}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].addressEn = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-medium text-stone-600 block">Google Maps Link</label>
                          <input
                            type="text"
                            value={event.mapLink}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].mapLink = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">Dress Code (English)</label>
                          <input
                            type="text"
                            value={event.dressCodeEn || ''}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].dressCodeEn = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">വസ്ത്രധാരണം (മലയാളം)</label>
                          <input
                            type="text"
                            value={event.dressCodeMl || ''}
                            onChange={(e) => {
                              const updated = [...formData.events];
                              updated[idx].dressCodeMl = e.target.value;
                              setFormData({ ...formData, events: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {renderTabFooterNav('events')}
              </div>
            )}

            {/* TAB 5: COUNTDOWN & SEO */}
            {activeTab === 'countdown' && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <div className="border-b pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#0F4336] flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    <span>Countdown Target &amp; SEO Sharing</span>
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-0.5">
                    Set the exact Muhurtham countdown target timestamp, wedding hashtag, and WhatsApp link preview card.
                  </p>
                </div>

                {/* Countdown Muhurtham Target */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#D4AF37]/40 space-y-2">
                  <label className="text-xs font-bold text-[#0F4336] block">
                    Target Muhurtham ISO Timestamp (Countdown Target)
                  </label>
                  <input
                    type="text"
                    value={formData.countdownTargetIso}
                    onChange={(e) => setFormData({ ...formData, countdownTargetIso: e.target.value })}
                    placeholder="YYYY-MM-DDTHH:mm:ss+05:30"
                    className="w-full max-w-md px-3 py-2 bg-white rounded-xl border text-xs font-mono"
                  />
                  <p className="text-[11px] text-stone-500">
                    Example: <code className="bg-amber-100/70 px-1 py-0.5 rounded font-mono text-[#0F4336]">2026-11-29T09:30:00+05:30</code> (IST).
                    The live counter flips down to this exact minute. Once passed, &ldquo;We&rsquo;re Married!&rdquo; displays automatically.
                  </p>
                </div>

                {/* Hashtag & SEO */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <h4 className="font-semibold text-xs text-[#0F4336] uppercase tracking-wider">
                    Hashtag &amp; SEO Sharing Card
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Wedding Hashtag</label>
                      <input
                        type="text"
                        value={formData.hashtag}
                        onChange={(e) => setFormData({ ...formData, hashtag: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono text-[#0F4336]"
                        placeholder="#KarAnanyaForever"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Website Live URL</label>
                      <input
                        type="text"
                        value={formData.seo.siteUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            seo: { ...formData.seo, siteUrl: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                        placeholder="https://karthikwedsananya.com"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-medium text-stone-600 block">Site Meta Title</label>
                      <input
                        type="text"
                        value={formData.seo.siteTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            seo: { ...formData.seo, siteTitle: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-medium text-stone-600 block">Meta Description (WhatsApp link preview)</label>
                      <textarea
                        rows={2}
                        value={formData.seo.metaDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            seo: { ...formData.seo, metaDescription: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                {renderTabFooterNav('countdown')}
              </div>
            )}

            {/* TAB 6: OUR STORY TIMELINE */}
            {activeTab === 'story' && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0F4336]">
                      Our Story Timeline
                    </h3>
                    <p className="text-[11px] text-stone-500 font-light">
                      Add, edit, or delete relationship milestones and images in your interactive story.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0F4336] text-white text-xs font-semibold hover:bg-[#0A2B23] cursor-pointer self-start"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.story.map((item, idx) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#D4AF37] uppercase">
                          Milestone #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteMilestone(idx)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">Year / Period</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => {
                              const updated = [...formData.story];
                              updated[idx].year = e.target.value;
                              setFormData({ ...formData, story: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">Title (English)</label>
                          <input
                            type="text"
                            value={item.titleEn}
                            onChange={(e) => {
                              const updated = [...formData.story];
                              updated[idx].titleEn = e.target.value;
                              setFormData({ ...formData, story: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">തലക്കെട്ട് (മലയാളം)</label>
                          <input
                            type="text"
                            value={item.titleMl}
                            onChange={(e) => {
                              const updated = [...formData.story];
                              updated[idx].titleMl = e.target.value;
                              setFormData({ ...formData, story: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">Story (English)</label>
                          <textarea
                            rows={2}
                            value={item.descriptionEn}
                            onChange={(e) => {
                              const updated = [...formData.story];
                              updated[idx].descriptionEn = e.target.value;
                              setFormData({ ...formData, story: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-600 block">വിവരണം (മലയാളം)</label>
                          <textarea
                            rows={2}
                            value={item.descriptionMl}
                            onChange={(e) => {
                              const updated = [...formData.story];
                              updated[idx].descriptionMl = e.target.value;
                              setFormData({ ...formData, story: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs resize-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-stone-600 block">Photo URL or Path</label>
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => {
                            const updated = [...formData.story];
                            updated[idx].image = e.target.value;
                            setFormData({ ...formData, story: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono text-stone-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {renderTabFooterNav('story')}
              </div>
            )}

            {/* TAB 7: PHOTO GALLERY */}
            {activeTab === 'gallery' && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0F4336]">
                      Photo Gallery Management
                    </h3>
                    <p className="text-[11px] text-stone-500 font-light">
                      Simply place photos inside <code className="font-mono bg-stone-100 px-1 py-0.5 rounded text-[#0F4336]">/public/photos/photo-1.jpg</code> etc.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0F4336] text-white text-xs font-semibold hover:bg-[#0A2B23] cursor-pointer self-start"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {/* Helpful Instruction Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  <strong>💡 How to change gallery photos easily:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                    <li>Drop your photos into <code className="bg-emerald-100 px-1 rounded">public/photos/</code> and name them <code className="bg-emerald-100 px-1 rounded">photo-1.jpg</code>, <code className="bg-emerald-100 px-1 rounded">photo-2.jpg</code>, etc.</li>
                    <li>Or, enter any external image link or uploaded file URL below.</li>
                    <li>Hit <strong>Save Changes</strong> above to see it live!</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.galleryPhotos.map((photo, idx) => (
                    <div key={photo.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex gap-4">
                      {/* Photo Thumbnail Preview */}
                      <div className="w-24 h-28 rounded-xl overflow-hidden bg-stone-200 shrink-0 border">
                        <img
                          src={photo.src}
                          alt={photo.titleEn}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/favicon.svg';
                          }}
                        />
                      </div>

                      {/* Photo Fields */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#D4AF37] uppercase">Frame {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(idx)}
                            className="text-stone-400 hover:text-red-600 p-0.5 cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-stone-500 block">Image Path</label>
                          <input
                            type="text"
                            value={photo.src}
                            onChange={(e) => {
                              const updated = [...formData.galleryPhotos];
                              updated[idx].src = e.target.value;
                              setFormData({ ...formData, galleryPhotos: updated });
                            }}
                            className="w-full px-2 py-1 bg-white rounded border text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-stone-500 block">Caption (English)</label>
                          <input
                            type="text"
                            value={photo.titleEn}
                            onChange={(e) => {
                              const updated = [...formData.galleryPhotos];
                              updated[idx].titleEn = e.target.value;
                              setFormData({ ...formData, galleryPhotos: updated });
                            }}
                            className="w-full px-2 py-1 bg-white rounded border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-stone-500 block">വിവരണം (മലയാളം)</label>
                          <input
                            type="text"
                            value={photo.titleMl}
                            onChange={(e) => {
                              const updated = [...formData.galleryPhotos];
                              updated[idx].titleMl = e.target.value;
                              setFormData({ ...formData, galleryPhotos: updated });
                            }}
                            className="w-full px-2 py-1 bg-white rounded border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-stone-500 block">Category</label>
                          <select
                            value={photo.category}
                            onChange={(e) => {
                              const updated = [...formData.galleryPhotos];
                              updated[idx].category = e.target.value as any;
                              setFormData({ ...formData, galleryPhotos: updated });
                            }}
                            className="w-full px-2 py-1 bg-white rounded border text-[11px]"
                          >
                            <option value="traditional">Traditional</option>
                            <option value="sunset">Sunset Vibe</option>
                            <option value="candid">Candid Love</option>
                            <option value="scenic">Scenic Romance</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {renderTabFooterNav('gallery')}
              </div>
            )}

            {/* TAB 8: VENUE, MAP & TRAVEL */}
            {activeTab === 'venue' && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <div className="border-b pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#0F4336] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    <span>Venue, Map Coordinates &amp; Guest Travel Tips</span>
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-0.5">
                    Configure the main wedding hall location, GPS coordinates, interactive map embed, parking and stay tips.
                  </p>
                </div>

                {/* Primary Venue Names & Addresses */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <h4 className="font-semibold text-xs text-[#0F4336] uppercase tracking-wider">
                    Hall Name &amp; Postal Address
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Venue Name (English)</label>
                      <input
                        type="text"
                        value={formData.venue.nameEn}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, nameEn: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">മണ്ഡപത്തിന്റെ പേര് (മലയാളം)</label>
                      <input
                        type="text"
                        value={formData.venue.nameMl}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, nameMl: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Full Postal Address (English)</label>
                      <textarea
                        rows={2}
                        value={formData.venue.addressEn}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, addressEn: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">പൂർണ്ണ വിലാസം (മലയാളം)</label>
                      <textarea
                        rows={2}
                        value={formData.venue.addressMl}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, addressMl: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Map Coordinates & Links */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <h4 className="font-semibold text-xs text-[#0F4336] uppercase tracking-wider">
                    GPS Coordinates &amp; Google Maps
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Latitude (e.g. 9.9912)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.venue.lat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            venue: { ...formData.venue, lat: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Longitude (e.g. 76.2872)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.venue.lng}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            venue: { ...formData.venue, lng: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-medium text-stone-600 block">Google Maps Direct Navigation URL</label>
                      <input
                        type="text"
                        value={formData.venue.googleMapsUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, googleMapsUrl: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                        placeholder="https://maps.app.goo.gl/..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-medium text-stone-600 block">Optional: Embed Map URL (iframe src)</label>
                      <input
                        type="text"
                        value={formData.venue.embedMapUrl || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, embedMapUrl: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                      />
                    </div>
                  </div>
                </div>

                {/* Parking, Stay & Landmarks */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <h4 className="font-semibold text-xs text-[#0F4336] uppercase tracking-wider">
                    Guest Advice &amp; Tips
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Parking Advice (English)</label>
                      <input
                        type="text"
                        value={formData.venue.parkingTipsEn}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, parkingTipsEn: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">പാർക്കിംഗ് വിവരങ്ങൾ (മലയാളം)</label>
                      <input
                        type="text"
                        value={formData.venue.parkingTipsMl}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, parkingTipsMl: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Stay / Accommodation (English)</label>
                      <input
                        type="text"
                        value={formData.venue.stayTipsEn}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, stayTipsEn: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">താമസം / റൂമുകൾ (മലയാളം)</label>
                      <input
                        type="text"
                        value={formData.venue.stayTipsMl}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: { ...formData.venue, stayTipsMl: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                  </div>
                </div>

                {renderTabFooterNav('venue')}
              </div>
            )}

            {/* TAB 9: CONTACTS & SECURITY SETTINGS */}
            {activeTab === 'contacts' && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <div className="border-b pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#0F4336] flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#D4AF37]" />
                    <span>Family Contacts &amp; Host Password</span>
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-0.5">
                    Provide direct calling and WhatsApp contact numbers for guests, and customize your admin password.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Groom Contact */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <h4 className="font-semibold text-xs text-[#0F4336] uppercase tracking-wider">
                      Groom’s Family Contact
                    </h4>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Contact Person Name</label>
                      <input
                        type="text"
                        value={formData.contacts.groomSide.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              groomSide: { ...formData.contacts.groomSide, name: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Relation (English)</label>
                      <input
                        type="text"
                        value={formData.contacts.groomSide.relationEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              groomSide: { ...formData.contacts.groomSide, relationEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">ബന്ധം (മലയാളം)</label>
                      <input
                        type="text"
                        value={formData.contacts.groomSide.relationMl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              groomSide: { ...formData.contacts.groomSide, relationMl: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Phone Number (Calling)</label>
                      <input
                        type="text"
                        value={formData.contacts.groomSide.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              groomSide: { ...formData.contacts.groomSide, phone: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">WhatsApp Number (e.g. 919876543210)</label>
                      <input
                        type="text"
                        value={formData.contacts.groomSide.whatsapp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              groomSide: { ...formData.contacts.groomSide, whatsapp: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Bride Contact */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <h4 className="font-semibold text-xs text-[#0F4336] uppercase tracking-wider">
                      Bride’s Family Contact
                    </h4>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Contact Person Name</label>
                      <input
                        type="text"
                        value={formData.contacts.brideSide.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              brideSide: { ...formData.contacts.brideSide, name: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Relation (English)</label>
                      <input
                        type="text"
                        value={formData.contacts.brideSide.relationEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              brideSide: { ...formData.contacts.brideSide, relationEn: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">ബന്ധം (മലയാളം)</label>
                      <input
                        type="text"
                        value={formData.contacts.brideSide.relationMl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              brideSide: { ...formData.contacts.brideSide, relationMl: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">Phone Number (Calling)</label>
                      <input
                        type="text"
                        value={formData.contacts.brideSide.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              brideSide: { ...formData.contacts.brideSide, phone: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block">WhatsApp Number (e.g. 919876543210)</label>
                      <input
                        type="text"
                        value={formData.contacts.brideSide.whatsapp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contacts: {
                              ...formData.contacts,
                              brideSide: { ...formData.contacts.brideSide, whatsapp: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Password Security Card */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#D4AF37]/40 space-y-2">
                  <h4 className="font-semibold text-xs text-[#0F4336] uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                    <span>Change Admin Login Password</span>
                  </h4>
                  <p className="text-[11px] text-stone-600 font-light">
                    Customize your secret family password for opening the <code>/admin</code> customizer.
                  </p>
                  <input
                    type="text"
                    value={formData.adminPassword || 'wedding2026'}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    className="w-full max-w-sm px-3 py-1.5 bg-white rounded-lg border text-xs font-mono"
                    placeholder="Enter new password"
                  />
                </div>

                {renderTabFooterNav('contacts')}
              </div>
            )}

            {/* TAB 10: GUEST RSVPS */}
            {activeTab === 'rsvps' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
                    <span className="text-[11px] uppercase font-bold text-stone-500">Total RSVPs</span>
                    <p className="text-2xl font-serif font-bold text-[#0F4336] mt-1">{stats.totalRsvps}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
                    <span className="text-[11px] uppercase font-bold text-stone-500">Total Guests</span>
                    <p className="text-2xl font-serif font-bold text-[#0F4336] mt-1">{stats.totalGuests}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
                    <span className="text-[11px] uppercase font-bold text-stone-500">Attending</span>
                    <p className="text-2xl font-serif font-bold text-emerald-600 mt-1">{stats.attendingCount}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
                    <span className="text-[11px] uppercase font-bold text-stone-500">Declined</span>
                    <p className="text-2xl font-serif font-bold text-stone-400 mt-1">{stats.declinedCount}</p>
                  </div>
                </div>

                {/* Submissions List & Search */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search guest name or message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={exportToCsv}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  {filteredRecords.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 text-xs font-light">
                      No matching RSVP records found.
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {filteredRecords.map((r) => (
                        <div key={r.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-stone-800">{r.name}</span>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  r.attending === 'yes'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-stone-100 text-stone-500 border border-stone-200'
                                }`}
                              >
                                {r.attending === 'yes' ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    <span>Attending ({r.guests} guests)</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 text-stone-400" />
                                    <span>Regretfully Declined</span>
                                  </>
                                )}
                              </span>
                            </div>

                            {r.events && (
                              <p className="text-[11px] text-stone-500 font-light">
                                <strong className="text-stone-700">Events:</strong> {r.events}
                              </p>
                            )}

                            {r.message && (
                              <p className="text-xs text-stone-600 italic bg-stone-50 p-2 rounded-lg border border-stone-100 mt-1">
                                &ldquo;{r.message}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="text-right text-[10px] text-stone-400 font-mono shrink-0">
                            {r.created_at}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {renderTabFooterNav('rsvps')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
