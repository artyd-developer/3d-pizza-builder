# Design

## Context

See `proposal.md` for motivation and `specs/pizza-toppings/spec.md` for observable behavior. `App.tsx` currently renders the last three tiles as disabled `VisualButton`s. `PizzaModel` accepts only three ingredient types; `PizzaEngine` chooses a footprint; `SpriteRenderer` registers three textures; `Animation` and `CheesePhysics` already operate on generic ingredient objects. Three new transparent 1024×1024 PNGs now exist under `public/ingredients/`, matching the existing ingredient art style.

## Goals / Non-Goals

**Goals:** Make all six ingredient buttons behave uniformly while keeping each landing's cheese response local. Keep artwork clear at small pizza sprite sizes and preserve current editing semantics.

**Non-Goals:** Change the camera, chef composition, page layout, navigation, ordering flow, pizza geometry, global animation constants, or cheese simulation. No new animation or external image download.

## Decisions

### One ingredient path for all six choices

Extend the `IngredientType` union, ingredient list, labels, and the three existing disabled tiles so they use the same enabled button structure and `addIngredient(type)` handler. Use per-type footprint sizes in `PizzaEngine` to preserve quarter fitting. Leave `PizzaModel` history, counts, and messages generic, and leave the shared `advanceAnimation` and `CheesePhysics.addImpact` path intact. This avoids separate special-case animation code for the new types.

### Artwork for UI and WebGL

Use `public/ingredients/olives.png`, `jalapeno.png`, and `bacon.png` for both button previews and WebGL textures. They are newly generated photorealistic cutouts, resized to 1024×1024, with alpha channels and transparent backgrounds. This matches the existing `/ingredients/<type>.png` loading convention and avoids the white card backgrounds of the earlier brand crops. Keep a small generated fallback texture for missing-image recovery, and keep texture registration, context restoration, and cleanup consistent with the existing three toppings.

### Retain the local cheese effect

The existing per-item `CheesePhysics` patch uses each item's position and size and is triggered once on landing. New ingredient sizes should yield a localized patch rather than changing global ripple parameters. Undo removes the last item's impact; Clear and Reset clear all patches. Verify this behavior for each new type and for separate impacts.

### Previous planning conflict

The unarchived `redesign-pizzabomb-builder-page` spec says the extra topping tiles remain decorative. This newer request supersedes that sentence only for the three ingredient tiles. Reconcile those planning artifacts before archiving both changes; header, popular-pizza, cart, menu, and CTA controls remain visual-only.

## Risks / Trade-offs

- [White boxes or halos appear on the pizza] → Load the new transparent ingredient PNGs and inspect their alpha edges on the pizza.
- [Artwork differs between button and pizza] → Use the same PNG path for both views.
- [New types are added to the UI but not WebGL registration] → Check each type through button activation, visible fall, landing, and context restoration.
- [Large footprints reduce placement availability] → Keep footprint values near the current ingredients and check all quarters with a mixed pizza.
- [Earlier OpenSpec delta conflicts at archive] → Reconcile its decorative-control statement before archive; do not silently archive contradictory specs.

## Migration Plan

Expand the ingredient union and renderer registration, replace the three disabled tiles with working controls, then verify the existing editing journey and the three new landing visuals. No saved pizza data or external API migration is needed. Rollback removes the three added types and restores the decorative tiles; any already open page state resets on reload.
