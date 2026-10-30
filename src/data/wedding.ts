export interface WeddingEvent {
  id: string;
  key: 'engagement' | 'reception' | 'muhurtham';
  titleEn: string;
  titleMl: string;
  taglineEn: string;
  taglineMl: string;
  dateEn: string;
  dateMl: string;
  timeEn: string;
  timeMl: string;
  startDateIso: string; // ISO 8601 for calendar (IST: +05:30)
  endDateIso: string;
  venueNameEn: string;
  venueNameMl: string;
  addressEn: string;
  addressMl: string;
  mapLink: string;
  dressCodeEn?: string;
  dressCodeMl?: string;
  iconName: 'ring' | 'celebration' | 'mandapam';
}

export interface StoryMilestone {
  id: string;
  year: string;
  titleEn: string;
  titleMl: string;
  descriptionEn: string;
  descriptionMl: string;
  image: string;
}

export interface GalleryPhotoItem {
  id: string;
  src: string; // e.g. '/photos/photo-1.jpg'
  titleEn: string;
  titleMl: string;
  locationEn: string;
  locationMl: string;
  taglineEn: string;
  taglineMl: string;
  category: 'all' | 'traditional' | 'sunset' | 'candid' | 'scenic';
}

export interface ThemeConfig {
  presetId: 'emerald' | 'maroon' | 'rose' | 'sapphire' | 'plum' | 'terracotta' | 'custom';
  name: string;
  primary: string;         // Main brand color (e.g. #0F4336)
  primaryDark: string;     // Deep header / gradient start (e.g. #0A2B23)
  primaryLight: string;    // Soft button hover / border (e.g. #1A5E4C)
  gold: string;            // Primary gold accent (e.g. #D4AF37)
  goldLight: string;       // Light gold / badges (e.g. #F3E198)
  goldDark: string;        // Deep bronze / shadow (e.g. #987413)
  background: string;      // Body background (e.g. #FDFBF7)
  cardBg: string;          // Card secondary background (e.g. #F4EFE6)
  text: string;            // Primary dark text (e.g. #1E2723)
  textMuted: string;       // Secondary subtitle text (e.g. #4B5A53)
}

export const THEME_PRESETS: Record<string, ThemeConfig> = {
  emerald: {
    presetId: 'emerald',
    name: 'Royal Kerala Emerald & Kasavu Gold',
    primary: '#0F4336',
    primaryDark: '#0A2B23',
    primaryLight: '#1A5E4C',
    gold: '#D4AF37',
    goldLight: '#F3E198',
    goldDark: '#987413',
    background: '#FDFBF7',
    cardBg: '#F4EFE6',
    text: '#1E2723',
    textMuted: '#4B5A53',
  },
  maroon: {
    presetId: 'maroon',
    name: 'Royal Chettinad Maroon & Antique Gold',
    primary: '#6B1E2E',
    primaryDark: '#45101C',
    primaryLight: '#8B263E',
    gold: '#C9A227',
    goldLight: '#F5D77F',
    goldDark: '#8F7114',
    background: '#FFF8F0',
    cardBg: '#F7ECE1',
    text: '#2B1810',
    textMuted: '#5C4A42',
  },
  rose: {
    presetId: 'rose',
    name: 'Romantic Sunset Rose & Champagne',
    primary: '#832232',
    primaryDark: '#54121E',
    primaryLight: '#A32F42',
    gold: '#D49B6A',
    goldLight: '#F7DAC1',
    goldDark: '#9B6638',
    background: '#FDF7F7',
    cardBg: '#F7EDED',
    text: '#29181B',
    textMuted: '#5C464A',
  },
  sapphire: {
    presetId: 'sapphire',
    name: 'Royal Sapphire Peacock & Golden Zari',
    primary: '#10375C',
    primaryDark: '#0A2138',
    primaryLight: '#1C5285',
    gold: '#DDA136',
    goldLight: '#F9DC8A',
    goldDark: '#9E6D18',
    background: '#F7F9FC',
    cardBg: '#ECF1F7',
    text: '#14202B',
    textMuted: '#485866',
  },
  plum: {
    presetId: 'plum',
    name: 'Temple Plum / Violet & Kasavu Gold',
    primary: '#4A154B',
    primaryDark: '#2D0A2E',
    primaryLight: '#6B226C',
    gold: '#D4AF37',
    goldLight: '#F3E198',
    goldDark: '#987413',
    background: '#FAF6FA',
    cardBg: '#F2E8F3',
    text: '#241424',
    textMuted: '#594559',
  },
  terracotta: {
    presetId: 'terracotta',
    name: 'Warm Terracotta & Sandalwood Gold',
    primary: '#9E4733',
    primaryDark: '#6D2E20',
    primaryLight: '#BD5941',
    gold: '#D4AF37',
    goldLight: '#F1DC9B',
    goldDark: '#94761E',
    background: '#FDF9F5',
    cardBg: '#F4EAE2',
    text: '#291B16',
    textMuted: '#5C4942',
  },
};

