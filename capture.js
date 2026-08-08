const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 Launching Headless Browser...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2 } // iPhone 12 Pro dimensions
  });
  const page = await browser.newPage();

  // Create images directory if it doesn't exist
  if (!fs.existsSync('./images')) {
      fs.mkdirSync('./images');
  }

  // NOTE: Because this is an automated script running in an incognito window, 
  // it is NOT logged in. It will only capture the public screens (Splash, Login).
  // 
  // TO CAPTURE THE INSIDE OF THE APP: You must run this script against your local dev server
  // while modifying it to auto-fill your email/password, OR temporarily disable the Firebase 
  // requirement in App.tsx. 
  // 
  // For now, let's grab the beautiful new Splash Screen!

  console.log('🌐 Navigating to Netlify app...');
  await page.goto('https://pureloppapp.netlify.app/');
  
  // Wait for the loader to spin
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('📸 Capturing Splash Screen...');
  await page.screenshot({ path: './images/v2-splash.png' });
  console.log('✅ Saved images/v2-splash.png');

  // Wait a bit to let it transition to the Onboarding Screen
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('📸 Capturing Onboarding Screen...');
  await page.screenshot({ path: './images/v2-onboarding.png' });
  console.log('✅ Saved images/v2-onboarding.png');

  await browser.close();
  console.log('🎉 Done! Your V2 screenshots are ready.');
  console.log('\nTo get screenshots of the inside of the app (Home, Payment, Tracking), the easiest way is to just use the Windows Snipping Tool (Win + Shift + S) while logged in on your browser, and save them as v2-home.png, v2-tracking.png into the images folder!');
})();
