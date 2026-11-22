# Design

## Context

The current ingredient type is a three-value union in `PizzaModel.ts`. `App.tsx` defines the three controls and preview fallbacks; `SpriteRenderer.ts` maps each type to a texture and generated fallback pixels; `PizzaEngine.ts` chooses footprint size. Browser scripts and README name mozzarella. The baked cheese surface is a separate material. See proposal.md for the motivation and the three spec deltas for behavior.

## Goals / Non-Goals

**Goals:** Keep the change confined to ingredient identity, visuals, and associated checks while reusing existing placement, animation, and local cheese physics.

**Non-Goals:** Add a fourth topping, change the baked-cheese material, change camera framing, or add slice-lifting interaction.

## Decisions

- Replace `mozzarella` with `pepperoni` in the ingredient union and ordered type arrays. Keep the menu at three choices and retain the existing ingredient pipeline. A parallel fourth type would leave the unwanted control available.
- Create a transparent, near-overhead pepperoni slice asset at `public/ingredients/pepperoni.png`, then use it for both the control preview and WebGL sprite. Add a reddish round procedural fallback in `SpriteRenderer.ts` and a matching accessible control fallback. This follows the current asset architecture; a CSS-only disk would not match the food shading of the other sprites.
- Tune pepperoni's footprint for a round slice in `PizzaEngine.ts`, then verify placement stays inside each quarter. The current cheese impact radius and spring response are shared among ingredients; only adjust them if a targeted browser check shows pepperoni requires it.
- Replace mozzarella references in README, screenshot/profile scripts, and relevant tests. Preserve tests of mushroom and pineapple. Add a targeted test for the offered ingredient set and pepperoni placement/landing behavior where existing tests do not cover it.

## Risks / Trade-offs

- [The previous constructor change is complete but unarchived, and main specs are empty] → Keep identical capability paths; before archiving either change, reconcile the baseline constructor specs so they do not retain a conflicting mozzarella requirement. Do not archive the new change ahead of the baseline.
- [Pepperoni art may have an opaque fringe or incorrect apparent scale] → Inspect the alpha channel and compare a desktop and phone render with the other topping sprites.
- [A replaced enum value may leave script or documentation references behind] → Search the repository for `mozzarella`, then run type check, tests, and browser journeys. References to the baked mozzarella-like cheese surface are permissible only where they describe the pizza base, not a selectable ingredient.

## Migration Plan

Ship the new asset and code in one build so the UI never advertises an unavailable ingredient texture. No persisted pizzas or server data currently require migration. Roll back by restoring the previous type, asset, and control mapping together.
