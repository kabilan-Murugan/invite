export type Language = 'en' | 'ml';

export interface Translations {
  header: {
    audioPlay: string;
    audioPause: string;
    languageName: string;
    toggleLanguage: string;
  };
  splash: {
    tapToOpen: string;
    weddingInvitation: string;
    openEnvelope: string;
    scrollHint: string;
  };
  hero: {
    saveTheDate: string;
    gettingMarried: string;
    venueCity: string;
    scrollDown: string;
  };
  invitation: {
    blessing: string;
    greetingFallback: string;
    dearGuest: string;
    message1: string;
    message2: string;
    invitationBy: string;
  };
  countdown: {
    heading: string;
    subheading: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    celebrationMessage: string;
    togetherForever: string;
  };
  story: {
    heading: string;
    subheading: string;
  };
  gallery: {
    heading: string;
    subheading: string;
    viewGrid: string;
    viewStories: string;
    tapToView: string;
    photoCount: string;
  };
  events: {
    heading: string;
    subheading: string;
    dressCode: string;
    addToCalendar: string;
    googleCalendar: string;
    appleCalendar: string;
    getDirections: string;
    downloadIcs: string;
  };
  venue: {
    heading: string;
    subheading: string;
    openGoogleMaps: string;
    getDirections: string;
    shareLocation: string;
    parkingTitle: string;
    stayTitle: string;
    landmarksTitle: string;
    copied: string;
  };
  qr: {
    heading: string;
    subheading: string;
    scanPrompt: string;
    downloadPng: string;
    shareLink: string;
    printCard: string;
    linkCopied: string;
  };
  rsvp: {
    heading: string;
    subheading: string;
    deadlineNote: string;
    nameLabel: string;
    namePlaceholder: string;
    guestsLabel: string;
    attendingLabel: string;
    attendingYes: string;
    attendingNo: string;
    eventsLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    whatsappFallbackPrompt: string;
    sendViaWhatsapp: string;
    submitAnother: string;
    errorTitle: string;
    errorMessage: string;
  };
  contact: {
    heading: string;
    subheading: string;
    callGroom: string;
    callBride: string;
    whatsappGroom: string;
    whatsappBride: string;
    withLove: string;
    credit: string;
    copyHashtag: string;
    hashtagCopied: string;
  };
  bottomNav: {
    events: string;
    venue: string;
    rsvp: string;
    share: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      audioPlay: 'Play Music',
      audioPause: 'Pause Music',
      languageName: 'മലയാളം',
      toggleLanguage: 'Switch to Malayalam',
    },
    splash: {
      tapToOpen: 'Tap to Open Invitation',
      weddingInvitation: 'WEDDING INVITATION',
      openEnvelope: 'Click to open the royal invitation',
      scrollHint: 'Scroll to explore our journey',
    },
    hero: {
      saveTheDate: 'Save The Date',
      gettingMarried: 'Are getting married',
      venueCity: 'Kochi, Kerala',
      scrollDown: 'Scroll to begin our story',
    },
    invitation: {
      blessing: '|| Sukham Bhavatu • Subham Bhavatu ||',
      greetingFallback: 'Respected Family & Friends',
      dearGuest: 'Dear',
      message1:
        'With the divine blessings of the Almighty and our elders, we cordially invite your gracious presence with family on the auspicious occasion of our wedding ceremony.',
      message2:
        'Please grace this blessed occasion with your esteemed presence and join us for the traditional Kerala wedding sadya.',
      invitationBy: 'Cordially invited by their parents & family members',
    },
    countdown: {
      heading: 'The Auspicious Countdown',
      subheading: 'Counting down every cherished second to our Muhurtham',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Mins',
      seconds: 'Secs',
      celebrationMessage: 'We are happily married! Thank you for your heartfelt love and blessings!',
      togetherForever: 'Two souls united as one in a sacred journey of eternal love',
    },
    story: {
      heading: 'Our Story',
      subheading: 'A glimpse into the milestones of how our forever began',
    },
    gallery: {
      heading: 'Pre-Wedding Moments',
      subheading: 'Captured frames of love, laughter, and timeless anticipation',
      viewGrid: 'Masonry Grid',
      viewStories: '3D Arc Flow',
      tapToView: 'Tap any photograph to view in high resolution',
      photoCount: 'photographs',
    },
    events: {
      heading: 'Celebration Ceremonies',
      subheading: 'Join our traditional Kerala wedding ceremonies and feast',
      dressCode: 'Suggested Attire',
      addToCalendar: 'Add to Calendar',
      googleCalendar: 'Google Calendar',
      appleCalendar: 'Apple / Outlook (.ics)',
      getDirections: 'Get Directions',
      downloadIcs: 'Download Calendar (.ics)',
    },
    venue: {
      heading: 'Venue & Directions',
      subheading: 'Find your way to the celebration with ease',
      openGoogleMaps: 'Open in Google Maps',
      getDirections: 'Get Turn-by-Turn Directions',
      shareLocation: 'Share Venue Location',
      parkingTitle: 'Parking & Valet',
      stayTitle: 'Guest Accommodation',
      landmarksTitle: 'Key Landmarks',
      copied: 'Venue link copied to clipboard!',
    },
    qr: {
      heading: 'Scan & Share',
      subheading: 'Share our special invitation card with your close ones',
      scanPrompt: 'Scan this QR code with any mobile camera to view and bookmark this invitation.',
      downloadPng: 'Download QR (PNG)',
      shareLink: 'Share Invitation Link',
      printCard: 'Printable A5 Card',
      linkCopied: 'Invitation link copied to clipboard!',
    },
    rsvp: {
      heading: 'RSVP & Best Wishes',
      subheading: 'Your gracious presence is the greatest blessing of all',
      deadlineNote: 'Please confirm your attendance by November 15, 2026',
      nameLabel: 'Your Full Name / Family Name',
      namePlaceholder: 'e.g., Rahul & Family',
      guestsLabel: 'Number of Guests Attending',
      attendingLabel: 'Will you be joining us?',
      attendingYes: 'Joyfully Accept (Yes)',
      attendingNo: 'Regretfully Decline (No)',
      eventsLabel: 'Ceremonies You Plan to Attend',
      messageLabel: 'Blessings & Warm Wishes (Optional)',
      messagePlaceholder: 'Write your heartfelt blessings for Karthik & Ananya...',
      submitButton: 'Send My RSVP',
      submitting: 'Recording your RSVP...',
      successTitle: 'Thank You so Much!',
      successMessage: 'Your RSVP and warm blessings have been received with love.',
      whatsappFallbackPrompt: 'You can also confirm via WhatsApp directly to our family:',
      sendViaWhatsapp: 'Send RSVP via WhatsApp',
      submitAnother: 'Submit for another guest',
      errorTitle: 'Submission Notice',
      errorMessage: 'Could not record online directly. You can confirm instantly via WhatsApp below!',
    },
    contact: {
      heading: 'Contact & Blessings',
      subheading: 'Feel free to reach out to our families for any guidance or assistance',
      callGroom: 'Call Groom’s Side',
      callBride: 'Call Bride’s Side',
      whatsappGroom: 'WhatsApp Groom’s Family',
      whatsappBride: 'WhatsApp Bride’s Family',
      withLove: 'With warm regards & heartfelt blessings from both families',
      credit: 'Created with love for #KarAnanyaForever',
      copyHashtag: 'Copy Hashtag',
      hashtagCopied: 'Hashtag copied!',
    },
    bottomNav: {
      events: 'Events',
      venue: 'Venue',
      rsvp: 'RSVP',
      share: 'Share',
    },
  },
  ml: {
    header: {
      audioPlay: 'സംഗീതം കേൾക്കുക',
      audioPause: 'സംഗീതം നിർത്തുക',
      languageName: 'English',
      toggleLanguage: 'Switch to English',
    },
    splash: {
      tapToOpen: 'ക്ഷണക്കത്ത് തുറക്കാൻ തൊടുക',
      weddingInvitation: 'വിവാഹ ക്ഷണക്കത്ത്',
      openEnvelope: 'മംഗളകരമായ വിവാഹ ക്ഷണക്കത്ത് തുറക്കൂ',
      scrollHint: 'ഞങ്ങളുടെ സ്നേഹയാത്ര കാണാൻ താഴേക്ക് സ്ക്രോൾ ചെയ്യുക',
    },
    hero: {
      saveTheDate: 'മംഗള മുഹൂർത്തം',
      gettingMarried: 'വിവാഹിതരാകുന്നു',
      venueCity: 'കൊച്ചി, കേരളം',
      scrollDown: 'വിശേഷങ്ങൾ കാണാൻ താഴേക്ക് തുടരുക',
    },
    invitation: {
      blessing: '|| ഹരിഃ ശ്രീ ഗണപതയേ നമഃ • ശുഭം ഭവതു ||',
      greetingFallback: 'പ്രിയപ്പെട്ട ബന്ധുമിത്രാദികൾക്ക്',
      dearGuest: 'പ്രിയ',
      message1:
        'സർവ്വേശ്വരന്റെ അനുഗ്രഹത്താലും കുടുംബമുതിർന്നവരുടെ ആശീർവാദത്തോടും കൂടി നടക്കുന്ന ഞങ്ങളുടെ വിവാഹമംഗള ചടങ്ങിലേക്ക് അങ്ങയെയും കുടുംബത്തെയും സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു.',
      message2:
        'തങ്ങളുടെ സാന്നിധ്യവും പ്രാർത്ഥനയും ഈ പുണ്യനിമിഷത്തിന് കൂടുതൽ മാറ്റ് കൂട്ടും. ചടങ്ങുകൾക്ക് ശേഷം നടക്കുന്ന പരമ്പരാഗത കേരള സദ്യയിൽ പങ്കുചേരുവാൻ ഹൃദയപൂർവ്വം സ്വാഗതം ചെയ്യുന്നു.',
      invitationBy: 'സ്നേഹാദരങ്ങളോടെ: വധൂവരന്മാരും കുടുംബാംഗങ്ങളും',
    },
    countdown: {
      heading: 'മംഗള മുഹൂർത്തത്തിലേക്കുള്ള സമയം',
      subheading: 'ഞങ്ങളുടെ താലികെട്ട് മുഹൂർത്തത്തിലേക്കുള്ള ഓരോ വിലയേറിയ നിമിഷവും',
      days: 'ദിവസങ്ങൾ',
      hours: 'മണിക്കൂർ',
      minutes: 'മിനിറ്റ്',
      seconds: 'സെക്കൻഡ്',
      celebrationMessage: 'ഞങ്ങൾ വിവാഹിതരായി! നിങ്ങളുടെ പ്രാർത്ഥനകൾക്കും സ്നേഹത്തിനും നന്ദി!',
      togetherForever: 'രണ്ട് മനസ്സുകൾ ഒന്നാകുന്ന പുണ്യ ജീവിതത്തിന് തുടക്കം',
    },
    story: {
      heading: 'ഞങ്ങളുടെ സ്നേഹയാത്ര',
      subheading: 'ഞങ്ങൾ ഒന്നായ മനോഹരമായ നിമിഷങ്ങളുടെ ഓർമ്മക്കുറിപ്പുകൾ',
    },
    gallery: {
      heading: 'പ്രീ-വെഡ്ഡിംഗ് ചിത്രങ്ങൾ',
      subheading: 'സ്നേഹത്തിന്റെയും സൗഹൃദത്തിന്റെയും മനോഹര നിമിഷങ്ങൾ',
      viewGrid: 'ഗ്രിഡ് കാഴ്ച',
      viewStories: '3D സ്ലൈഡർ',
      tapToView: 'വലുതായി കാണാൻ ചിത്രത്തിൽ തൊടുക',
      photoCount: 'ചിത്രങ്ങൾ',
    },
    events: {
      heading: 'മംഗള ചടങ്ങുകൾ',
      subheading: 'പരമ്പരാഗത കേരള വിവാഹ ചടങ്ങുകളുടെ പൂർണ്ണ വിവരങ്ങൾ',
      dressCode: 'വസ്ത്രധാരണ രീതി',
      addToCalendar: 'കലണ്ടറിൽ ചേർക്കൂ',
      googleCalendar: 'ഗൂഗിൾ കലണ്ടർ',
      appleCalendar: 'ആപ്പിൾ / ഔട്ട്ലുക്ക് (.ics)',
      getDirections: 'വഴി അറിയാൻ',
      downloadIcs: 'കലണ്ടർ ഫയൽ (.ics)',
    },
    venue: {
      heading: 'കല്യാണ മണ്ഡപവും വഴിയും',
      subheading: 'മണ്ഡപത്തിൽ എളുപ്പത്തിൽ എത്തിച്ചേരാനുള്ള വഴിവിവരങ്ങൾ',
      openGoogleMaps: 'ഗൂഗിൾ മാപ്സിൽ തുറക്കുക',
      getDirections: 'വഴി കണ്ടെത്തുക',
      shareLocation: 'ലൊക്കേഷൻ ഷെയർ ചെയ്യുക',
      parkingTitle: 'പാർക്കിംഗ് സൗകര്യം',
      stayTitle: 'താമസ സൗകര്യങ്ങൾ',
      landmarksTitle: 'പ്രധാന അടയാളങ്ങൾ',
      copied: 'ലിങ്ക് കോപ്പി ചെയ്തു!',
    },
    qr: {
      heading: 'സ്കാൻ ചെയ്യുക & പങ്കുവെക്കുക',
      subheading: 'ഈ ഡിജിറ്റൽ ക്ഷണക്കത്ത് നിങ്ങളുടെ പ്രിയപ്പെട്ടവരുമായി പങ്കിടൂ',
      scanPrompt: 'ഫോൺ ക്യാമറ ഉപയോഗിച്ച് ഈ QR കോഡ് സ്കാൻ ചെയ്തു ക്ഷണക്കത്ത് കാണാം.',
      downloadPng: 'QR ഡൗൺലോഡ് (PNG)',
      shareLink: 'ക്ഷണക്കത്ത് പങ്കിടുക',
      printCard: 'പ്രിൻ്റബിൾ A5 കാർഡ്',
      linkCopied: 'ലിങ്ക് കോപ്പി ചെയ്തു!',
    },
    rsvp: {
      heading: 'സാന്നിധ്യം അറിയിക്കുക (RSVP)',
      subheading: 'നിങ്ങളുടെ സാന്നിധ്യമാണ് ഞങ്ങൾക്ക് ഏറ്റവും വലിയ അനുഗ്രഹം',
      deadlineNote: 'നവംബർ 15, 2026-ന് മുൻപായി സാന്നിധ്യം അറിയിക്കുമല്ലോ',
      nameLabel: 'നിങ്ങളുടെ പേര് / കുടുംബത്തിന്റെ പേര്',
      namePlaceholder: 'ഉദാ: രാഹുൽ & കുടുംബം',
      guestsLabel: 'പങ്കെടുക്കുന്ന ആളുകളുടെ എണ്ണം',
      attendingLabel: 'ചടങ്ങിൽ പങ്കെടുക്കുമോ?',
      attendingYes: 'സന്തോഷത്തോടെ പങ്കെടുക്കുന്നു (അതെ)',
      attendingNo: 'എത്തിച്ചേരാൻ കഴിയാത്തതിൽ ഖേദിക്കുന്നു (ഇല്ല)',
      eventsLabel: 'പങ്കെടുക്കുന്ന മംഗള ചടങ്ങുകൾ',
      messageLabel: 'വധൂവരന്മാർക്കുള്ള അനുഗ്രഹങ്ങളും ആശംസകളും',
      messagePlaceholder: 'കാർത്തിക്കിനും അനന്യയ്ക്കും നിങ്ങളുടെ സ്നേഹാശംസകൾ എഴുതുക...',
      submitButton: 'സാന്നിധ്യം അറിയിക്കൂ',
      submitting: 'രേഖപ്പെടുത്തുന്നു...',
      successTitle: 'ഹൃദയം നിറഞ്ഞ നന്ദി!',
      successMessage: 'നിങ്ങളുടെ മറുപടിയും സ്നേഹാശംസകളും സ്വീകരിച്ചിരിക്കുന്നു.',
      whatsappFallbackPrompt: 'വാട്സാപ്പിലൂടെയും നിങ്ങൾക്ക് നേരിട്ട് അറിയിക്കാം:',
      sendViaWhatsapp: 'വാട്സാപ്പിലൂടെ അയക്കുക',
      submitAnother: 'മറ്റൊരു രജിസ്ട്രേഷൻ നടത്തുക',
      errorTitle: 'അറിയിപ്പ്',
      errorMessage: 'ഓൺലൈനായി രജിസ്റ്റർ ചെയ്യാൻ കഴിഞ്ഞില്ല. താഴെയുള്ള വാട്സാപ്പ് വഴി നേരിട്ട് അയക്കാം!',
    },
    contact: {
      heading: 'ബന്ധപ്പെടാൻ & വിവരങ്ങൾക്ക്',
      subheading: 'കൂടുതൽ വിവരങ്ങൾക്ക് ഏത് സമയത്തും കുടുംബവുമായി ബന്ധപ്പെടാം',
      callGroom: 'വരന്റെ കുടുംബത്തെ വിളിക്കുക',
      callBride: 'വധുവിന്റെ കുടുംബത്തെ വിളിക്കുക',
      whatsappGroom: 'വരന്റെ കുടുംബം (WhatsApp)',
      whatsappBride: 'വധുവിന്റെ കുടുംബം (WhatsApp)',
      withLove: 'ഇരു കുടുംബങ്ങളുടെയും സ്നേഹാദരങ്ങളോടെ',
      credit: '#KarAnanya വിവാഹത്തിന് വേണ്ടി സ്നേഹത്തോടെ തയ്യാറാക്കിയത്',
      copyHashtag: 'ഹാഷ്‌ടാഗ് കോപ്പി ചെയ്യുക',
      hashtagCopied: 'ഹാഷ്‌ടാഗ് കോപ്പി ചെയ്തു!',
    },
    bottomNav: {
      events: 'ചടങ്ങുകൾ',
      venue: 'മണ്ഡപം',
      rsvp: 'RSVP',
      share: 'പങ്കിടുക',
    },
  },
};
