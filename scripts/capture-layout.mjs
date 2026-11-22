import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!existsSync(chrome)) throw new Error('Set CHROME_PATH to a Chromium browser.');
const server = await createServer({ server: { host: '127.0.0.1', port: 0 } });
await server.listen();
const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--enable-gpu'] });
mkdirSync('screenshots', { recursive: true });
try {
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['tablet', { width: 768, height: 1024 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: name === 'mobile' ? 2 : 1 });
    await page.goto(url);
    await page.waitForFunction(() => !document.querySelector('.edit-grid button').disabled);
    await page.getByRole('button', { name: 'Create my bomb' }).click();
    await page.locator('.quarter-button').first().click();
    for (const ingredient of ['mushroom', 'pineapple']) await page.locator('.ingredient-button').filter({ hasText: new RegExp(`^${ingredient}`, 'i') }).click();
    await page.locator('.quarter-button').nth(2).click();
    for (const ingredient of ['pepperoni', 'bacon']) await page.locator('.ingredient-button').filter({ hasText: new RegExp(`^${ingredient}`, 'i') }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    await page.close();
  }
  console.log('Saved desktop, tablet, and mobile screenshots.');
} finally {
  await browser.close();
  await server.close();
}
