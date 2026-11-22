import assert from 'node:assert/strict';
import test from 'node:test';
import { Camera } from '../src/engine/Camera.ts';

test('pizza stays framed and picking shares the camera at common viewports', () => {
  for (const [width, height] of [[900, 650], [700, 600], [360, 520]]) {
    const camera = new Camera();
    camera.resize(width, height);
    for (const [x, z] of [[0, 0], [2.56, 0], [-2.56, 0], [0, 2.56], [0, -2.56]]) {
      const screen = camera.screenPoint(x, 0, z);
      assert.ok(screen.x > 0 && screen.x < width, `${width}x${height}: x=${screen.x}`);
      assert.ok(screen.y > 0 && screen.y < height, `${width}x${height}: y=${screen.y}`);
      const hit = camera.planePoint(screen.x, screen.y);
      assert.ok(hit);
      assert.ok(Math.abs(hit.x - x) < 0.001);
      assert.ok(Math.abs(hit.z - z) < 0.001);
    }
  }
});
