/**
 * Generate /future PDF using @media print emulation
 * Simulates window.print() — does NOT append ?pdf=1
 * @media print CSS is the sole inversion mechanism for this path.
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
await page.setViewport({ width: 1280, height: 900 });

// Navigate to /future WITHOUT ?pdf=1 — same as what window.print() sees
const url = 'http://localhost:3000/future';
console.log(`[Print] Navigating to ${url}`);
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for fonts and data to load
await new Promise(r => setTimeout(r, 3000));

// Emulate print media — this is what @media print CSS targets
await page.emulateMediaType('print');

// Wait for print styles to apply
await new Promise(r => setTimeout(r, 1000));

// Generate PDF
const pdfBuffer = await page.pdf({
  format: 'Letter',
  printBackground: true,
  margin: { top: '0.45in', right: '0.45in', bottom: '0.45in', left: '0.45in' },
});

await browser.close();

writeFileSync('/home/ubuntu/future_print_emulated.pdf', pdfBuffer);
console.log(`[Print] PDF saved: ${pdfBuffer.length} bytes`);
