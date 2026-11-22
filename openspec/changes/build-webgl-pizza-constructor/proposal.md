# Proposal

## Why

This project has no application yet. It needs a playable pizza constructor whose food looks substantial from a low, tilted view and whose most satisfying moment is a topping landing on cheese that wobbles locally around the impact.

## What Changes

- Build a responsive pizza constructor with a dynamically rendered, thick-crust pizza viewed from an oblique 2.5D camera. Use the supplied images for crust, cheese, lighting, and camera direction; the chef photos and lifted slice are visual references, not interface elements or interactions.
- Let users select one of four contiguous quarters and add mozzarella, mushroom, or pineapple toppings to that quarter. Create original, recognizable ingredient sprite assets for the app.
- Animate each ingredient falling, making contact, and settling. Its landing deforms a small cheese patch centered on that ingredient; the rest of the pizza remains still. Prioritize this local response over asset photorealism.
- Provide responsive ingredient controls, selection feedback, undo, clear pizza, and reset with working behavior.
- Render the pizza and ingredients with raw WebGL 2.0 and custom GLSL ES 3.00 shaders. Support desktop and mobile browsers with WebGL 2.0, including graceful handling of missing assets and context loss.

## Capabilities

### New Capabilities

- `pizza-scene`: Procedural pizza geometry, materials, lighting, camera, and WebGL runtime behavior.
- `quarter-customization`: Quarter selection and ingredient placement confined to the chosen pizza region.
- `ingredient-landing`: Original ingredient visuals, fall and landing animation, and bounded local cheese deformation.
- `builder-controls`: Responsive controls and reversible editing of the current pizza.

### Modified Capabilities

None; the project has no existing capability specs.

## Impact

This is a new browser application. It will introduce the UI, an independent WebGL 2.0 rendering engine, shaders, generated ingredient assets, interaction and animation logic, and build and verification setup. It will not add slice lifting, cheese strands, a chef character, or a rendering engine dependency.
