import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});

const page = await browser.newPage();
await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });

console.log('Navigating to /future?pdf=1 ...');
await page.goto('http://localhost:3000/future?pdf=1', { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for chart to render
await new Promise(r => setTimeout(r, 3000));

// Take full-page screenshot
const fullPath = path.join(__dirname, 'acceptance_full.png');
await page.screenshot({ path: fullPath, fullPage: true });
console.log('Full screenshot saved:', fullPath);

// Take page 1 viewport screenshot
const p1Path = path.join(__dirname, 'acceptance_page1.png');
await page.screenshot({ path: p1Path, fullPage: false });
console.log('Page 1 viewport saved:', p1Path);

// Scroll to page 2 and screenshot
const page1Height = await page.evaluate(() => {
  const p1 = document.querySelector('.pfc-page-1');
  return p1 ? p1.getBoundingClientRect().bottom : 1056;
});
await page.evaluate((y) => window.scrollTo(0, y), page1Height);
await new Promise(r => setTimeout(r, 500));

const p2Path = path.join(__dirname, 'acceptance_page2.png');
await page.screenshot({ path: p2Path, fullPage: false });
console.log('Page 2 viewport saved:', p2Path);

// Get heights for diagnostics
const heights = await page.evaluate(() => {
  const root = document.getElementById('root');
  const p1 = document.querySelector('.pfc-page-1');
  const p2 = document.querySelector('.pfc-page-2');
  return {
    root: root?.scrollHeight,
    page1: p1?.scrollHeight,
    page2: p2?.scrollHeight,
  };
});
console.log('Heights:', JSON.stringify(heights));

// Check acceptance items via DOM
const checks = await page.evaluate(() => {
  const text = document.body.innerText;
  return {
    page1of2: text.includes('Page 1 of 2'),
    page2of2: text.includes('Page 2 of 2'),
    arcChart: !!document.querySelector('canvas'),
    museumMat: text.includes('ASCENSION ARC') || text.includes('Ascension Arc'),
    hundredDayCards: text.includes('1ST 100 DAYS') || text.includes('100 DAYS'),
    noLivePill: !text.includes('● LIVE'),
    noIntroButton: !text.includes('INTRO'),
    brandBand: text.includes("CHRISTIE'S") && text.includes('EST. 1766'),
    page2Title: text.includes('Partnership Projections'),
    sevenCards: ['Edward Bruehl', 'Ilija Pavlovic', 'Angel Theodore', 'Jarvis Slade', 'Zoila Ortega Astor', 'Scott Smith', 'Richard Bruehl'].every(n => text.includes(n)),
    edTotal: text.includes('6.14'),
    ilijaTotal: text.includes('7.4'),
    cps1Value: text.includes('1.13'),
    levers: text.includes('12 PPL') || text.includes('12 ppl'),
    footnotes: text.includes('Governing Principle') && text.includes('Zoila Vesting'),
    uhnwCard: text.includes('UHNW') || text.includes('Wealth Path'),
  };
});
console.log('DOM checks:', JSON.stringify(checks, null, 2));

await browser.close();
console.log('Done.');
