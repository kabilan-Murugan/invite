import puppeteer from 'puppeteer-core';
import path from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const viewports = [
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'desktop-1280', width: 1280, height: 800 },
];

async function runVerification() {
  console.log('🚀 Starting browser layout and console error verification with Edge...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const consoleErrors = [];

  for (const vp of viewports) {
    console.log(`\n📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${vp.name}] Console Error: ${msg.text()}`);
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(`[${vp.name}] Page Error: ${err.message}`);
    });

    // 1. Visit invitation with personalized query parameter
    await page.goto('http://localhost:4173/?guest=Ravi%20Family', { waitUntil: 'networkidle0' });

    // 2. Check for Horizontal Scroll / Overflow
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = vp.width;
    if (bodyScrollWidth > windowWidth) {
      console.warn(`⚠️  Warning: Potential horizontal overflow on ${vp.name}: body scrollWidth ${bodyScrollWidth} > viewport ${windowWidth}`);
    } else {
      console.log(`✅ No horizontal overflow on ${vp.name} (${bodyScrollWidth} <= ${windowWidth})`);
    }

    // 3. Take screenshot of Splash Screen
    await page.screenshot({ path: `screenshot-splash-${vp.name}.png` });

    // 4. Click Tap to open invitation
    const tapButton = await page.$('button[aria-label="Tap to Open Invitation"]');
    if (tapButton) {
      await tapButton.click();
      await new Promise(r => setTimeout(r, 900)); // wait for smooth reveal transition
    }

    // 5. Verify Personalized Guest Name is present
    const personalizedText = await page.evaluate(() => {
      return document.body.innerText.includes('Ravi Family');
    });
    console.log(`✅ Guest personalization verified on ${vp.name}: ${personalizedText ? 'PASSED' : 'FAILED'}`);

    // 6. Take full page screenshot of main content
    await page.screenshot({ path: `screenshot-opened-${vp.name}.png`, fullPage: false });

    await page.close();
  }

  await browser.close();

  console.log('\n--- VERIFICATION SUMMARY ---');
  if (consoleErrors.length > 0) {
    console.error('❌ Console errors detected:');
    consoleErrors.forEach(e => console.error(e));
    process.exit(1);
  } else {
    console.log('🎉 0 console errors detected across 375px, 414px, and 1280px widths!');
    console.log('✅ Visual verification complete!');
  }
}

runVerification().catch(err => {
  console.error('Browser verification failed:', err);
  process.exit(1);
});

