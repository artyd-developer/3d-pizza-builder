import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const candidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const executablePath = candidates.find((candidate) => existsSync(candidate));
if (!executablePath) throw new Error('Set CHROME_PATH to a local Chromium browser for browser verification.');

const server = await createServer({ server: { host: '127.0.0.1', port: 0 } });
await server.listen();
const address = server.httpServer.address();
const url = `http://127.0.0.1:${address.port}/`;
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

try {
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  await page.goto(url);
  await page.locator('canvas').waitFor();
  assert.deepEqual(await page.locator('.ingredient-name').allTextContents(), ['pepperoni', 'mushroom', 'pineapple']);
  assert.equal(await page.getByRole('button', { name: /^mozzarella/i }).count(), 0);
  assert.equal(await page.locator('[role=alert]').count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Undo' }).isDisabled(), true, 'empty undo disabled');
  const support = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');
    return { width: canvas.width, height: canvas.height, gl: !!gl };
  });
  assert.ok(support.gl && support.width > 0 && support.height > 0, 'live WebGL canvas');
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 0.62, y: box.height * 0.62 } });
  await page.getByRole('button', { name: 'mushroom' }).click();
  await page.getByText('1 topping', { exact: true }).waitFor();

  const extension = await page.evaluate(() => {
    const gl = document.querySelector('canvas').getContext('webgl2');
    window.testContext = gl.getExtension('WEBGL_lose_context');
    window.testContext?.loseContext();
    return !!window.testContext;
  });
  assert.ok(extension, 'WEBGL_lose_context extension');
  await page.getByRole('alert').getByText(/Graphics paused/).waitFor();
  await page.evaluate(() => window.testContext.restoreContext());
  await page.getByRole('alert').waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => document.querySelector('canvas').getContext('webgl2').isContextLost()), false);
  await page.getByText('1 topping', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'pineapple' }).click();
  await page.getByText('2 toppings', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Undo' }).click();
  await page.getByText('1 topping', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Clear pizza' }).click();
  await page.getByText('0 toppings', { exact: true }).waitFor();
  await page.locator('.quarter-indicator').getByText('Quarter 1 · Front right').waitFor();
  await page.getByRole('button', { name: 'mushroom' }).click();
  await page.getByText('1 topping', { exact: true }).waitFor();
  await page.waitForTimeout(950);
  await page.getByRole('button', { name: 'Undo' }).click();
  await page.getByText('0 toppings', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'mushroom' }).click();
  await page.getByText('1 topping', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Reset' }).click();
  await page.getByText('0 toppings', { exact: true }).waitFor();
  await page.locator('.quarter-indicator').getByText('No quarter selected').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Undo' }).isDisabled(), true, 'empty undo disabled after reset');
  await page.getByRole('button', { name: 'mushroom' }).click();
  await page.getByText('Select a pizza quarter first.').waitFor();
  for (let quarter = 0; quarter < 4; quarter++) {
    await page.locator('.quarter-button').nth(quarter).click();
    await page.locator('.ingredient-button').nth(quarter % 3).click();
    await page.getByText(`${quarter + 1} ${quarter === 0 ? 'topping' : 'toppings'}`, { exact: true }).waitFor();
    assert.ok((await page.locator('.quarter-indicator').innerText()).includes(`Quarter ${quarter + 1}`));
  }
  await page.setViewportSize({ width: 720, height: 650 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'resized layout has no horizontal scroll');
  assert.ok(await page.locator('canvas').evaluate((element) => element.width > 0 && element.height > 0));

  const unsupported = await browser.newPage();
  await unsupported.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...options) {
      if (kind === 'webgl2') return null;
      return original.call(this, kind, ...options);
    };
  });
  await unsupported.goto(url);
  await unsupported.getByRole('alert').getByText(/WebGL 2.0 is unavailable/).waitFor();

  const missingArt = await browser.newPage({ viewport: { width: 900, height: 700 } });
  await missingArt.route('**/ingredients/pepperoni.png', (route) => route.abort());
  await missingArt.goto(url);
  await missingArt.locator('.ingredient-button').first().locator('.ingredient-preview-fallback').waitFor();
  await missingArt.locator('.quarter-button').first().click();
  await missingArt.getByRole('button', { name: /^pepperoni/i }).click();
  await missingArt.getByText('1 topping', { exact: true }).waitFor();
  assert.equal(await missingArt.locator('[role=alert]').count(), 0, 'fallback texture renders without WebGL error');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await mobile.goto(url);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'no mobile horizontal scroll');
  const mobileCanvas = mobile.locator('canvas');
  const mobileBox = await mobileCanvas.boundingBox();
  await mobileCanvas.tap({ position: { x: mobileBox.width * 0.62, y: mobileBox.height * 0.62 } });
  await mobile.getByText(/Quarter 1 · Front right/).waitFor();
  await mobile.locator('.quarter-button').nth(2).press('Enter');
  await mobile.getByText('Quarter 3 · Back left', { exact: true }).waitFor();
  await mobile.locator('.ingredient-button').nth(2).press('Enter');
  await mobile.getByText('1 topping', { exact: true }).waitFor();
  await mobile.getByRole('button', { name: 'Undo' }).press('Enter');
  await mobile.getByText('0 toppings', { exact: true }).waitFor();
  await mobile.locator('.ingredient-button').nth(1).press('Enter');
  await mobile.getByRole('button', { name: 'Clear pizza' }).press('Enter');
  await mobile.getByText('0 toppings', { exact: true }).waitFor();
  await mobile.locator('.quarter-indicator').getByText('Quarter 3 · Back left').waitFor();
  await mobile.getByRole('button', { name: 'Reset' }).press('Enter');
  await mobile.locator('.quarter-indicator').getByText('No quarter selected').waitFor();
  console.log('Browser smoke passed: WebGL, recovery, editing, mobile touch, keyboard, and unsupported-browser handling.');
} finally {
  await browser.close();
  await server.close();
}
