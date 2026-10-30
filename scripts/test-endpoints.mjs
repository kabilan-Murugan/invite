const endpoints = [
  'http://localhost:4173/',
  'http://localhost:4173/?guest=Ravi%20Family',
  'http://localhost:4173/qr',
  'http://localhost:4173/admin',
  'http://localhost:4173/manifest.webmanifest',
  'http://localhost:4173/favicon.svg',
  'http://localhost:4173/apple-touch-icon.png',
  'http://localhost:4173/og-image.jpg',
  'http://localhost:4173/audio/song.mp3',
  'http://localhost:4173/optimized/couple-01-800.webp',
  'http://localhost:4173/optimized/couple-01-480.avif',
];

async function test() {
  console.log('🧪 Testing wedding website endpoints...');
  let failed = false;

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      console.log(`[${res.status}] ${url} - Content-Type: ${res.headers.get('content-type')}`);
      if (!res.ok) {
        failed = true;
      }
    } catch (err) {
      console.error(`FAILED: ${url}`, err.message);
      failed = true;
    }
  }

  if (failed) {
    console.error('❌ Endpoint test failed!');
    process.exit(1);
  } else {
    console.log('✅ All endpoints returned 200 OK successfully!');
  }
}

test();

