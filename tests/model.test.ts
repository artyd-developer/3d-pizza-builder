import assert from 'node:assert/strict';
import test from 'node:test';
import { PizzaModel } from '../src/engine/PizzaModel.ts';

test('model emits only for commands, not mutable animation state', () => {
  const model = new PizzaModel();
  let calls = 0;
  model.subscribe(() => { calls++; });
  assert.equal(calls, 1);
  assert.equal(model.addIngredient('mushroom', { x: 0.4, z: 0.4 }, 0.2, 0), null);
  assert.equal(calls, 2);
  model.selectQuarter(0);
  const item = model.addIngredient('mushroom', { x: 0.4, z: 0.4 }, 0.2, 0);
  assert.ok(item);
  assert.equal(calls, 4);
  item.age += 0.5;
  item.state = 'FALLING';
  assert.equal(calls, 4);
  assert.equal(model.undo()?.id, item.id);
  assert.equal(calls, 5);
  model.reset();
  assert.equal(model.getSnapshot().selectedQuarter, null);
});

test('undo, clear, and reset remove in-flight toppings with distinct selection behavior', () => {
  const model = new PizzaModel();
  model.selectQuarter(0);
  model.addIngredient('pineapple', { x: 0.6, z: 0.6 }, 0.18, 0);
  assert.equal(model.ingredients[0].state, 'SPAWNING');
  model.undo();
  assert.equal(model.ingredients.length, 0);
  model.addIngredient('mushroom', { x: 0.7, z: 0.7 }, 0.22, 0);
  model.clear();
  assert.equal(model.ingredients.length, 0);
  assert.equal(model.selectedQuarter, 0);
  assert.equal(model.selectedIngredient, 'mushroom');
  model.reset();
  assert.equal(model.selectedQuarter, null);
  assert.equal(model.selectedIngredient, null);
});

test('pepperoni selection and editing keep the expected state', () => {
  const model = new PizzaModel();
  model.selectQuarter(2);
  const first = model.addIngredient('pepperoni', { x: -0.5, z: -0.5 }, 0.2, 0);
  assert.ok(first);
  assert.equal(model.getSnapshot().selectedIngredient, 'pepperoni');
  assert.equal(model.undo()?.id, first.id);
  assert.equal(model.ingredients.length, 0);

  model.addIngredient('pepperoni', { x: -0.5, z: -0.5 }, 0.2, 0);
  model.clear();
  assert.equal(model.ingredients.length, 0);
  assert.equal(model.selectedQuarter, 2);
  assert.equal(model.selectedIngredient, 'pepperoni');

  model.addIngredient('pepperoni', { x: -0.5, z: -0.5 }, 0.2, 0);
  model.reset();
  assert.equal(model.ingredients.length, 0);
  assert.equal(model.selectedQuarter, null);
  assert.equal(model.selectedIngredient, null);
});
