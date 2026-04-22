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

  const measurements = await page.evaluate(() => {
    const letterUsableHeightPx = 10 * 96; // 960px (10in at 96dpi)
    
    // Get all major sections
    const mainWrapper = document.querySelector('.future-main-wrapper');
    const page2Wrapper = document.querySelector('.future-page-2-wrapper');
    
    // The inner div (maxWidth 1100)
    const innerDiv = mainWrapper ? mainWrapper.querySelector(':scope > div') : null;
    
    // Get all direct children of the inner div
    const children = innerDiv ? Array.from(innerDiv.children) : [];
    const childMeasurements = children.map((el, i) => ({
      index: i,
      className: el.className || '(no class)',
      tagName: el.tagName,
      height: el.getBoundingClientRect().height,
      top: el.getBoundingClientRect().top,
      bottom: el.getBoundingClientRect().bottom,
    }));
    
    return {
      letterUsableHeightPx,
      mainWrapperHeight: mainWrapper ? mainWrapper.getBoundingClientRect().height : 'not found',
      innerDivHeight: innerDiv ? innerDiv.getBoundingClientRect().height : 'not found',
      page2WrapperHeight: page2Wrapper ? page2Wrapper.getBoundingClientRect().height : 'not found',
      page2WrapperTop: page2Wrapper ? page2Wrapper.getBoundingClientRect().top : 'not found',
      children: childMeasurements,
    };
  });
  
  console.log('Measurements:', JSON.stringify(measurements, null, 2));
  await browser.close();
})();
