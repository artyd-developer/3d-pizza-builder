# Proposal

## Why

The builder currently offers mozzarella as a selectable topping. The requested ingredient lineup is pepperoni, mushroom, and pineapple, while the baked cheese surface remains part of the pizza itself.

## What Changes

- **BREAKING**: Replace the selectable mozzarella topping with pepperoni in the builder and engine ingredient type.
- Add an original transparent pepperoni visual, matching control preview, and recognizable fallback when its image cannot load.
- Preserve quarter placement, falling animation, localized cheese response, and editing behavior for pepperoni.
- Update documentation and browser checks that use the old topping name. Keep mushroom and pineapple available.

## Capabilities

### New Capabilities

- `builder-controls`: Ingredient choices and their active feedback include pepperoni in place of mozzarella.
- `ingredient-landing`: Pepperoni has a recognizable visual and uses the existing landing and local cheese response.
- `quarter-customization`: Mixed toppings in a quarter can include pepperoni, mushroom, and pineapple.

### Modified Capabilities

None. The project has no main specs yet; these capability paths match the completed, unarchived constructor change and should remain aligned when that change is archived or synced.

## Impact

The ingredient union and size selection, sprite loading/fallback, React controls, README, and browser capture/profile scripts change. The cheese base material, physics model, camera, and four-quarter interaction remain the same. Existing code that names `mozzarella` as an `IngredientType` will need to use `pepperoni`.
