import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new',
  });
  const page = await browser.newPage();
  // Set viewport to letter-size at 96dpi (8.5in x 11in = 816 x 1056px, minus 1in margins = 624 x 864px)
  await page.setViewport({ width: 816, height: 1056 });
  await page.goto('http://localhost:3000/future?pdf=1', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });
  await new Promise(r => setTimeout(r, 3000));

  // Measure the height of the page 2 wrapper
  const measurements = await page.evaluate(() => {
    const wrapper = document.querySelector('.future-page-2-wrapper');
    const mainWrapper = document.querySelector('.future-main-wrapper');
    const allContent = document.querySelector('.future-main-wrapper > div');
    
    // Letter size with 0.5in margins: usable area = 7.5in x 10in = 720 x 960px at 96dpi
    // But Puppeteer uses CSS pixels at 96dpi for the viewport
    const letterUsableHeightPx = 10 * 96; // 960px
    
    return {
      page2WrapperHeight: wrapper ? wrapper.getBoundingClientRect().height : 'not found',
      page2WrapperTop: wrapper ? wrapper.getBoundingClientRect().top : 'not found',
      mainWrapperHeight: mainWrapper ? mainWrapper.getBoundingClientRect().height : 'not found',
      allContentHeight: allContent ? allContent.getBoundingClientRect().height : 'not found',
      letterUsableHeightPx,
      // Check if page 2 wrapper fits in letter usable area
      page2FitsInPage: wrapper ? wrapper.getBoundingClientRect().height <= letterUsableHeightPx : false,
    };
  });
  
  console.log('Measurements:', JSON.stringify(measurements, null, 2));
  await browser.close();
})();
