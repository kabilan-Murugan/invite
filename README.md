# 💍 Digital Wedding Invitation Website

A luxury, interactive, mobile-first wedding invitation website built with **React 18**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and **Cloudflare Pages**. Designed specifically for smartphones (360px–430px) as guests open links from WhatsApp or QR codes, while scaling elegantly to tablets and desktop screens.

---

## ✨ Features & Architecture

- **Mobile-First Kerala Royal Aesthetic**: Royal Emerald Green (`#0F4336`), Kasavu Temple Gold (`#D4AF37`, `#F3E198`), and Sandalwood Ivory (`#FDFBF7`) with glassmorphism cards and delicate gold borders.
- **Storytelling Scroll Experience**:
  1. **Splash Reveal**: Interactive envelope / wax seal tap-to-open gesture with sound unlock.
  2. **Cinematic Hero**: Full-bleed couple photography, script typography, gentle parallax, and 60fps falling golden sparkles and jasmine/rose petals.
  3. **Personalized Invitation**: Personalizes greetings dynamically from URL (e.g. `/?guest=Ravi%20Family` displays *"Dear Ravi Family"* / *"പ്രിയപ്പെട്ട Ravi Family"*), alongside parents' blessings and degrees.
  4. **Live IST Countdown**: Real-time flip countdown to the exact Muhurtham minute in Indian Standard Time (IST), displaying celebration message after the event passes.
  5. **Our Story Timeline**: Visual milestone cards tracing how the couple met and fell in love. Editable in 1 place.
  6. **Interactive 3D Arc & Flow Gallery**: Modern 3D coverflow with touch swipe gestures, auto-slide, play/pause toggle, pagination dots, and fullscreen lightbox (`yet-another-react-lightbox`) with pinch-zoom.
  7. **Celebration Ceremonies**: Dedicated cards for Engagement, Reception, and Muhurtham with 1-click **Google Calendar** integration and **.ics file download** (Apple / Outlook).
  8. **Venue Map**: Interactive Google Maps embed with dynamic **Leaflet + OpenStreetMap fallback**, turn-by-turn navigation, and expandable parking/stay advice.
  9. **QR Code Sharing**: Styled QR card with high-res PNG download, Web Share API with clipboard fallback, and client-side printable A5 card route (`/qr`).
  10. **RSVP System**: Validated with `react-hook-form` + `zod`, hidden spam honeypot, celebration confetti bursts, Cloudflare D1 persistence, and pre-filled WhatsApp fallback.
  11. **Family Contacts & Footer**: Tap-to-call and WhatsApp buttons for both families, copyable wedding hashtag, and link to the Host Admin Customizer.
- **Bilingual (English + മലയാളം)**: Instant language switcher in the floating header, remembered in `localStorage`.
- **In-Browser No-DB Host Customizer (`/admin`)**:
  - Edit couple names, parents, event venues, dates, story timeline milestones, and photo URLs directly in your browser.
  - **No database required**: Saves directly to `localStorage` for immediate live testing.
  - Includes **"Copy Code"** and **"Export JSON"** buttons to permanently update `src/data/wedding.ts` with 1 click.
- **Super-Simple Photo Management**: Simply drop your pictures into `public/photos/` (`photo-1.jpg` to `photo-10.jpg`, `story-1.jpg` to `story-4.jpg`).
- **Self-Hosted Typography**: Fully bundled via `@fontsource` (*Great Vibes*, *Playfair Display*, *Poppins*, *Noto Serif Malayalam*, *Noto Sans Malayalam*) — zero external Google Fonts requests.
- **PWA & Offline Ready**: Service worker and web manifest for app-like installation on iOS and Android.
- **Pure Static Delivery**: Generates pure static assets into `/dist` with code-splitting for Lightbox, Leaflet Map, Confetti, and Gallery.

---

## 📋 Two Simple Ways to Edit Names, Dates, Timeline & Photos

You have **two frictionless ways** to customize all wedding details:

