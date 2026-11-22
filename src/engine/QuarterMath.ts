import type { Camera } from './Camera.ts';
import type { Quarter } from './PizzaModel.ts';

export const PIZZA_RADIUS = 2.56;
export const CHEESE_RADIUS = 2.025;

export function quarterAt(x: number, z: number): Quarter | null {
  if (x * x + z * z > PIZZA_RADIUS * PIZZA_RADIUS) return null;
  let angle = Math.atan2(z, x);
  if (angle < 0) angle += Math.PI * 2;
  return Math.min(3, Math.floor(angle / (Math.PI / 2))) as Quarter;
}

export function pickQuarter(camera: Camera, x: number, y: number): Quarter | null {
  const hit = camera.planePoint(x, y);
  return hit ? quarterAt(hit.x, hit.z) : null;
}
