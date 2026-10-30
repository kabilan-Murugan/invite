import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PREWEDDING_DIR = path.resolve('src/assets/prewedding');
const PUBLIC_DIR = path.resolve('public');
const PUBLIC_AUDIO = path.resolve('public/audio');

if (!fs.existsSync(PREWEDDING_DIR)) {
  fs.mkdirSync(PREWEDDING_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_AUDIO)) {
  fs.mkdirSync(PUBLIC_AUDIO, { recursive: true });
}

// Color palettes for romantic couple scenes
const scenes = [
  { name: 'couple-01', title: 'Sunset Silhouette by the Shore', bg1: '#6B1E2E', bg2: '#D97706', accent: '#FEF3C7', ratio: 'landscape' },
  { name: 'couple-02', title: 'Traditional Silk Radiance', bg1: '#831843', bg2: '#C9A227', accent: '#FFFBEB', ratio: 'portrait' },
  { name: 'couple-03', title: 'Laughter Under Monsoon Rain', bg1: '#1E293B', bg2: '#3B82F6', accent: '#E0F2FE', ratio: 'landscape' },
  { name: 'couple-04', title: 'Golden Temple Pathways', bg1: '#78350F', bg2: '#F59E0B', accent: '#FEF9C3', ratio: 'portrait' },
  { name: 'couple-05', title: 'Whispers in Nilgiri Tea Gardens', bg1: '#064E3B', bg2: '#10B981', accent: '#D1FAE5', ratio: 'landscape' },
  { name: 'couple-06', title: 'Starlight Ring Exchange', bg1: '#311042', bg2: '#7E22CE', accent: '#F3E8FF', ratio: 'portrait' },
  { name: 'couple-07', title: 'Palace Corridor Walk', bg1: '#4C0519', bg2: '#E11D48', accent: '#FFE4E6', ratio: 'portrait' },
  { name: 'couple-08', title: 'Flower Petal Celebration', bg1: '#881337', bg2: '#FB7185', accent: '#FFF1F2', ratio: 'landscape' },
  { name: 'couple-09', title: 'Serene Backwater Bliss', bg1: '#0F766E', bg2: '#14B8A6', accent: '#CCFBF1', ratio: 'portrait' },
  { name: 'couple-10', title: 'Together Towards Tomorrow', bg1: '#581C87', bg2: '#C9A227', accent: '#FAF5FF', ratio: 'landscape' },
];

