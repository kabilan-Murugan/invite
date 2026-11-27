export interface WeddingEvent {
  id: string;
  key: 'engagement' | 'reception' | 'muhurtham' | 'haldi';
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
  iconName: 'ring' | 'celebration' | 'mandapam' | 'sparkles' | 'sun';
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
  presetId: 'royal-ivory-gold' | 'grayscale' | 'dusky-pink' | 'emerald' | 'maroon' | 'rose' | 'sapphire' | 'plum' | 'terracotta' | 'custom';
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
  'royal-ivory-gold': {
    presetId: 'royal-ivory-gold',
    name: 'Imperial Pearl Ivory & Champagne Gold',
    primary: '#1E2421',
    primaryDark: '#121614',
    primaryLight: '#3D4A43',
    gold: '#C5A038',
    goldLight: '#F7E7BE',
    goldDark: '#8C6D28',
    background: '#FCFBF8',
    cardBg: '#FFFFFF',
    text: '#1E2421',
    textMuted: '#5C5449',
  },
  grayscale: {
    presetId: 'grayscale',
    name: 'Timeless Monochrome & Champagne Gold',
    primary: '#2B2D31',
    primaryDark: '#161719',
    primaryLight: '#43464C',
    gold: '#D4AF37',
    goldLight: '#F3E198',
    goldDark: '#987413',
    background: '#141517',
    cardBg: '#212327',
    text: '#F3F4F6',
    textMuted: '#9CA3AF',
  },
  'dusky-pink': {
    presetId: 'dusky-pink',
    name: 'Romantic Dusky Pink & Rose Gold',
    primary: '#8C3B55',
    primaryDark: '#581C2E',
    primaryLight: '#BA6882',
    gold: '#C28B62',
    goldLight: '#FCE6D8',
    goldDark: '#8C5732',
    background: '#FDF8F9',
    cardBg: '#F9EFF2',
    text: '#28161D',
    textMuted: '#684C56',
  },
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
  "adminPassword": "wedding2026",
  "theme": {
    "presetId": "royal-ivory-gold",
    "name": "Imperial Pearl Ivory & Champagne Gold",
    "primary": "#1E2421",
    "primaryDark": "#121614",
    "primaryLight": "#3D4A43",
    "gold": "#C5A038",
    "goldLight": "#F7E7BE",
    "goldDark": "#8C6D28",
    "background": "#FCFBF8",
    "cardBg": "#FFFFFF",
    "text": "#1E2421",
    "textMuted": "#5C5449"
  },
  "couple": {
    "groom": {
      "nameEn": "Sajith",
      "nameMl": "സജിത്ത്",
      "fullNameEn": "",
      "fullNameMl": "ഏണസ്റ്റ് പോൾ",
      "qualificationEn": "",
      "qualificationMl": "",
      "parentsEn": "Mr. Sathish & Mrs. Priya",
      "parentsMl": "ശ്രീ. സതീഷ് & ശ്രീമതി. പ്രിയ",
      "familyHomeEn": "karunagappaly, Kerala",
      "familyHomeMl": "കരുനാഗപ്പള്ളി, കേരളം"
    },
    "bride": {
      "nameEn": "Adithya",
      "nameMl": "ആദിത്യ",
      "fullNameEn": "",
      "fullNameMl": "മിഷ്മ",
      "qualificationEn": "",
      "qualificationMl": "",
      "parentsEn": "Mr. Ajith Kumar & Mrs. Sandhya",
      "parentsMl": "ശ്രീ. അജിത് കുമാർ & ശ്രീമതി. സന്ധ്യ",
      "familyHomeEn": "kottarakkara, Kerala",
      "familyHomeMl": "കൊട്ടാരക്കര, കേരളം"
    }
  },
  "hashtag": "#sajithWedsadithya",
  "seo": {
    "siteTitle": "Sajith & Adithya | Wedding Invitation",
    "metaDescription": "United in love, surrounded by grace, we invite you to witness the beginning of our forever.",
    "ogImage": "/og-image.jpg",
    "siteUrl": "https://wedding-invitation-8tq.pages.dev",
    "noindex": false
  },
  "countdownTargetIso": "2027-02-07T09:30:00+05:30",
  "events": [
    {
      "id": "bride-reception",
      "key": "reception",
      "titleEn": "Reception (Bride's Home)",
      "titleMl": "വിവാഹ സൽക്കാരം (വധുവിന്റെ ഭവനം)",
      "taglineEn": "An evening of warmth, blessings, and joyful celebrations",
      "taglineMl": "സ്നേഹവും അനുഗ്രഹങ്ങളും സന്തോഷവും പങ്കിടുന്ന സൽക്കാരം",
      "dateEn": "Saturday, February 06, 2027",
      "dateMl": "2027 ഫെബ്രുവരി 6, ശനിയാഴ്ച",
      "timeEn": "06:30 PM onwards",
      "timeMl": "വൈകുന്നേരം 06:30 മണി മുതൽ",
      "startDateIso": "2027-02-06T18:30:00+05:30",
      "endDateIso": "2027-02-06T22:30:00+05:30",
      "venueNameEn": "Bride's Home",
      "venueNameMl": "വധുവിന്റെ ഭവനം",
      "addressEn": "Palamkala thekkethil, perumkulam P. O, 691566 kottarakkara, kollam",
      "addressMl": "പാലംകാല തെക്കേതിൽ, പെരുങ്കുളം പി.ഒ., 691566 കൊട്ടാരക്കര, കൊല്ലം",
      "mapLink": "https://maps.app.goo.gl/BTYb96RFgqSXhZ4e8?g_st=aw",
      "dressCodeEn": "Traditional Kasavu Saree / Kurta or Ethnic Wear",
      "dressCodeMl": "കേരള കസവ് സാരി / കുർത്ത / പരമ്പരാഗത വസ്ത്രം",
      "iconName": "celebration"
    },
    {
      "id": "muhurtham",
      "key": "muhurtham",
      "titleEn": "Auspicious Muhurtham & Thalikettu",
      "titleMl": "ശുഭ മുഹൂർത്തം & താലികെട്ട്",
      "taglineEn": "The sacred holy vows and tying of the mangalsutra",
      "taglineMl": "മാംഗല്യധാരണവും സപ്തപദിയും നടക്കുന്ന പുണ്യ മുഹൂർത്തം",
      "dateEn": "Sunday, February 07, 2027",
      "dateMl": "2027 ഫെബ്രുവരി 7, ഞായറാഴ്ച",
      "timeEn": "10:30 AM - 12:40 (Traditional Sadya follows)",
      "timeMl": "രാവിലെ 10:30 - 12:40 മണി (തുടർന്ന് വിഭവസമൃദ്ധമായ കല്യാണസദ്യ)",
      "startDateIso": "2027-02-07T09:00:00+05:30",
      "endDateIso": "2027-02-07T13:30:00+05:30",
      "venueNameEn": "Shilpa auditorium",
      "venueNameMl": "ശിൽപ ഓഡിറ്റോറിയം",
      "addressEn": "MC Road, Inchakkadu, Shilpa Junction, Mylom P.O., Kottarakkara, Kollam District, Kerala 691560,",
      "addressMl": "മറൈൻ ഡ്രൈവ്, കൊച്ചി, കേരളം 682031",
      "mapLink": "https://maps.google.com/?q=9.04356,76.77396",
      "dressCodeEn": "Pure Traditional Kasavu Mundu & Pattu Pavada",
      "dressCodeMl": "പരമ്പരാഗത കേരള കസവ് മുണ്ട് & പട്ടുസാരി",
      "iconName": "mandapam"
    },
    {
      "id": "reception",
      "key": "reception",
      "titleEn": "Wedding Reception",
      "titleMl": "വിവാഹ സൽക്കാരം",
      "taglineEn": "An evening of music, dining, blessings and laughter",
      "taglineMl": "ഇമ്പമാർന്ന സംഗീതവും സ്നേഹവിരുന്നും മംഗളാശംസകളും",
      "dateEn": "Monday, February 08, 2027",
      "dateMl": "2027 ഫെബ്രുവരി 8, തിങ്കളാഴ്ച",
      "timeEn": "06:30 PM onwards (Dinner follows)",
      "timeMl": "വൈകുന്നേരം 06:30 മണി മുതൽ (തുടർന്ന് രാത്രി ഭക്ഷണം)",
      "startDateIso": "2027-02-07T18:30:00+05:30",
      "endDateIso": "2027-02-07T22:30:00+05:30",
      "venueNameEn": "Faizan auditorium",
      "venueNameMl": "ഫൈസാൻ ഓഡിറ്റോറിയം",
      "addressEn": "Mararithottam, Kallelibhagom, Karunagappally, Kollam district, Kerala 690519",
      "addressMl": "മറൈൻ ഡ്രൈവ്, കൊച്ചി, കേരളം 682031",
      "mapLink": "https://maps.google.com/?q=9.05178,76.56310",
      "dressCodeEn": "Evening Elegance / Indo-Western / Formal Attire",
      "dressCodeMl": "ഈവനിംഗ് ഡ്രസ്സ് / ഇൻഡോ-വെസ്റ്റേൺ / ഫോർമൽ",
      "iconName": "celebration"
    }
  ],
  "story": [
    {
      "id": "1",
      "year": "August 2022",
      "titleEn": "The First Hello",
      "titleMl": "ആദ്യ കൂടിക്കാഴ്ച",
      "descriptionEn": "A quiet monsoon evening at a Fort Kochi cafe where our conversations flowed effortlessly for four magical hours.",
      "descriptionMl": "ഫോർട്ട് കൊച്ചിയിലെ ഒരു മഴ വൈകുന്നേരത്ത് തുടങ്ങിയ ഞങ്ങളുടെ സംസാരം മണിക്കൂറുകളോളം നീണ്ടുപോയി.",
      "image": "/photos/photo-1.jpg"
    },
    {
      "id": "2",
      "year": "April 2024",
      "titleEn": "Munnar Mist Walk",
      "titleMl": "മൂന്നാറിലെ മഞ്ഞുയാത്ര",
      "descriptionEn": "Standing amidst misty tea gardens in Munnar, we realized that life is best explored hand in hand.",
      "descriptionMl": "മൂന്നാറിലെ കോടമഞ്ഞിനിടയിലൂടെ നടക്കുമ്പോൾ ഞങ്ങൾ തിരിച്ചറിഞ്ഞു, ജീവിതപാതയിൽ നമ്മൾ ഒന്നിച്ചുണ്ടാവണമെന്ന്.",
      "image": "/photos/photo-2.jpg"
    },
    {
      "id": "3",
      "year": "December 2025",
      "titleEn": "Families United",
      "titleMl": "കുടുംബങ്ങളുടെ സംഗമം",
      "descriptionEn": "Both our families met over warm Kerala sadya and sweets, blending traditions with heartfelt blessings.",
      "descriptionMl": "ഇരു കുടുംബങ്ങളും ഒന്നിച്ചിരുന്ന് സ്നേഹത്തോടെയും ആദരവോടെയും ഞങ്ങളുടെ വിവാഹം ഉറപ്പിച്ചു.",
      "image": "/photos/photo-3.jpg"
    },
    {
      "id": "4",
      "year": "November 2026",
      "titleEn": "The Forever Chapter",
      "titleMl": "പുതിയ തുടക്കം",
      "descriptionEn": "With hearts full of love and gratitude, we step into our forever journey with all your blessings.",
      "descriptionMl": "നിങ്ങളുടെ ഏവരുടെയും പ്രാർത്ഥനകളോടും അനുഗ്രഹങ്ങളോടും കൂടി ഞങ്ങൾ പുതിയ ജീവിതത്തിലേക്ക് കാൽവെക്കുന്നു.",
      "image": "/photos/photo-4.jpg"
    }
  ],
  "galleryPhotos": [
    {
      "id": "photo-1",
      "src": "/photos/1.jpeg",
      "titleEn": "Sunset Shore Harmony",
      "titleMl": "പൊൻസന്ധ്യ തീരത്തെ പ്രണയം",
      "locationEn": "Fort Kochi Beach",
      "locationMl": "ഫോർട്ട് കൊച്ചി ബീച്ച്",
      "taglineEn": "Where golden twilight whispered the first vow of eternity.",
      "taglineMl": "പൊൻസന്ധ്യയുടെ ശോഭയിൽ വിരിഞ്ഞ സ്നേഹനിമിഷം.",
      "category": "candid"
    },
    {
      "id": "photo-2",
      "src": "/photos/2.jpeg",
      "titleEn": "Traditional Kasavu Radiance",
      "titleMl": "കേരള കസവിന്റെ തനിമ",
      "locationEn": "Heritage Nalukettu Courtyard",
      "locationMl": "നാലുകെട്ട് മുറ്റം",
      "taglineEn": "Woven in threads of heritage, grace, and sacred joy.",
      "taglineMl": "പൈതൃകവും ഭംഗിയും ഇഴചേർന്ന മനോഹര നിമിഷം.",
      "category": "traditional"
    },
    {
      "id": "photo-3",
      "src": "/photos/3.jpeg",
      "titleEn": "Monsoon Laughter & Rain",
      "titleMl": "മഴത്തുള്ളികളും മധുരച്ചിരിയും",
      "locationEn": "Mattancherry Colonial Streets",
      "locationMl": "മട്ടാഞ്ചേരി തെരുവുകൾ",
      "taglineEn": "Unscripted smiles under the gentle Kerala rain.",
      "taglineMl": "മഴയുടെ സംഗീതത്തിൽ വിരിഞ്ഞ കളിചിരികൾ.",
      "category": "candid"
    },
    {
      "id": "photo-4",
      "src": "/photos/4.jpeg",
      "titleEn": "Temple Sanctum Blessings",
      "titleMl": "ക്ഷേത്രനടയിലെ പ്രാർത്ഥന",
      "locationEn": "Chottanikkara Sacred Steps",
      "locationMl": "ചോറ്റാനിക്കര ക്ഷേത്രനട",
      "taglineEn": "Seeking divine grace as two souls step onto one sacred path.",
      "taglineMl": "ഈശ്വരാനുഗ്രഹം തേടി ഒരൊറ്റ വഴിയിലൂടെ.",
      "category": "traditional"
    },
    {
      "id": "photo-5",
      "src": "/photos/5.jpeg",
      "titleEn": "Munnar Tea Whispers",
      "titleMl": "മൂന്നാറിലെ പച്ചപ്പ്",
      "locationEn": "Munnar Valley Heights",
      "locationMl": "മൂന്നാർ മലനിരകൾ",
      "taglineEn": "Serenade of emerald hills and clouds embracing the valley.",
      "taglineMl": "മേഘങ്ങളും പച്ചപ്പും തഴുകിയ ശാന്തമായ യാത്ര.",
      "category": "scenic"
    },
    {
      "id": "photo-6",
      "src": "/photos/6.jpeg",
      "titleEn": "Backwater Serenity",
      "titleMl": "വേമ്പനാട്ടു കായൽ ഭംഗി",
      "locationEn": "Kumarakom Backwaters",
      "locationMl": "കുമരകം കായൽത്തീരം",
      "taglineEn": "Gentle ripples reflecting everlasting companionship.",
      "taglineMl": "ഓളപ്പരപ്പിൽ തെളിയുന്ന അനന്തമായ പ്രണയം.",
      "category": "scenic"
    },
    {
      "id": "photo-7",
      "src": "/photos/1.jpeg",
      "titleEn": "Royal Heritage Grace",
      "titleMl": "രാജകീയ പ്രൗഢി",
      "locationEn": "Hill Palace Museum, Tripunithura",
      "locationMl": "ഹിൽപാലസ്, തൃപ്പൂണിത്തുറ",
      "taglineEn": "Echoes of classic architecture honoring sacred bonds.",
      "taglineMl": "ചരിത്രവും പ്രൗഢിയും ഒന്നിക്കുന്ന മാതൃകാ വേദി.",
      "category": "traditional"
    },
    {
      "id": "photo-8",
      "src": "/photos/5.jpeg",
      "titleEn": "Joyful Bloom Celebration",
      "titleMl": "പൂക്കളുടെ വസന്തം",
      "locationEn": "Rose Garden Vistas",
      "locationMl": "റോസ് ഗാർഡൻ",
      "taglineEn": "Joyful showers of fragrant blossoms celebrating union.",
      "taglineMl": "പൂമഴയിൽ വിരിയുന്ന മംഗളാശംസകൾ.",
      "category": "candid"
    },
    {
      "id": "photo-9",
      "src": "/photos/3.jpeg",
      "titleEn": "Serene Sunset Promise",
      "titleMl": "സന്ധ്യാരാഗത്തിന്റെ നിറവിൽ",
      "locationEn": "Cherai Beach Waves",
      "locationMl": "ചെറായി ബീച്ച്",
      "taglineEn": "Under velvet skies, dreaming of tomorrows hand in hand.",
      "taglineMl": "തിരമാലകൾ സാക്ഷിയായ മനോഹര സന്ധ്യ.",
      "category": "sunset"
    },
    {
      "id": "photo-10",
      "src": "/photos/2.jpeg",
      "titleEn": "Forever Towards Tomorrow",
      "titleMl": "പുതിയ പ്രഭാതത്തിലേക്ക്",
      "locationEn": "Kochi Harbour Horizon",
      "locationMl": "കൊച്ചി ഹാർബർ",
      "taglineEn": "Gazing into a bright, blessed horizon together.",
      "taglineMl": "പ്രതീക്ഷകളും സ്നേഹവും നിറഞ്ഞ പുതിയ ജീവിതത്തിലേക്ക്.",
      "category": "candid"
    }
  ],
  "contacts": {
    "groomSide": {
      "name": "Mr. Sathish (Father)",
      "relationEn": "Groom’s Family",
      "relationMl": "വരന്റെ കുടുംബം",
      "phone": "+919787381810",
      "whatsapp": "917904034528"
    },
    "brideSide": {
      "name": "Mr. AjithKumar (Father)",
      "relationEn": "Bride’s Family",
      "relationMl": "വധുവിന്റെ കുടുംബം",
      "phone": "+919947750031",
      "whatsapp": "919895574776"
    }
  },
  "venue": {
    "nameEn": "Shilpa auditorium",
    "nameMl": "ശിൽപ ഓഡിറ്റോറിയം",
    "addressEn": "MC Road, Inchakkadu, Shilpa Junction, Mylom P.O., Kottarakkara, Kollam District, Kerala 691560,",
    "addressMl": "എംസി റോഡ്, ഇഞ്ചക്കാട്, ശിൽപ ജംഗ്ഷൻ, മൈലോം പി.ഒ., കൊട്ടാരക്കര, കൊല്ലം ജില്ല, കേരളം 691560,",
    "lat": 9.04356,
    "lng": 76.77396,
    "googleMapsUrl": "https://maps.google.com/?q=9.04356,76.77396",
    "embedMapUrl": "https://maps.google.com/maps?q=9.04356,76.77396&hl=en&z=15&output=embed",
    "parkingTipsEn": "",
    "parkingTipsMl": "",
    "stayTipsEn": "",
    "stayTipsMl": "",
    "landmarksEn": "Opposite Marine Drive Walkway & High Court Junction.",
    "landmarksMl": "മറൈൻ ഡ്രൈവ് വോക്ക്‌വേയ്ക്കും ഹൈക്കോടതി ജംഗ്ഷനും എതിർവശം."
  },
  "audio": {
    "src": "/audio/song.mp3",
    "title": "Traditional Nadaswaram & Sopana Sangeetham Harmony",
    "artist": "Kerala Temple Melodies",
    "enabledByDefault": false,
    "volume": 0.8
  }
};
