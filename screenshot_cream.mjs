import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new',
  });
  const page = await browser.newPage();
  // Use letter-width viewport for accurate preview
  await page.setViewport({ width: 816, height: 1056 });
  await page.goto('http://localhost:3000/future?pdf=1', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });
  // Wait for Chart.js to render
  await new Promise(r => setTimeout(r, 3000));

  // Screenshot the full page
  await page.screenshot({
    path: path.join(__dirname, 'screenshot_cream_full.png'),
    fullPage: true,
  });

  // Also screenshot just the first viewport (page 1)
  await page.screenshot({
    path: path.join(__dirname, 'screenshot_cream_page1.png'),
    fullPage: false,
    clip: { x: 0, y: 0, width: 816, height: 1056 },
  });

  // Screenshot page 2
  await page.screenshot({
    path: path.join(__dirname, 'screenshot_cream_page2.png'),
    fullPage: false,
    clip: { x: 0, y: 1056, width: 816, height: 1056 },
  });

  await browser.close();
  console.log('Screenshots saved');
})();
