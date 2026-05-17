// Capture mobile screenshots of http://localhost:3006/ using system Chrome.
// Saves one full-page PNG plus N chunked PNGs in _workshop/screenshots/.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'http://localhost:3006/';
const WIDTH = 375;
const HEIGHT = 812;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT_DIR = path.join(__dirname, 'screenshots');

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
  console.log('Navigating...');
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 });
  // Bundler decodes base64 → blob URLs after DOMContentLoaded. Give it time.
  await new Promise(r => setTimeout(r, 8000));

  // Hide GNB during scroll so it doesn't print over content in chunks.
  // Hide BackToTop button so the floating arrow doesn't appear in every shot.
  await page.addStyleTag({
    content: `
      *, *::before, *::after { animation-play-state: paused !important; transition: none !important; }
      .gnb { position: absolute !important; }
      .back-to-top { display: none !important; }
    `,
  });
  await new Promise(r => setTimeout(r, 1500));

  // Full page first
  const fullPath = path.join(OUT_DIR, 'mobile-full.png');
  console.log('Full-page shot →', fullPath);
  await page.screenshot({ path: fullPath, fullPage: true, type: 'png' });

  // Chunked shots so they're easier to view individually.
  const docHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log('docHeight:', docHeight);
  // Chunk by viewport, with 80px overlap to soften section seams.
  const step = HEIGHT - 80;
  let i = 0;
  for (let y = 0; y < docHeight; y += step) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await new Promise(r => setTimeout(r, 400));
    const p = path.join(OUT_DIR, `mobile-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: p, type: 'png' });
    console.log(`  shot ${i} at y=${y} →`, path.basename(p));
    i++;
  }

  await browser.close();
  console.log('Done. Saved', i + 1, 'images to', OUT_DIR);
})().catch(e => { console.error(e); process.exit(1); });
