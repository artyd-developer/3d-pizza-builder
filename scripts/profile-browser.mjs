import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!existsSync(chrome)) throw new Error('Set CHROME_PATH to a Chromium browser.');
const server = await createServer({ server: { host: '127.0.0.1', port: 0 } });
await server.listen();
const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--enable-gpu'] });
try {
  for (const viewport of [{ width: 900, height: 700 }, { width: 390, height: 720 }]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: viewport.width < 500 ? 2 : 1 });
    await page.goto(url);
    const canvas = page.locator('canvas');
    assert.equal(await page.locator('[role=alert]').count(), 0, 'WebGL renderer started');
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: box.width * 0.62, y: box.height * 0.62 } });
    for (let i = 0; i < 12; i++) await page.getByRole('button', { name: i % 3 === 0 ? 'mushroom' : i % 3 === 1 ? 'pineapple' : 'pepperoni' }).click();
    const count = await page.locator('.count-pill').innerText();
    assert.ok(Number(count.match(/\d+/)?.[0]) >= 6, `several toppings were added: ${count}`);
    const intervals = await page.evaluate(() => new Promise((resolve) => {
      const samples = [];
      let previous = 0;
      const frame = (now) => {
        if (previous) samples.push(now - previous);
        previous = now;
        if (samples.length < 100) requestAnimationFrame(frame);
        else resolve(samples);
      };
      requestAnimationFrame(frame);
    }));
    const sorted = [...intervals].sort((a, b) => a - b);
    const average = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    console.log(`${viewport.width}x${viewport.height}, ${count}: ${intervals.length} frames, average ${average.toFixed(1)} ms, p95 ${p95.toFixed(1)} ms`);
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}