### Option A: Use the In-Browser Host Editor (No Database Required! ⭐ Recommended)
1. Open the app in your browser and visit `/admin` (or `#admin` in your URL bar).
2. Enter the host password: `wedding2026` (or any custom password you set).
3. **Change EVERYTHING from the Admin Portal across 10 tabs**:
   - 🎨 **Colors & Theme**:
     - 1-click Royal Color Presets (Kerala Emerald, Chettinad Maroon, Sunset Rose, Sapphire Peacock, Temple Plum, Terracotta).
     - Live custom hex color pickers for Primary, Dark tones, Gold accents, Background, and Card colors with real-time interactive preview!
   - 🎵 **Music & Songs (NEW!)**:
     - Select from traditional wedding tune presets (Kerala Nadaswaram, Bamboo Flute, Veena & Swaram).
     - **Upload custom song directly from your phone/PC** (MP3, WAV, M4A).
     - Test & listen live in the browser with the in-admin **Preview / Test Music** player and volume slider.
     - Toggle whether audio autoplays when guests tap to open the envelope.
     - Customize song display title and artist name.
   - 💍 **Couple & Parents**: Groom, Bride, and Parents names, degrees, hometowns in English and Malayalam.
   - 📅 **Ceremonies & Timings**: Full control over all 3 events (Engagement, Reception, Muhurtham) dates, times, venues, addresses, Google Maps links, and dress codes.
   - ⏳ **Countdown & SEO**: Live Muhurtham countdown target date/time, wedding hashtag, and WhatsApp link sharing preview.
   - 📖 **Our Story Timeline**: Add new milestones, delete, and edit years, stories, and photo URLs.
   - 📸 **Photo Gallery**: Rearrange or change photos, captions, categories, and locations.
   - 📍 **Venue & Travel**: Venue name, address, latitude/longitude GPS coordinates, Google Maps navigation link, embed iframe, parking tips, and stay advice.
   - 📞 **Contacts & Password**: Groom and Bride family names, relations, calling numbers, WhatsApp numbers, and **custom admin password changer**.
   - ✉️ **RSVP Submissions**: View live RSVP submissions, filter/search guest names, and 1-click CSV export.
4. Click **"Save Changes"** to immediately preview your updated invitation live on your device!
5. Click **"Copy Code"** or **"Export JSON"** to permanently paste into `src/data/wedding.ts` if you want it baked into the static build.

---

### Option B: Edit Directly in Code
- **Couple, Dates & Events**: Edit `src/data/wedding.ts` (all event data is organized in this single configuration file).
- **Photos**: Simply drop your JPG/PNG files directly into `public/photos/`:
  - `photo-1.jpg` to `photo-10.jpg` for the Gallery.
  - `story-1.jpg` to `story-4.jpg` for the Our Story milestones.
  - `couple-01.jpg` for the full-bleed Hero.
  - That's it! No complex build scripts required unless you want WebP srcsets.
- **Background Music**: Place your song file at `public/audio/song.mp3`.
- **Social Sharing Banner**: Replace `public/og-image.jpg` (1200x630px).

---

## 🛠️ Local Development & Quick Start

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Test Guest Personalization
Visit [http://localhost:5173/?guest=Sundar%20Family](http://localhost:5173/?guest=Sundar%20Family) to see the invitation personalized for Sundar's family.

### 4. Optimize Images
Whenever you add or replace photos in `src/assets/prewedding/`, run:
```bash
npm run optimize-images
```

### 5. Build for Production
```bash
npm run build
```
The compiled, code-split static files will be in the `/dist` directory.

---

## 🚀 Cloudflare Pages Deployment (Zero Database Required! ⚡)

Deploying to Cloudflare Pages is completely free, instant, and requires **NO database configuration**:
- All customizations (names, dates, photos, colors, music, timeline) run in-browser and save to `localStorage`.
- All guest RSVPs forward directly to the family's WhatsApp with full details.

---

### Step 1: Connect to Cloudflare Pages
1. Push this project to your GitHub repository.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.

---

### Step 2: Enter These 3 Build Parameters
In the build settings:
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

---

### Step 3: Add 1 Environment Variable
Under **Environment variables (Advanced)**, add:
- `NODE_VERSION` = `20`

Click **Save and Deploy**! Your website is live worldwide with free SSL and edge caching!

---

## 🔒 Host RSVP Admin Portal

Access your RSVP dashboard at:
```text
https://your-domain.com/admin
```
or click **Host RSVP Portal** at the bottom of the invitation page.

- Enter the `ADMIN_PASSWORD` configured in Cloudflare.
- **Features**:
  - Live statistics: Total RSVPs, Total Attending Guests, Declined count.
  - Search guests by name or blessings note.
  - **Export CSV**: 1-click download of all RSVP responses with guest counts and ceremonies for catering and seat planning.

---

## 🖨️ Printable A5 Invitation Route

Access the physical print preview at:
```text
https://your-domain.com/qr
```
- Formatted specifically for standard **A5 portrait card stock**.
- Includes couple names, date, venue, and a scannable QR code directing guests to the live digital invitation.
- Press **Print A5 Card** or `Ctrl + P` to print with CSS print optimizations that hide web headers and buttons.

---

## 📱 Mobile Performance Targets
- **Lighthouse**: Mobile Performance 90+, Accessibility 95+, SEO 100
- **Touch Ergonomics**: All interactive elements >= 44px touch targets.
- **Bandwidth Efficiency**: Multi-resolution WebP/AVIF images with blur-up placeholders and lazy loading.
- **Graceful Fallbacks**: If Cloudflare D1 is unbound, RSVPs automatically forward directly to WhatsApp with pre-formatted attendance details.
