# Proposal

## Why

Users need to configure each quarter as a coherent topping combination rather than repeatedly place individual items. Presets and a random starting pizza should use the same configuration rules as manual choices.

## What Changes

- Store an ordered selection of at most two topping types per quarter for the current page session. Replace the oldest type when a third is chosen; selecting an existing type is a no-op.
- Add 12 evenly distributed pieces per chosen type and show all selected types on the current quarter's ingredient buttons.
- Remove Undo and Reset; move Clear pizza to step 01 and rename it Create my bomb. Quarter selection becomes step 02 and ingredients step 03.
- Enable popular-pizza cards to replace every quarter with a recipe: Supreme = Pepperoni/Mushroom; Meat Lover's = Pepperoni/Bacon; Lava = Pineapple/Jalapeño; Pepperoni = Pepperoni. Rename the Cheese card to Lava.
- Generate a fresh random configuration once on each page load after image resources are ready.

## Capabilities

### New Capabilities

- `quarter-topping-configuration`: Session configuration, bounded topping batches, preset recipes, startup randomization, and controls for quarter recipes.

### Modified Capabilities

None; the main spec inventory is empty. This change supersedes earlier unarchived one-item-per-click and Undo/Reset requirements, and the decorative popular-card requirement.

## Impact

Changes involve App controls, PizzaModel, PizzaEngine, Placement, image readiness in the renderers, and existing verification scripts/documentation. Preserve camera, geometry, pizza-window/chef-hand classes, white steam, crust, and per-item falling/local cheese behavior. No storage service, localStorage persistence, new images, or external dependency is required.
