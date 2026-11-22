import assert from 'node:assert/strict';
import test from 'node:test';
import { findPlacement, fitsQuarter, sampleQuarterArea, seededRandom } from '../src/engine/Placement.ts';

test('area sampling uses the square-root radial transform', () => {
  const random = seededRandom(42);
  let sum = 0;
  for (let i = 0; i < 10000; i++) {
    const point = sampleQuarterArea(0, 1, random);
    sum += Math.hypot(point.x, point.z);
  }
  assert.ok(Math.abs(sum / 10000 - 2 / 3) < 0.02);
});

test('seeded placement stays in each quarter with varied positions', () => {
  for (const quarter of [0, 1, 2, 3] as const) {
    const random = seededRandom(quarter + 8);
    const points = [];
    for (let i = 0; i < 25; i++) {
      const placement = findPlacement(quarter, 0.19, [], random);
      assert.ok(placement);
      assert.ok(fitsQuarter(placement, quarter, 0.19));
      points.push(`${placement.x.toFixed(3)},${placement.z.toFixed(3)}`);
    }
    assert.ok(new Set(points).size > 20);
  }
  assert.equal(findPlacement(0, 2, [], seededRandom(1)), null);
});

test('round pepperoni footprint stays inside every quarter', () => {
  for (const quarter of [0, 1, 2, 3] as const) {
    const random = seededRandom(100 + quarter);
    for (let i = 0; i < 30; i++) {
      const placement = findPlacement(quarter, 0.2 * 1.35, [], random);
      assert.ok(placement);
      assert.ok(fitsQuarter(placement, quarter, 0.2 * 1.35));
    }
  }
});
