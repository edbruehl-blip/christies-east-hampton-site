import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/future', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 4000));
await page.emulateMediaType('print');
await new Promise(r => setTimeout(r, 1500));

const heights = await page.evaluate(() => {
  const wrapper = document.querySelector('.future-main-wrapper');
  const grid = document.querySelector('.future-participant-grid');
  return {
    bodyScrollH: document.body.scrollHeight,
    docScrollH: document.documentElement.scrollHeight,
    wrapperScrollH: wrapper ? wrapper.scrollHeight : 'not found',
    wrapperOffsetH: wrapper ? wrapper.offsetHeight : 'not found',
    gridScrollH: grid ? grid.scrollHeight : 'not found',
    gridOffsetH: grid ? grid.offsetHeight : 'not found',
  };
});
console.log(JSON.stringify(heights, null, 2));
await browser.close();
