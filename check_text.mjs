import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});

const page = await browser.newPage();
await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000/future?pdf=1', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 3000));

const text = await page.evaluate(() => document.body.innerText);

// Check specific strings
const checks = [
  ['Partnership Projections', text.includes('Partnership Projections')],
  ['PARTNERSHIP PROJECTIONS', text.includes('PARTNERSHIP PROJECTIONS')],
  ['2026 – 2036', text.includes('2026 – 2036')],
  ['2026 - 2036', text.includes('2026 - 2036')],
  ['Edward Bruehl', text.includes('Edward Bruehl')],
  ['EDWARD BRUEHL', text.includes('EDWARD BRUEHL')],
  ['Ilija Pavlovic', text.includes('Ilija Pavlovic')],
  ['ILIJA PAVLOVIC', text.includes('ILIJA PAVLOVIC')],
  ['Angel Theodore', text.includes('Angel Theodore')],
  ['ANGEL THEODORE', text.includes('ANGEL THEODORE')],
  ['Jarvis Slade', text.includes('Jarvis Slade')],
  ['JARVIS SLADE', text.includes('JARVIS SLADE')],
  ['Zoila Ortega Astor', text.includes('Zoila Ortega Astor')],
  ['ZOILA ORTEGA ASTOR', text.includes('ZOILA ORTEGA ASTOR')],
  ['Scott Smith', text.includes('Scott Smith')],
  ['SCOTT SMITH', text.includes('SCOTT SMITH')],
  ['Richard Bruehl', text.includes('Richard Bruehl')],
  ['RICHARD BRUEHL', text.includes('RICHARD BRUEHL')],
  ['Governing Principle', text.includes('Governing Principle')],
  ['GOVERNING PRINCIPLE', text.includes('GOVERNING PRINCIPLE')],
  ['Zoila Vesting', text.includes('Zoila Vesting')],
  ['ZOILA VESTING', text.includes('ZOILA VESTING')],
  ['AnewHomes Co', text.includes('AnewHomes Co')],
  ['ANEW', text.includes('ANEW')],
];

for (const [label, result] of checks) {
  console.log(`${result ? '✅' : '❌'} "${label}"`);
}

await browser.close();
