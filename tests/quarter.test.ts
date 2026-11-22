import assert from 'node:assert/strict';
import test from 'node:test';
import { Camera } from '../src/engine/Camera.ts';
import { pickQuarter, quarterAt } from '../src/engine/QuarterMath.ts';

test('quarter geometry handles centers, sector boundaries, and outside points', () => {
  assert.deepEqual([[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([x, z]) => quarterAt(x, z)), [0, 1, 2, 3]);
  assert.equal(quarterAt(0.001, 1), 0);
  assert.equal(quarterAt(-0.001, 1), 1);
  assert.equal(quarterAt(3, 0), null);
});

test('ray picking agrees with rendered positions across viewports', () => {
  for (const [width, height] of [[900, 650], [700, 600], [360, 520]]) {
    const camera = new Camera();
    camera.resize(width, height);
    for (const [quarter, x, z] of [[0, 1, 1], [1, -1, 1], [2, -1, -1], [3, 1, -1]]) {
      const point = camera.screenPoint(x, 0, z);
      assert.equal(pickQuarter(camera, point.x, point.y), quarter);
    }
    const outside = camera.screenPoint(3, 0, 0);
    assert.equal(pickQuarter(camera, outside.x, outside.y), null);
  }
});
