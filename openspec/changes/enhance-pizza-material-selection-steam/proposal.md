# Proposal

## Why

The live pizza does not yet match the warm, bright baked rim shown in the supplied visual reference. Its current quarter selection also darkens the unselected area, making the pizza look muted instead of freshly baked.

## What Changes

- Improve the WebGL crust material so the raised rim has a brighter golden bake, irregular toasted detail, and realistic char accents.
- Keep every pizza quarter at its normal full-color appearance, whether selected or not.
- Identify the selected quarter with a contained, gentle blinking highlight instead of a gray overlay on the remaining pizza.
- Add a subtle, transparent warm-steam effect that rises above the pizza without hiding toppings, the chef hand, or interaction.

## Capabilities

### New Capabilities

- `pizza-presentation-effects`: Visual presentation of the rendered pizza, including crust appearance, selected-quarter feedback, and steam.

### Modified Capabilities

- None.

## Impact

The change affects the pizza geometry/material shaders and renderer in `src/engine/`, with possible small transparent texture or procedural particle additions. It preserves quarter picking, topping placement, cheese impacts, the camera, and the page composition. No new application controls or external services are needed.
