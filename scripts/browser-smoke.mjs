import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const candidates = [process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const executablePath = candidates.find((candidate) => existsSync(candidate));
if (!executablePath) throw new Error('Set CHROME_PATH to a Chromium browser.');
const server = await createServer({ server: { host: '127.0.0.1', port: 0 } });
await server.listen();
const browser = await chromium.launch({ executablePath, headless: true,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
try {
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  await page.goto(url);
  await page.waitForFunction(() => !document.querySelector('.edit-grid button').disabled);
  assert.equal(await page.locator('.count-pill, .quarter-indicator, .status-line').count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Undo' }).count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Reset', exact: true }).count(), 0);
  await page.getByRole('button', { name: 'Create my bomb' }).click();
  await page.locator('.quarter-button').first().click();
  for (const name of ['pepperoni', 'mushroom', 'bacon']) {
    await page.locator('.ingredient-button').filter({ hasText: new RegExp(`^${name}`, 'i') }).click();
  }
  assert.equal(await page.locator('.ingredient-button').first().getAttribute('aria-pressed'), 'false');
  assert.equal(await page.locator('.ingredient-button').nth(1).getAttribute('aria-pressed'), 'true');
  await page.locator('.ingredient-button').nth(5).click();
  await page.getByRole('button', { name: /Lava pizza preset/i }).click();
  for (let quarter = 0; quarter < 4; quarter++) {
    await page.locator('.quarter-button').nth(quarter).click();
    assert.equal(await page.getByRole('button', { name: /^pineapple/i }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.getByRole('button', { name: /^jalapeño/i }).getAttribute('aria-pressed'), 'true');
  }
  const extension = await page.evaluate(() => {
    window.contextExtension = document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context');
    window.contextExtension?.loseContext(); return !!window.contextExtension;
  });
  assert.ok(extension);
  await page.getByRole('alert').waitFor();
  await page.evaluate(() => window.contextExtension.restoreContext());
  await page.getByRole('alert').waitFor({ state: 'hidden' });
  assert.equal(await page.getByRole('button', { name: /^pineapple/i }).getAttribute('aria-pressed'), 'true');
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await mobile.goto(url);
  await mobile.waitForFunction(() => !document.querySelector('.edit-grid button').disabled);
  await mobile.getByRole('button', { name: 'Create my bomb' }).tap();
  await mobile.locator('.quarter-button').nth(2).tap();
  await mobile.getByRole('button', { name: /^olives/i }).tap();
  assert.equal(await mobile.getByRole('button', { name: /^olives/i }).getAttribute('aria-pressed'), 'true');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const missingArt = await browser.newPage();
  await missingArt.route('**/ingredients/bacon.png', (route) => route.abort());
  await missingArt.goto(url);
  await missingArt.waitForFunction(() => !document.querySelector('.edit-grid button').disabled);
  assert.equal(await missingArt.locator('[role=alert]').count(), 0);
  await missingArt.reload();
  await missingArt.waitForFunction(() => !document.querySelector('.edit-grid button').disabled);
  assert.equal(await missingArt.locator('[role=alert]').count(), 0);
  console.log('Browser smoke passed: startup, batches, replacement, presets, editing, context recovery, mobile touch.');
} finally { await browser.close(); await server.close(); }
