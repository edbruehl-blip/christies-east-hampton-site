/**
 * Generate /future PDF using @media print emulation
 * Simulates window.print() — does NOT append ?pdf=1
 * @media print CSS is the sole inversion mechanism for this path.
 *
 * PF-LAYOUT-REBUILD · April 20 2026
 * One continuous page: measure full content height, set PDF height accordingly.
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
import { writeFileSync } from 'node:fs';

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: true,
});

const page = await browser.newPage();
// Wide viewport to match the live screen layout
await page.setViewport({ width: 1440, height: 900 });

// Navigate to /future WITHOUT ?pdf=1 — same as what window.print() sees
const url = 'http://localhost:3000/future';
console.log(`[Print] Navigating to ${url}`);
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for fonts, data, and charts to load
await new Promise(r => setTimeout(r, 4000));

// Emulate print media — this is what @media print CSS targets
await page.emulateMediaType('print');

// Wait for print styles to apply
await new Promise(r => setTimeout(r, 1500));

// Measure the full content height after print styles are applied
const contentHeight = await page.evaluate(() => {
  // Get the future-main-wrapper height (the actual content)
  const wrapper = document.querySelector('.future-main-wrapper');
  if (wrapper) {
    return wrapper.scrollHeight + 120; // add margin buffer
  }
  // Fallback: full document scroll height
  return document.documentElement.scrollHeight + 120;
});

console.log(`[Print] Content height: ${contentHeight}px`);

// Page width: 8.5in at 96dpi = 816px
// Use 8.5in wide, dynamic height for one continuous page
const pageWidthIn = 8.5;
const marginIn = 0.35;
const pageHeightIn = (contentHeight / 96).toFixed(2); // convert px to inches (96dpi)

console.log(`[Print] Page size: ${pageWidthIn}in x ${pageHeightIn}in`);

// Generate PDF with dynamic height — one continuous page
const pdfBuffer = await page.pdf({
  width: `${pageWidthIn}in`,
  height: `${pageHeightIn}in`,
  printBackground: true,
  margin: { top: `${marginIn}in`, right: `${marginIn}in`, bottom: `${marginIn}in`, left: `${marginIn}in` },
});

await browser.close();
writeFileSync('/home/ubuntu/future_print_emulated.pdf', pdfBuffer);
console.log(`[Print] PDF saved: ${pdfBuffer.length} bytes`);
