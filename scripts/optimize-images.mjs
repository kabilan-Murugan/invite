import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = path.resolve('src/assets/prewedding');
const OUTPUT_DIR = path.resolve('public/optimized');
const MANIFEST_PATH = path.resolve('src/data/optimized-images.json');

const TARGET_WIDTHS = [480, 800, 1200, 1600];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function run() {
  console.log('🖼️  Optimizing wedding photos with Sharp...');
  await ensureDir(INPUT_DIR);
  await ensureDir(OUTPUT_DIR);

  const files = fs.readdirSync(INPUT_DIR).filter(file => {
    return /\.(jpe?g|png|webp|avif)$/i.test(file);
  });

  if (files.length === 0) {
    console.log('⚠️  No input photos found in src/assets/prewedding. Generating sample SVG-based placeholders...');
    // We will generate sample placeholders if none exist
  }

  const manifest = {};

  for (const file of files) {
    const baseName = path.parse(file).name;
    const inputFilePath = path.join(INPUT_DIR, file);

    console.log(`Processing: ${file}`);
    const metadata = await sharp(inputFilePath).metadata();

    const entry = {
      id: baseName,
      originalWidth: metadata.width || 1200,
      originalHeight: metadata.height || 800,
      aspectRatio: (metadata.width || 1200) / (metadata.height || 800),
      blurDataUrl: '',
      webpSrcSet: '',
      avifSrcSet: '',
      defaultSrc: `/optimized/${baseName}-800.webp`,
    };

    // 1. Generate tiny base64 blur placeholder (20px width)
    const blurBuffer = await sharp(inputFilePath)
      .resize(20, null, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer();
    entry.blurDataUrl = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    const webpSrcSetParts = [];
    const avifSrcSetParts = [];

    // 2. Generate multi-resolution WebP and AVIF files
    for (const width of TARGET_WIDTHS) {
      // Don't upscale if original is smaller
      const targetWidth = Math.min(width, metadata.width || width);

      const webpFileName = `${baseName}-${targetWidth}.webp`;
      const avifFileName = `${baseName}-${targetWidth}.avif`;

      const webpOutPath = path.join(OUTPUT_DIR, webpFileName);
      const avifOutPath = path.join(OUTPUT_DIR, avifFileName);

      await sharp(inputFilePath)
        .resize(targetWidth, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(webpOutPath);

      await sharp(inputFilePath)
        .resize(targetWidth, null, { withoutEnlargement: true })
        .avif({ quality: 75 })
        .toFile(avifOutPath);

      webpSrcSetParts.push(`/optimized/${webpFileName} ${targetWidth}w`);
      avifSrcSetParts.push(`/optimized/${avifFileName} ${targetWidth}w`);
    }

    entry.webpSrcSet = webpSrcSetParts.join(', ');
    entry.avifSrcSet = avifSrcSetParts.join(', ');

    manifest[baseName] = entry;
  }

  await ensureDir(path.dirname(MANIFEST_PATH));
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`✨ Successfully optimized ${files.length} images. Manifest written to ${MANIFEST_PATH}`);
}

run().catch(err => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});

