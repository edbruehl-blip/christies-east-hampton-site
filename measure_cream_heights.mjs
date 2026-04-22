import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 816, height: 1056 });
  await page.goto('http://localhost:3000/future?pdf=1', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });
  await new Promise(r => setTimeout(r, 3000));

  const heights = await page.evaluate(() => {
    const root = document.querySelector('#root > div');
    const sections = document.querySelectorAll('.pfc-page');
    const results = {
      rootHeight: root ? root.getBoundingClientRect().height : 'NOT FOUND',
      sections: [],
    };
    sections.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      results.sections.push({
        index: i,
        className: s.className,
        top: Math.round(r.top),
        height: Math.round(r.height),
        bottom: Math.round(r.bottom),
      });
    });
    return results;
  });

  console.log('Root height:', heights.rootHeight);
  console.log('Sections:');
  heights.sections.forEach(s => {
    console.log(`  [${s.index}] ${s.className}: top=${s.top} height=${s.height} bottom=${s.bottom}`);
  });
  console.log('Letter usable height (0.5in margins): 720px');
  console.log('Overflow page 1:', Math.max(0, heights.sections[0]?.height - 720), 'px');
  console.log('Overflow page 2:', Math.max(0, heights.sections[1]?.height - 720), 'px');

  await browser.close();
})();