async function generatePlaceholders() {
  console.log('🎨 Generating romantic prewedding placeholder photographs...');

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const width = s.ratio === 'portrait' ? 1000 : 1400;
    const height = s.ratio === 'portrait' ? 1400 : 1000;

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${s.bg1}"/>
            <stop offset="50%" stop-color="#4A0E17"/>
            <stop offset="100%" stop-color="${s.bg2}"/>
          </linearGradient>
          <radialGradient id="radial${i}" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#FFE4A0" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.75"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Background Gradient -->
        <rect width="${width}" height="${height}" fill="url(#grad${i})"/>
        <rect width="${width}" height="${height}" fill="url(#radial${i})"/>

        <!-- Decorative Arch & Mandapam Border -->
        <rect x="30" y="30" width="${width - 60}" height="${height - 60}" rx="24" fill="none" stroke="#C9A227" stroke-width="2.5" stroke-dasharray="12 6" opacity="0.6"/>
        <rect x="45" y="45" width="${width - 90}" height="${height - 90}" rx="18" fill="none" stroke="#C9A227" stroke-width="1" opacity="0.4"/>

        <!-- Ornamental Corner Motifs -->
        <circle cx="50" cy="50" r="12" fill="none" stroke="#C9A227" stroke-width="2" opacity="0.7"/>
        <circle cx="${width - 50}" cy="50" r="12" fill="none" stroke="#C9A227" stroke-width="2" opacity="0.7"/>
        <circle cx="50" cy="${height - 50}" r="12" fill="none" stroke="#C9A227" stroke-width="2" opacity="0.7"/>
        <circle cx="${width - 50}" cy="${height - 50}" r="12" fill="none" stroke="#C9A227" stroke-width="2" opacity="0.7"/>

        <!-- Center Couple Silhouette Motif -->
        <g transform="translate(${width / 2}, ${height * 0.42}) scale(${s.ratio === 'portrait' ? 1.4 : 1.2})" filter="url(#glow)">
          <!-- Halo / Ring -->
          <circle cx="0" cy="-20" r="110" fill="none" stroke="#FFDF78" stroke-width="2" opacity="0.35"/>
          <circle cx="0" cy="-20" r="130" fill="none" stroke="#FFDF78" stroke-width="1" stroke-dasharray="8 6" opacity="0.25"/>

          <!-- Groom Silhouette -->
          <circle cx="-35" cy="-75" r="28" fill="#FFF8F0" opacity="0.85"/>
          <path d="M-65 -40 C-65 -40, -45 -10, -5 0 C-10 40, -20 100, -25 140 L-65 140 Z" fill="#FFF8F0" opacity="0.8"/>

          <!-- Bride Silhouette -->
          <circle cx="35" cy="-68" r="25" fill="#FFF8F0" opacity="0.85"/>
          <!-- Saree Pallu & Bun -->
          <circle cx="58" cy="-70" r="14" fill="#C9A227" opacity="0.8"/>
          <path d="M5 -40 C5 -40, 25 -10, 65 0 C65 50, 75 110, 85 140 L-10 140 C5 90, 0 30, 5 -40 Z" fill="#C9A227" opacity="0.75"/>
          
          <!-- Hearts & Sparkles -->
          <path d="M0 -115 C-12 -135 -38 -125 -38 -105 C-38 -85 0 -60 0 -60 C0 -60 38 -85 38 -105 C38 -125 12 -135 0 -115 Z" fill="#E11D48" opacity="0.8"/>
        </g>

        <!-- Typography Overlay -->
        <text x="${width / 2}" y="${height * 0.72}" text-anchor="middle" font-family="Georgia, serif" font-size="${s.ratio === 'portrait' ? 44 : 40}" font-style="italic" fill="#FFDF78" letter-spacing="3" opacity="0.95">
          Karthik &amp; Ananya
        </text>
        <text x="${width / 2}" y="${height * 0.78}" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="600" fill="#FFF8F0" letter-spacing="6" opacity="0.85">
          ${s.title.toUpperCase()}
        </text>
        <text x="${width / 2}" y="${height * 0.83}" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#E2E8F0" letter-spacing="4" opacity="0.6">
          PRE-WEDDING MEMORIES • FRAME ${i + 1} OF 10
        </text>
      </svg>
    `;

    const outPath = path.join(PREWEDDING_DIR, `${s.name}.jpg`);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(outPath);
  }

  // Also generate 1200x630 og-image.jpg for social sharing
  const ogSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A0E17"/>
          <stop offset="50%" stop-color="#6B1E2E"/>
          <stop offset="100%" stop-color="#C9A227"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#ogGrad)"/>
      <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#C9A227" stroke-width="2" stroke-dasharray="10 6" opacity="0.7"/>
      <circle cx="600" cy="220" r="90" fill="none" stroke="#FFDF78" stroke-width="2" opacity="0.4"/>
      <text x="600" y="190" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#FFDF78" letter-spacing="6">WEDDING INVITATION</text>
      <text x="600" y="260" text-anchor="middle" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="#FFF8F0">Karthik &amp; Ananya</text>
      <text x="600" y="340" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#FFDF78" letter-spacing="3">SUNDAY, NOVEMBER 29, 2026</text>
      <text x="600" y="390" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#E2E8F0">The Grand Chola Palace Hall • Guindy, Chennai</text>
      <text x="600" y="490" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#FFF8F0" opacity="0.8">Tap to view interactive invitation &amp; RSVP</text>
    </svg>
  `;
  await sharp(Buffer.from(ogSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join(PUBLIC_DIR, 'og-image.jpg'));

  // Also generate favicon.svg
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#6B1E2E"/>
    <circle cx="50" cy="50" r="42" fill="none" stroke="#C9A227" stroke-width="3"/>
    <circle cx="42" cy="48" r="20" fill="none" stroke="#FFDF78" stroke-width="4"/>
    <circle cx="58" cy="52" r="20" fill="none" stroke="#FFDF78" stroke-width="4"/>
    <circle cx="65" cy="35" r="4" fill="#FFF"/>
  </svg>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), faviconSvg, 'utf-8');

  // Also apple-touch-icon.png
  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

  console.log('✅ Generated 10 placeholder photos, og-image.jpg, favicon, and apple-touch-icon');
}

generatePlaceholders().catch(console.error);

