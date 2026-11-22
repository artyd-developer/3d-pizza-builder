# Tasks

## 1. Ingredient identity and controls

- [x] 1.1 Replace mozzarella with pepperoni in the ingredient type, ordered controls, descriptions, UI fallback, and size mapping; verify type checking and a browser check show exactly pepperoni, mushroom, and pineapple.
- [x] 1.2 Add a focused model/control check for pepperoni selection, Undo during fall, Clear pizza, and Reset; verify those checks pass with the existing editing tests.

## 2. Pepperoni art and landing

- [x] 2.1 Create `public/ingredients/pepperoni.png` with transparent edges and readable baked-pepperoni shading; verify its alpha and inspect the control preview and on-pizza rendering at desktop and phone widths.
- [x] 2.2 Replace the mozzarella sprite mapping with pepperoni and add a recognizable procedural fallback; verify a failed image load still shows a usable pepperoni topping and preview.
- [x] 2.3 Verify pepperoni stays fully inside each selected quarter, falls and settles, and disturbs only nearby cheese; add or adjust a targeted placement/landing check and confirm it passes.

## 3. Documentation and integration

- [x] 3.1 Update README and browser screenshot/profile scripts to use pepperoni; verify the documented controls and all script ingredient names match the app.
- [x] 3.2 Run the production build, automated tests, and desktop/mobile browser journey; inspect screenshots for pepperoni scale, alpha, shadows, and local cheese motion, and verify no selectable mozzarella references remain.

## Workflow follow-up

- Reconcile the completed constructor change's mozzarella wording with the new ingredient lineup before archiving the two changes in order.