export interface AudioTrackConfig {
  src: string;
  title: string;
  artist: string;
  enabledByDefault: boolean;
  volume?: number;
}

export interface AudioPreset {
  id: string;
  title: string;
  artist: string;
  src: string;
  description: string;
}

export const AUDIO_PRESETS: AudioPreset[] = [
  {
    id: 'kerala-nadaswaram',
    title: 'Traditional Kerala Nadaswaram & Thakil',
    artist: 'Temple Mangala Ensemble',
    src: '/audio/song.mp3',
    description: 'Auspicious classical temple wedding melody (bundled in /public/audio/song.mp3).',
  },
  {
    id: 'soft-flute',
    title: 'Romantic Bamboo Flute Harmony',
    artist: 'Kalyana Vasantham Ensemble',
    src: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c976985a22.mp3?filename=indian-flute-112185.mp3',
    description: 'Soft, soulful bansuri flute for a graceful romantic ambience.',
  },
  {
    id: 'carnatic-veena',
    title: 'Sacred Veena & Tanpura Swaram',
    artist: 'Carnatic Strings',
    src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=meditative-indian-classical-10023.mp3',
    description: 'Meditative and traditional morning celebration music.',
  },
];

export interface WeddingConfig {
  adminPassword?: string;
  theme: ThemeConfig;
  couple: {
    groom: {
      nameEn: string;
      nameMl: string;
      fullNameEn: string;
      fullNameMl: string;
      qualificationEn: string;
      qualificationMl: string;
      parentsEn: string;
      parentsMl: string;
      familyHomeEn: string;
      familyHomeMl: string;
    };
    bride: {
      nameEn: string;
      nameMl: string;
      fullNameEn: string;
      fullNameMl: string;
      qualificationEn: string;
      qualificationMl: string;
      parentsEn: string;
      parentsMl: string;
      familyHomeEn: string;
      familyHomeMl: string;
    };
  };
  hashtag: string;
  seo: {
    siteTitle: string;
    metaDescription: string;
    ogImage: string;
    siteUrl: string;
    noindex: boolean;
  };
  // Muhurtham target for live IST countdown
  countdownTargetIso: string;
  events: WeddingEvent[];
  story: StoryMilestone[];
  galleryPhotos: GalleryPhotoItem[];
  contacts: {
    groomSide: {
      name: string;
      relationEn: string;
      relationMl: string;
      phone: string;
      whatsapp: string;
    };
    brideSide: {
      name: string;
      relationEn: string;
      relationMl: string;
      phone: string;
      whatsapp: string;
    };
  };
  venue: {
    nameEn: string;
    nameMl: string;
    addressEn: string;
    addressMl: string;
    lat: number;
    lng: number;
    googleMapsUrl: string;
    embedMapUrl?: string;
    parkingTipsEn: string;
    parkingTipsMl: string;
    stayTipsEn: string;
    stayTipsMl: string;
    landmarksEn: string;
    landmarksMl: string;
  };
  audio: AudioTrackConfig;
}

