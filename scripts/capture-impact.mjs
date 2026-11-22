import { mkdirSync, existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!existsSync(chrome)) throw new Error('Set CHROME_PATH to Chrome or Edge.');
const server = await createServer({ server: { host: '127.0.0.1', port: 0 } });
await server.listen();
const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
mkdirSync('.tmp-capture', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  await page.goto(url);
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 0.62, y: box.height * 0.62 } });
  await page.getByRole('button', { name: 'pepperoni' }).click();
  await page.locator('.scene-shell').scrollIntoViewIfNeeded();
  for (const [name, delay] of [['fall', 350], ['impact', 350], ['rebound', 120], ['settled', 1500]]) {
    await page.waitForTimeout(delay);
    await page.screenshot({ path: `.tmp-capture/${name}.png`, fullPage: true });
  }
  console.log('Saved impact sequence to .tmp-capture.');
} finally {
  await browser.close();
  await server.close();
}
