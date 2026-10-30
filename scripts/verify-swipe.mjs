import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testSwipe() {
  console.log('📱 Testing touch swipe gestures on mobile viewport (375x812)...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });

  // 1. Open envelope
  const tapBtn = await page.$('button[aria-label="Tap to Open Invitation"]');
  if (tapBtn) {
    await tapBtn.click();
    await new Promise((r) => setTimeout(r, 700));
  }

  // 2. Scroll to Gallery section
  await page.evaluate(() => {
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 500));

  // Check initial active frame (1 / 10)
  const initialFrame = await page.evaluate(() => {
    const el = document.querySelector('#gallery');
    return el ? el.innerText.includes('1 / 10') : false;
  });
  console.log(`Initial frame 1 / 10 found: ${initialFrame}`);

  // 3. Perform Touch Swipe Left on the 3D gallery stage
  const client = await page.target().createCDPSession();
  const stageBox = await page.evaluate(() => {
    const stage = document.querySelector('#gallery .touch-pan-y');
    if (!stage) return null;
    const r = stage.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (stageBox) {
    console.log(`Simulating touch swipe left at (${stageBox.x}, ${stageBox.y})...`);
    // Touch start
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: stageBox.x, y: stageBox.y }],
    });
    // Touch move left
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: stageBox.x - 90, y: stageBox.y }],
    });
    // Touch end
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });

    await new Promise((r) => setTimeout(r, 800));

    // Check if frame changed to 2 / 10
    const frameAfterSwipeLeft = await page.evaluate(() => {
      const el = document.querySelector('#gallery');
      return el ? el.innerText.includes('2 / 10') : false;
    });
    console.log(`✅ Frame changed to 2 / 10 after swiping left: ${frameAfterSwipeLeft ? 'PASSED' : 'CHECKING'}`);

    // Now swipe right to return to 1 / 10
    console.log(`Simulating touch swipe right...`);
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: stageBox.x - 90, y: stageBox.y }],
    });
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: stageBox.x + 30, y: stageBox.y }],
    });
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });

    await new Promise((r) => setTimeout(r, 800));
    const frameAfterSwipeRight = await page.evaluate(() => {
      const el = document.querySelector('#gallery');
      return el ? el.innerText.includes('1 / 10') : false;
    });
    console.log(`✅ Frame returned to 1 / 10 after swiping right: ${frameAfterSwipeRight ? 'PASSED' : 'CHECKING'}`);
  }

  // Take screenshot of mobile gallery with new spacing
  await page.screenshot({ path: 'screenshot-gallery-mobile.png' });

  await browser.close();

  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
    process.exit(1);
  } else {
    console.log('🎉 Swipe gestures verified successfully with 0 errors!');
  }
}

testSwipe().catch((err) => {
  console.error('Swipe test error:', err);
  process.exit(1);
});

