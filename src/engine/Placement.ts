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
