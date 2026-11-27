import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve('public');
const PHOTO_PATH = path.resolve('public/photos/couple-01.jpg');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // Prepare the couple portrait as a 450x630 right-side panel with soft fade
  let photoBuffer = null;
  if (fs.existsSync(PHOTO_PATH)) {
    photoBuffer = await sharp(PHOTO_PATH)
      .resize(480, height, { fit: 'cover', position: 'attention' })
      .modulate({ saturation: 0.25, brightness: 1.02 })
      .toBuffer();
  }

  // Luxury Pearl Ivory & Champagne Gold SVG card overlay
  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FCFBF8" stop-opacity="1"/>
          <stop offset="58%" stop-color="#FCFBF8" stop-opacity="0.98"/>
          <stop offset="76%" stop-color="#FCFBF8" stop-opacity="0.72"/>
          <stop offset="100%" stop-color="#FCFBF8" stop-opacity="0.18"/>
        </linearGradient>
        <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#C5A038" stop-opacity="0.1"/>
          <stop offset="50%" stop-color="#C5A038" stop-opacity="1"/>
          <stop offset="100%" stop-color="#C5A038" stop-opacity="0.1"/>
        </linearGradient>
      </defs>

      <!-- Soft pearl ivory fade over right-side photo -->
      <rect width="${width}" height="${height}" fill="${photoBuffer ? 'url(#bgGrad)' : '#FCFBF8'}"/>

      <!-- Outer Champagne Gold Frame -->
      <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="20" fill="none" stroke="#C5A038" stroke-width="2" opacity="0.65"/>
      <rect x="34" y="34" width="${width - 68}" height="${height - 68}" rx="14" fill="none" stroke="#C5A038" stroke-width="1" opacity="0.35"/>

      <!-- Left/Center Typography -->
      <text x="410" y="135" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="#9B7722" letter-spacing="6">✦ WEDDING INVITATION ✦</text>

      <text x="410" y="250" text-anchor="middle" font-family="Georgia, serif" font-size="74" font-style="italic" font-weight="bold" fill="#1E2421">Sajith &amp; Adithya</text>

      <rect x="230" y="290" width="360" height="1.5" fill="url(#goldLine)"/>

      <text x="410" y="355" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="bold" fill="#8C6D28" letter-spacing="3">SUNDAY, FEBRUARY 07, 2027</text>
      <text x="410" y="398" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#4A443D">10:30 AM – 12:40 PM • Muhurtham</text>

      <text x="410" y="460" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#1E2421">Shilpa Auditorium</text>
      <text x="410" y="492" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#5C5449">Mylom, Kottarakkara • Kollam, Kerala</text>

      <text x="410" y="558" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="600" fill="#9B7722" letter-spacing="2">TAP TO VIEW INVITATION &amp; RSVP</text>
    </svg>
  `;

  const base = sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 252, g: 251, b: 248 },
    },
  });

  const layers = [];
  if (photoBuffer) {
    layers.push({ input: photoBuffer, left: width - 480, top: 0 });
  }
  layers.push({ input: Buffer.from(svgOverlay), left: 0, top: 0 });

  await base
    .composite(layers)
    .jpeg({ quality: 92 })
    .toFile(path.join(PUBLIC_DIR, 'og-image.jpg'));

  console.log('✅ Generated updated public/og-image.jpg (1200x630)');
}

generateOgImage().catch((err) => {
  console.error('Failed to generate OG image:', err);
  process.exit(1);
});
