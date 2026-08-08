const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Users\\ASUS\\.cache\\puppeteer\\chrome\\win64-150.0.7871.24\\chrome-win64\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set a wide enough viewport so layout matches the desktop design
  await page.setViewport({ width: 1280, height: 900 });

  const filePath = 'file:///C:/Users/ASUS/.gemini/antigravity/scratch/laundry-case-study/index.html';
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 60000 });

  // ── FIX 1: Remove lazy loading from all images so they load immediately ──
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.removeAttribute('loading');
      // Re-trigger load by resetting src
      const src = img.src;
      img.src = '';
      img.src = src;
    });
  });

  // ── FIX 2: Auto-scroll the entire page to trigger IntersectionObserver ──
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const scrollStep = 500;
      const delay = 100;
      let currentPos = 0;
      const totalHeight = document.body.scrollHeight;

      const timer = setInterval(() => {
        window.scrollBy(0, scrollStep);
        currentPos += scrollStep;
        if (currentPos >= totalHeight) {
          window.scrollTo(0, 0); // scroll back to top
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  });

  // ── FIX 3: Force all reveal elements visible after scroll ──
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
  });

  // ── FIX 4: Wait for ALL images to fully load ──
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // don't hang on broken images
        });
      })
    );
  });

  // Final wait for any remaining repaints
  await new Promise(r => setTimeout(r, 2000));

  // ── Generate PDF ──
  await page.pdf({
    path: 'C:\\Users\\ASUS\\Downloads\\pbcs\\pureloop-case-study.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: false,
  });

  console.log('✅ PDF generated: C:\\Users\\ASUS\\Downloads\\pbcs\\pureloop-case-study.pdf');
  await browser.close();
})();
