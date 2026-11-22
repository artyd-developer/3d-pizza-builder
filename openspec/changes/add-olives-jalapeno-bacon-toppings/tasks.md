# Tasks

## 1. Ingredient state and placement

- [x] 1.1 Extend the ingredient type and placement sizing to Olives, Jalapeño, and Bacon while reusing the current model and fall lifecycle; verify each can be placed within every selected quarter, increments the count once, and gives the existing no-quarter/full-quarter guidance when appropriate.
- [x] 1.2 Confirm Undo, Clear pizza, and Reset remove new pieces and their in-flight or active local cheese impacts with the same selection semantics as the original toppings; verify through the existing editing journey and focused manual checks without adding new test cases.

## 2. Sprite and preview artwork

- [x] 2.1 Register the three new types with `public/ingredients/olives.png`, `jalapeno.png`, and `bacon.png` as transparent WebGL sprites, retaining missing-image fallbacks; verify each appears during falling and after landing, with no white card rectangle and no missing texture after WebGL context restoration.
- [x] 2.2 Use those same generated PNGs as the three button previews; verify all six buttons display distinct ingredient artwork at desktop and mobile widths.

## 3. Functional ingredient controls

- [x] 3.1 Replace the three disabled extra-topping tiles with enabled Olives, Jalapeño, and Bacon ingredient buttons connected to the existing handler and selected-state styles; verify Extra Cheese is absent, each new click changes the selected ingredient and count, and unrelated visual-only controls remain inert.
- [x] 3.2 Verify each new landing produces only its own nearby cheese ripple, including two separate impacts, while the original three toppings and current camera/chef layout behave as before using focused browser inspection and existing commands. Do not add animations or a broad final verification task.

## Workflow follow-up

- Before archiving this change alongside `redesign-pizzabomb-builder-page`, reconcile that earlier change's decorative extra-topping requirement with the now-functional tiles.
