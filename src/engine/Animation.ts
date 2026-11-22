import type { Ingredient } from './PizzaModel.ts';

export const STEP = 1 / 120;

export function updateIngredient(item: Ingredient, dt: number): boolean {
  item.age += dt;
  if (item.state === 'SPAWNING') {
    if (item.age >= 0.08) {
      item.state = 'FALLING';
      item.age = 0;
    }
    return false;
  }
  if (item.state === 'FALLING') {
    item.velocity += 5.8 * dt;
    item.height = Math.max(0, item.height - item.velocity * dt);
    item.rotation += item.spin * dt;
    if (item.height <= 0) {
      item.state = 'LANDING';
      item.height = 0;
      item.age = 0;
      item.impactAge = 0;
      return true;
    }
    return false;
  }
  if (item.state === 'LANDING') {
    const t = item.age;
    item.height = Math.max(0, 0.11 * Math.exp(-7.5 * t) * Math.abs(Math.sin(15 * t)));
    item.rotation += item.spin * Math.exp(-7 * t) * dt * 0.18;
    if (t > 0.68) {
      item.state = 'IDLE';
      item.height = 0;
    }
  }
  return false;
}

export function advanceAnimation(
  items: readonly Ingredient[],
  accumulator: number,
  deltaSeconds: number,
  onImpact: (item: Ingredient) => void = () => {},
  onStep: (dt: number) => void = () => {},
): number {
  accumulator += Math.min(Math.max(deltaSeconds, 0), 0.05);
  let steps = 0;
  while (accumulator >= STEP && steps < 6) {
    for (const item of items) if (updateIngredient(item, STEP)) onImpact(item);
    onStep(STEP);
    accumulator -= STEP;
    steps++;
  }
  return steps === 6 ? Math.min(accumulator, STEP) : accumulator;
}