export const weddingData: WeddingConfig = {
  adminPassword: 'wedding2026',
  theme: THEME_PRESETS.emerald,
  couple: {
    groom: {
      nameEn: 'Karthik',
      nameMl: 'കാർത്തിക്',
      fullNameEn: 'Er. Karthik Menon',
      fullNameMl: 'എൻജി. കാർത്തിക് മേനോൻ',
      qualificationEn: 'B.Tech, MBA',
      qualificationMl: 'ബി.ടെക്, എം.ബി.എ',
      parentsEn: 'Mr. K. Narayanan & Mrs. Shailaja Menon',
      parentsMl: 'ശ്രീ. കെ. നാരായണൻ & ശ്രീമതി. ശൈലജ മേനോൻ',
      familyHomeEn: 'Thrissur, Kerala',
      familyHomeMl: 'തൃശ്ശൂർ, കേരളം',
    },
    bride: {
      nameEn: 'Ananya',
      nameMl: 'അനന്യ',
      fullNameEn: 'Dr. Ananya Nair',
      fullNameMl: 'ഡോ. അനന്യ നായർ',
      qualificationEn: 'MBBS, MD (Paediatrics)',
      qualificationMl: 'എം.ബി.ബി.എസ്, എം.ഡി (പീഡിയാട്രിക്സ്)',
      parentsEn: 'Mr. M. Radhakrishnan & Mrs. Lakshmi Nair',
      parentsMl: 'ശ്രീ. എം. രാധാകൃഷ്ണൻ & ശ്രീമതി. ലക്ഷ്മി നായർ',
      familyHomeEn: 'Kochi, Kerala',
      familyHomeMl: 'കൊച്ചി, കേരളം',
    },
  },
  hashtag: '#KarAnanyaForever',
  seo: {
    siteTitle: 'Karthik & Ananya | Wedding Invitation',
    metaDescription: 'Together with our families, we invite you to celebrate our wedding ceremony and reception.',
    ogImage: '/og-image.jpg',
    siteUrl: 'https://karthikwedsananya.com',
    noindex: false,
  },
  // Target muhurtham IST: 2026-11-29 09:30:00 IST (+05:30)
  countdownTargetIso: '2026-11-29T09:30:00+05:30',
  events: [
    {
      id: 'engagement',
      key: 'engagement',
      titleEn: 'Nichayathartham (Engagement)',
      titleMl: 'വിവാഹനിശ്ചയം',
      taglineEn: 'The traditional betrothal ceremony & exchange of rings',
      taglineMl: 'മോതിരമാറ്റവും ബന്ധുക്കളുടെ അനുഗ്രഹാശിസ്സുകളും',
      dateEn: 'Saturday, November 28, 2026',
      dateMl: 'ശനിയാഴ്ച, നവംബർ 28, 2026',
      timeEn: '10:00 AM – 12:30 PM (Lunch follows)',
      timeMl: 'രാവിലെ 10:00 – 12:30 മണി (തുടർന്ന് വിഭവസമൃദ്ധമായ സദ്യ)',
      startDateIso: '2026-11-28T10:00:00+05:30',
      endDateIso: '2026-11-28T14:00:00+05:30',
      venueNameEn: 'The Grand Heritage Palace Auditorium',
      venueNameMl: 'ദി ഗ്രാൻഡ് ഹെറിറ്റേജ് പാലസ് ഓഡിറ്റോറിയം',
      addressEn: 'Marine Drive, Kochi, Kerala 682031',
      addressMl: 'മറൈൻ ഡ്രൈവ്, കൊച്ചി, കേരളം 682031',
      mapLink: 'https://maps.google.com/?q=9.9816,76.2750',
      dressCodeEn: 'Traditional Kasavu Saree / Kurta or Ethnic Wear',
      dressCodeMl: 'കേരള കസവ് സാരി / കുർത്ത / പരമ്പരാഗത വസ്ത്രം',
      iconName: 'ring',
    },
    {
      id: 'reception',
      key: 'reception',
      titleEn: 'Wedding Reception',
      titleMl: 'വിവാഹ സൽക്കാരം',
      taglineEn: 'An evening of music, dining, blessings and laughter',
      taglineMl: 'ഇമ്പമാർന്ന സംഗീതവും സ്നേഹവിരുന്നും മംഗളാശംസകളും',
      dateEn: 'Saturday, November 28, 2026',
      dateMl: 'ശനിയാഴ്ച, നവംബർ 28, 2026',
      timeEn: '06:30 PM onwards (Dinner follows)',
      timeMl: 'വൈകുന്നേരം 06:30 മണി മുതൽ (തുടർന്ന് രാത്രി ഭക്ഷണം)',
      startDateIso: '2026-11-28T18:30:00+05:30',
      endDateIso: '2026-11-28T22:30:00+05:30',
      venueNameEn: 'The Grand Heritage Palace Auditorium',
      venueNameMl: 'ദി ഗ്രാൻഡ് ഹെറിറ്റേജ് പാലസ് ഓഡിറ്റോറിയം',
      addressEn: 'Marine Drive, Kochi, Kerala 682031',
      addressMl: 'മറൈൻ ഡ്രൈവ്, കൊച്ചി, കേരളം 682031',
      mapLink: 'https://maps.google.com/?q=9.9816,76.2750',
      dressCodeEn: 'Evening Elegance / Indo-Western / Formal Attire',
      dressCodeMl: 'ഈവനിംഗ് ഡ്രസ്സ് / ഇൻഡോ-വെസ്റ്റേൺ / ഫോർമൽ',
      iconName: 'celebration',
    },
    {
      id: 'muhurtham',
      key: 'muhurtham',
      titleEn: 'Auspicious Muhurtham & Thalikettu',
      titleMl: 'ശുഭ മുഹൂർത്തം & താലികെട്ട്',
      taglineEn: 'The sacred holy vows and tying of the mangalsutra',
      taglineMl: 'മാംഗല്യധാരണവും സപ്തപദിയും നടക്കുന്ന പുണ്യ മുഹൂർത്തം',
      dateEn: 'Sunday, November 29, 2026',
      dateMl: 'ഞായറാഴ്ച, നവംബർ 29, 2026',
      timeEn: '09:00 AM – 10:30 AM (Traditional Sadya follows)',
      timeMl: 'രാവിലെ 09:00 – 10:30 മണി (തുടർന്ന് വിഭവസമൃദ്ധമായ കല്യാണസദ്യ)',
      startDateIso: '2026-11-29T09:00:00+05:30',
      endDateIso: '2026-11-29T13:30:00+05:30',
      venueNameEn: 'The Grand Heritage Palace Auditorium',
      venueNameMl: 'ദി ഗ്രാൻഡ് ഹെറിറ്റേജ് പാലസ് ഓഡിറ്റോറിയം',
      addressEn: 'Marine Drive, Kochi, Kerala 682031',
      addressMl: 'മറൈൻ ഡ്രൈവ്, കൊച്ചി, കേരളം 682031',
      mapLink: 'https://maps.google.com/?q=9.9816,76.2750',
      dressCodeEn: 'Pure Traditional Kasavu Mundu & Pattu Pavada',
      dressCodeMl: 'പരമ്പരാഗത കേരള കസവ് മുണ്ട് & പട്ടുസാരി',
      iconName: 'mandapam',
    },
  ],
  story: [
    {
      id: '1',
      year: 'August 2022',
      titleEn: 'The First Hello',
      titleMl: 'ആദ്യ കൂടിക്കാഴ്ച',
      descriptionEn: 'A quiet monsoon evening at a Fort Kochi cafe where our conversations flowed effortlessly for four magical hours.',
      descriptionMl: 'ഫോർട്ട് കൊച്ചിയിലെ ഒരു മഴ വൈകുന്നേരത്ത് തുടങ്ങിയ ഞങ്ങളുടെ സംസാരം മണിക്കൂറുകളോളം നീണ്ടുപോയി.',
      image: '/photos/photo-1.jpg',
    },
    {
      id: '2',
      year: 'April 2024',
      titleEn: 'Munnar Mist Walk',
      titleMl: 'മൂന്നാറിലെ മഞ്ഞുയാത്ര',
      descriptionEn: 'Standing amidst misty tea gardens in Munnar, we realized that life is best explored hand in hand.',
      descriptionMl: 'മൂന്നാറിലെ കോടമഞ്ഞിനിടയിലൂടെ നടക്കുമ്പോൾ ഞങ്ങൾ തിരിച്ചറിഞ്ഞു, ജീവിതപാതയിൽ നമ്മൾ ഒന്നിച്ചുണ്ടാവണമെന്ന്.',
      image: '/photos/photo-2.jpg',
    },
    {
      id: '3',
      year: 'December 2025',
      titleEn: 'Families United',
      titleMl: 'കുടുംബങ്ങളുടെ സംഗമം',
      descriptionEn: 'Both our families met over warm Kerala sadya and sweets, blending traditions with heartfelt blessings.',
      descriptionMl: 'ഇരു കുടുംബങ്ങളും ഒന്നിച്ചിരുന്ന് സ്നേഹത്തോടെയും ആദരവോടെയും ഞങ്ങളുടെ വിവാഹം ഉറപ്പിച്ചു.',
      image: '/photos/photo-3.jpg',
    },
    {
      id: '4',
      year: 'November 2026',
      titleEn: 'The Forever Chapter',
      titleMl: 'പുതിയ തുടക്കം',
      descriptionEn: 'With hearts full of love and gratitude, we step into our forever journey with all your blessings.',
      descriptionMl: 'നിങ്ങളുടെ ഏവരുടെയും പ്രാർത്ഥനകളോടും അനുഗ്രഹങ്ങളോടും കൂടി ഞങ്ങൾ പുതിയ ജീവിതത്തിലേക്ക് കാൽവെക്കുന്നു.',
      image: '/photos/photo-4.jpg',
    },
  ],
  galleryPhotos: [
    {
      id: 'photo-1',
      src: '/photos/photo-1.jpg',
      titleEn: 'Sunset Shore Harmony',
      titleMl: 'പൊൻസന്ധ്യ തീരത്തെ പ്രണയം',
      locationEn: 'Fort Kochi Beach',
      locationMl: 'ഫോർട്ട് കൊച്ചി ബീച്ച്',
      taglineEn: 'Where golden twilight whispered the first vow of eternity.',
      taglineMl: 'പൊൻസന്ധ്യയുടെ ശോഭയിൽ വിരിഞ്ഞ സ്നേഹനിമിഷം.',
      category: 'sunset',
    },
    {
      id: 'photo-2',
      src: '/photos/photo-2.jpg',
      titleEn: 'Traditional Kasavu Radiance',
      titleMl: 'കേരള കസവിന്റെ തനിമ',
      locationEn: 'Heritage Nalukettu Courtyard',
      locationMl: 'നാലുകെട്ട് മുറ്റം',
      taglineEn: 'Woven in threads of heritage, grace, and sacred joy.',
      taglineMl: 'പൈതൃകവും ഭംഗിയും ഇഴചേർന്ന മനോഹര നിമിഷം.',
      category: 'traditional',
    },
    {
      id: 'photo-3',
      src: '/photos/photo-3.jpg',
      titleEn: 'Monsoon Laughter & Rain',
      titleMl: 'മഴത്തുള്ളികളും മധുരച്ചിരിയും',
      locationEn: 'Mattancherry Colonial Streets',
      locationMl: 'മട്ടാഞ്ചേരി തെരുവുകൾ',
      taglineEn: 'Unscripted smiles under the gentle Kerala rain.',
      taglineMl: 'മഴയുടെ സംഗീതത്തിൽ വിരിഞ്ഞ കളിചിരികൾ.',
      category: 'candid',
    },
    {
      id: 'photo-4',
      src: '/photos/photo-4.jpg',
      titleEn: 'Temple Sanctum Blessings',
      titleMl: 'ക്ഷേത്രനടയിലെ പ്രാർത്ഥന',
      locationEn: 'Chottanikkara Sacred Steps',
      locationMl: 'ചോറ്റാനിക്കര ക്ഷേത്രനട',
      taglineEn: 'Seeking divine grace as two souls step onto one sacred path.',
      taglineMl: 'ഈശ്വരാനുഗ്രഹം തേടി ഒരൊറ്റ വഴിയിലൂടെ.',
      category: 'traditional',
    },
    {
      id: 'photo-5',
      src: '/photos/photo-5.jpg',
      titleEn: 'Munnar Tea Whispers',
      titleMl: 'മൂന്നാറിലെ പച്ചപ്പ്',
      locationEn: 'Munnar Valley Heights',
      locationMl: 'മൂന്നാർ മലനിരകൾ',
      taglineEn: 'Serenade of emerald hills and clouds embracing the valley.',
      taglineMl: 'മേഘങ്ങളും പച്ചപ്പും തഴുകിയ ശാന്തമായ യാത്ര.',
      category: 'scenic',
    },
    {
      id: 'photo-6',
      src: '/photos/photo-6.jpg',
      titleEn: 'Backwater Serenity',
      titleMl: 'വേമ്പനാട്ടു കായൽ ഭംഗി',
      locationEn: 'Kumarakom Backwaters',
      locationMl: 'കുമരകം കായൽത്തീരം',
      taglineEn: 'Gentle ripples reflecting everlasting companionship.',
      taglineMl: 'ഓളപ്പരപ്പിൽ തെളിയുന്ന അനന്തമായ പ്രണയം.',
      category: 'scenic',
    },
    {
      id: 'photo-7',
      src: '/photos/photo-7.jpg',
      titleEn: 'Royal Heritage Grace',
      titleMl: 'രാജകീയ പ്രൗഢി',
      locationEn: 'Hill Palace Museum, Tripunithura',
      locationMl: 'ഹിൽപാലസ്, തൃപ്പൂണിത്തുറ',
      taglineEn: 'Echoes of classic architecture honoring sacred bonds.',
      taglineMl: 'ചരിത്രവും പ്രൗഢിയും ഒന്നിക്കുന്ന മാതൃകാ വേദി.',
      category: 'traditional',
    },
    {
      id: 'photo-8',
      src: '/photos/photo-8.jpg',
      titleEn: 'Joyful Bloom Celebration',
      titleMl: 'പൂക്കളുടെ വസന്തം',
      locationEn: 'Rose Garden Vistas',
      locationMl: 'റോസ് ഗാർഡൻ',
      taglineEn: 'Joyful showers of fragrant blossoms celebrating union.',
      taglineMl: 'പൂമഴയിൽ വിരിയുന്ന മംഗളാശംസകൾ.',
      category: 'candid',
    },
    {
      id: 'photo-9',
      src: '/photos/photo-9.jpg',
      titleEn: 'Serene Sunset Promise',
      titleMl: 'സന്ധ്യാരാഗത്തിന്റെ നിറവിൽ',
      locationEn: 'Cherai Beach Waves',
      locationMl: 'ചെറായി ബീച്ച്',
      taglineEn: 'Under velvet skies, dreaming of tomorrows hand in hand.',
      taglineMl: 'തിരമാലകൾ സാക്ഷിയായ മനോഹര സന്ധ്യ.',
      category: 'sunset',
    },
    {
      id: 'photo-10',
      src: '/photos/photo-10.jpg',
      titleEn: 'Forever Towards Tomorrow',
      titleMl: 'പുതിയ പ്രഭാതത്തിലേക്ക്',
      locationEn: 'Kochi Harbour Horizon',
      locationMl: 'കൊച്ചി ഹാർബർ',
      taglineEn: 'Gazing into a bright, blessed horizon together.',
      taglineMl: 'പ്രതീക്ഷകളും സ്നേഹവും നിറഞ്ഞ പുതിയ ജീവിതത്തിലേക്ക്.',
      category: 'candid',
    },
  ],
  contacts: {
    groomSide: {
      name: 'Mr. K. Narayanan (Father)',
      relationEn: 'Groom’s Family',
      relationMl: 'വരന്റെ കുടുംബം',
      phone: '+919876543210',
      whatsapp: '919876543210',
    },
    brideSide: {
      name: 'Mr. M. Radhakrishnan (Father)',
      relationEn: 'Bride’s Family',
      relationMl: 'വധുവിന്റെ കുടുംബം',
      phone: '+919840123456',
      whatsapp: '919840123456',
    },
  },
  venue: {
    nameEn: 'The Grand Heritage Palace Auditorium',
    nameMl: 'ദി ഗ്രാൻഡ് ഹെറിറ്റേജ് പാലസ് ഓഡിറ്റോറിയം',
    addressEn: 'Marine Drive, Kochi, Kerala 682031',
    addressMl: 'മറൈൻ ഡ്രൈവ്, കൊച്ചി, കേരളം 682031',
    lat: 9.9816,
    lng: 76.2750,
    googleMapsUrl: 'https://maps.google.com/?q=9.9816,76.2750',
    embedMapUrl: 'https://maps.google.com/maps?q=9.9816,76.2750&hl=en&z=15&output=embed',
    parkingTipsEn: 'Valet parking available at Main Gate. Ample covered parking for over 350 vehicles.',
    parkingTipsMl: 'മെയിൻ ഗേറ്റിൽ വാലെറ്റ് പാർക്കിംഗ് ലഭ്യമാണ്. 350-ലധികം വാഹനങ്ങൾക്ക് സുരക്ഷിതമായ പാർക്കിംഗ് സൗകര്യം.',
    stayTipsEn: 'Accommodation assistance available at nearby hotels (Grand Hyatt / Gateway Hotel). Contact us for arrangements.',
    stayTipsMl: 'ദൂരെ നിന്ന് വരുന്ന അതിഥികൾക്കായി അടുത്തുള്ള ഹോട്ടലുകളിൽ താമസസൗകര്യം ക്രമീകരിച്ചിട്ടുണ്ട്.',
    landmarksEn: 'Opposite Marine Drive Walkway & High Court Junction.',
    landmarksMl: 'മറൈൻ ഡ്രൈവ് വോക്ക്‌വേയ്ക്കും ഹൈക്കോടതി ജംഗ്ഷനും എതിർവശം.',
  },
  audio: {
    src: '/audio/song.mp3',
    title: 'Traditional Nadaswaram & Sopana Sangeetham Harmony',
    artist: 'Kerala Temple Melodies',
    enabledByDefault: false,
    volume: 0.8,
  },
};
