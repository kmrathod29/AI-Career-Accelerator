import puppeteer from 'puppeteer';

async function testAuth() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for console logs and errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  
  console.log('Navigating to forgot password...');
  await page.goto('http://localhost:5173/auth/forgot-password', { waitUntil: 'networkidle0' });
  
  console.log('Clicking log in link...');
  // Find the link text "Log in"
  const links = await page.$$('a');
  let loginLink = null;
  for (const link of links) {
    const text = await page.evaluate(el => el.textContent, link);
    if (text.includes('Log in')) {
      loginLink = link;
      break;
    }
  }
  
  if (loginLink) {
    await loginLink.click();
    console.log('Clicked Log in. Waiting 2 seconds...');
    await new Promise(r => setTimeout(r, 2000));
  } else {
    console.error('Login link not found!');
  }
  
  await browser.close();
}

testAuth().catch(console.error);
