import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 900 });
await page.goto('https://example.com', { waitUntil: 'networkidle2' });
const title = await page.title();
console.log('Puppeteer OK — page title:', title);

const pdf = await page.pdf({ format: 'A4' });
console.log('PDF generated — size:', pdf.length, 'bytes');

await browser.close();
console.log('PUPPETEER CONFIRMED: headless Chromium works in Manus hosting environment');
