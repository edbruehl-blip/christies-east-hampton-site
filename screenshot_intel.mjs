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
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });
  await new Promise(r => setTimeout(r, 2000));

  // Click the INTEL tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button, a, [role="tab"]'));
    const intelTab = tabs.find(el => el.textContent?.trim().toUpperCase() === 'INTEL');
    if (intelTab) intelTab.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot the first viewport
  await page.screenshot({
    path: path.join(__dirname, 'screenshot_intel_viewport.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('Screenshot saved');
})();
