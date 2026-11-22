# Proposal

## Why

Olives, Jalapeño, and Extra Cheese currently look like ingredient choices but are disabled previews. The builder should let users add Olives and Jalapeño and replace Extra Cheese with Bacon, with the same falling, landing, and local cheese response as the existing three toppings.

## What Changes

- Make Olives and Jalapeño functional ingredient buttons and replace the Extra Cheese tile with a functional Bacon button.
- Add all three types to quarter placement, visible WebGL sprites, selected ingredient state, topping count, status messages, and Undo/Clear/Reset behavior.
- Give each new topping the existing falling animation and a cheese ripple localized around that one landing item; retain the behavior of Pepperoni, Mushroom, and Pineapple.
- Use the newly generated, transparent Olives, Jalapeño, and Bacon icons in the same photorealistic style and 1024×1024 size as the existing ingredient art for both buttons and pizza sprites; add no new animation.

## Capabilities

### New Capabilities

- `pizza-toppings`: Available ingredient choices and their selection, placement, animation, rendering, local impact, and editing behavior.

### Modified Capabilities

None. The main specs inventory has no capabilities yet. This change supersedes the earlier unarchived redesign's statement that these three extra tiles are decorative; the two planning records will need reconciliation before they are archived together.

## Impact

The ingredient list in `src/App.tsx`, `IngredientType` and state in `src/engine/PizzaModel.ts`, placement sizing in `PizzaEngine.ts`, and sprite registration/texture loading in `SpriteRenderer.ts` are affected. Existing animation and cheese physics should be reused. The new `public/ingredients/olives.png`, `jalapeno.png`, and `bacon.png` files supply the artwork. Keep navigation, cart, popular pizza cards, and CTA visual-only. No new external dependency is expected.
