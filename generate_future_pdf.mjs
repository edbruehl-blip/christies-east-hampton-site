import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, 'christies_future_cream.pdf');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new',
  });
  const page = await browser.newPage();

  // Navigate to the /future?pdf=1 route
  await page.goto('http://localhost:3000/future?pdf=1', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Wait for Chart.js to render
  await new Promise(r => setTimeout(r, 3000));

  // Print to PDF — US Letter, cream background
  await page.pdf({
    path: OUTPUT,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
  });

  await browser.close();
  console.log('PDF generated:', OUTPUT);
})();
