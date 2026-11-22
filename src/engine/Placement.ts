import type { Ingredient, Placement, Quarter } from './PizzaModel.ts';
import { CHEESE_RADIUS } from './QuarterMath.ts';

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function sampleQuarterArea(quarter: Quarter, radius: number, random: () => number): Placement {
  const distance = Math.sqrt(random()) * radius;
  const angle = (quarter + random()) * Math.PI / 2;
  return { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance };
}

export function fitsQuarter(point: Placement, quarter: Quarter, footprint: number): boolean {
  const margin = footprint + 0.025;
  const x = quarter === 0 || quarter === 3 ? point.x : -point.x;
  const z = quarter === 0 || quarter === 1 ? point.z : -point.z;
  const maxDistance = CHEESE_RADIUS - 0.07 - footprint;
  return x >= margin && z >= margin && Math.hypot(point.x, point.z) <= maxDistance;
}

export function findPlacement(
  quarter: Quarter,
  footprint: number,
  existing: readonly Ingredient[],
  random: () => number = Math.random,
): Placement | null {
  const usableRadius = CHEESE_RADIUS - 0.07 - footprint;
  if (usableRadius <= Math.SQRT2 * (footprint + 0.025)) return null;
  let best: Placement | null = null;
  let leastOverlap = Infinity;
  for (let attempt = 0; attempt < 240; attempt++) {
    const point = sampleQuarterArea(quarter, usableRadius, random);
    if (!fitsQuarter(point, quarter, footprint)) continue;
    let overlap = 0;
    for (const item of existing) {
      const separation = Math.hypot(point.x - item.x, point.z - item.z);
      overlap += Math.max(0, (footprint + item.size) * 0.88 - separation);
    }
    if (overlap < 0.0001) return point;
    if (overlap < leastOverlap) {
      best = point;
      leastOverlap = overlap;
    }
  }
  return best;
}

export function batchPlacements(quarter: Quarter, footprint: number, alternate = false): Placement[] {
  const rings = [{ radius: 0.70, count: 2 }, { radius: 1.12, count: 4 }, { radius: 1.52, count: 6 }];
  const result: Placement[] = [];
  for (const { radius, count } of rings) for (let index = 0; index < count; index++) {
    const fraction = (index + 0.5 + (alternate ? 0.28 : 0)) / count;
    const baseAngle = (quarter + 0.13 + fraction * 0.74) * Math.PI / 2;
    let point: Placement | null = null;
    for (let attempt = 0; attempt < 40; attempt++) {
      const angle = baseAngle + (Math.random() - 0.5) * 0.74 * Math.PI / (2 * count);
      const distance = radius + (Math.random() - 0.5) * 0.34;
      const candidate = { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance };
      if (!fitsQuarter(candidate, quarter, footprint)) continue;
      if (result.some((other) => Math.hypot(candidate.x - other.x, candidate.z - other.z) < footprint * 1.12)) continue;
      point = candidate;
      break;
    }
    if (!point) {
      const angle = baseAngle;
      point = { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
    }
    result.push(point);
  }
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
