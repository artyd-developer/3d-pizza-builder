import assert from 'node:assert/strict';
import test from 'node:test';
import { CheesePhysics } from '../src/engine/CheesePhysics.ts';
import { STEP } from '../src/engine/Animation.ts';
import type { Ingredient } from '../src/engine/PizzaModel.ts';

function item(id: number, x: number, z: number): Ingredient {
  return { id, x, z, type: 'mushroom', quarter: 0, rotation: 0, size: 0.2,
    state: 'LANDING', age: 0, height: 0, velocity: 0, spin: 0, impactAge: 0 };
}

test('impact dips locally, remains bounded, and settles', () => {
  const cheese = new CheesePhysics();
  cheese.addImpact(item(1, 0.7, 0.7));
  assert.ok(cheese.sample(0.7, 0.7) < -0.02);
  assert.equal(cheese.sample(1.3, 0.7), 0);
  assert.equal(cheese.sample(-0.7, -0.7), 0);
  for (let i = 0; i < 260; i++) cheese.step(STEP);
  assert.equal(cheese.activeCount, 0);
  assert.equal(cheese.sample(0.7, 0.7), 0);
});

test('separate impacts remain local and can be cancelled independently', () => {
  const cheese = new CheesePhysics();
  cheese.addImpact(item(1, 0.7, 0.7));
  cheese.addImpact(item(2, -0.7, -0.7));
  assert.equal(cheese.activeCount, 2);
  assert.ok(cheese.sample(-0.7, -0.7) < 0);
  cheese.removeImpact(1);
  assert.equal(cheese.sample(0.7, 0.7), 0);
  assert.ok(cheese.sample(-0.7, -0.7) < 0);
  cheese.clear();
  assert.equal(cheese.activeCount, 0);
});
