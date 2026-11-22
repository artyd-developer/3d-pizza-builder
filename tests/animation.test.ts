import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceAnimation, STEP } from '../src/engine/Animation.ts';
import { CheesePhysics } from '../src/engine/CheesePhysics.ts';

function ingredient() {
  return {
    id: 1, type: 'mushroom' as const, quarter: 0 as const,
    x: 0.5, z: 0.5, rotation: 0, size: 0.2, state: 'SPAWNING' as const,
    age: 0, height: 0.95, velocity: 0, spin: 0.3, impactAge: 0,
  };
}

test('a topping progresses through the full fall and rests', () => {
  const item = ingredient() as import('../src/engine/PizzaModel.ts').Ingredient;
  const seen = new Set<string>();
  let impacts = 0;
  let remainder = 0;
  for (let i = 0; i < 250; i++) {
    seen.add(item.state);
    remainder = advanceAnimation([item], remainder, STEP, () => impacts++);
  }
  assert.deepEqual([...seen], ['SPAWNING', 'FALLING', 'LANDING', 'IDLE']);
  assert.equal(impacts, 1);
  assert.equal(item.state, 'IDLE');
  assert.equal(item.height, 0);
  assert.ok(item.rotation > 0);
});

test('pepperoni landing creates only a local cheese impact', () => {
  const item = { ...ingredient(), type: 'pepperoni' as const } as import('../src/engine/PizzaModel.ts').Ingredient;
  const cheese = new CheesePhysics();
  let impacts = 0;
  let remainder = 0;
  for (let i = 0; i < 250; i++) {
    remainder = advanceAnimation([item], remainder, STEP, (landed) => {
      impacts++;
      cheese.addImpact(landed);
    });
    if (impacts) break;
  }
  assert.equal(impacts, 1);
  assert.equal(item.state, 'LANDING');
  assert.ok(cheese.sample(item.x, item.z) < 0);
  assert.equal(cheese.sample(item.x + 0.6, item.z), 0);
  for (let i = 0; i < 260; i++) {
    remainder = advanceAnimation([item], remainder, STEP);
    cheese.step(STEP);
  }
  assert.equal(item.state, 'IDLE');
  assert.equal(cheese.activeCount, 0);
});

test('landing time and position stay consistent across frame rates', () => {
  function simulate(frameDelta: number) {
    const item = ingredient() as import('../src/engine/PizzaModel.ts').Ingredient;
    let elapsed = 0;
    let landingTime = 0;
    let remainder = 0;
    while (elapsed < 1.8) {
      remainder = advanceAnimation([item], remainder, frameDelta, () => { landingTime = elapsed; });
      elapsed += frameDelta;
    }
    return { landingTime, height: item.height, rotation: item.rotation, state: item.state };
  }
  const fast = simulate(1 / 120);
  const normal = simulate(1 / 60);
  const slow = simulate(1 / 30);
  for (const run of [normal, slow]) {
    assert.ok(Math.abs(run.landingTime - fast.landingTime) < 0.04);
    assert.ok(Math.abs(run.rotation - fast.rotation) < 0.02);
    assert.equal(run.height, 0);
    assert.equal(run.state, 'IDLE');
  }
});
