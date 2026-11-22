# Tasks

## 1. Application foundation

- [x] 1.1 Scaffold the TypeScript/React application and build scripts with no rendering-engine dependency; verify the dev server starts and the production build succeeds.
- [x] 1.2 Create a framework-independent engine API and CPU scene state for selection, ingredients, and commands; verify React receives state updates only for discrete actions, not every animation frame.
- [x] 1.3 Document the run/build commands, supported WebGL 2.0 browsers, and basic controls in a README; verify each documented command works.

## 2. WebGL pizza scene

- [x] 2.1 Implement WebGL 2.0 initialization, shader compilation/link diagnostics, reusable resources, and a render loop; verify a live test mesh renders and a forced shader error produces a readable message.
- [x] 2.2 Implement the shared tilted camera, projection, resize handling, and capped pixel ratio; verify the complete pizza framing and stable coordinates at desktop, tablet, and phone viewport sizes.
- [x] 2.3 Generate the bottom dough, inner surface, sauce, deformable cheese mesh, and irregular thick crust; verify an oblique browser render shows crust volume and no quarter gaps or layer clipping.
- [x] 2.4 Add custom dough, crust, sauce, and cheese material shaders with baked variation and warm lighting; verify browser screenshots show distinct non-flat food surfaces from the requested camera angle.
- [x] 2.5 Handle unsupported WebGL and context loss/restoration while retaining CPU scene state; verify the unsupported message appears and a restored context redraws the same pizza configuration.

## 3. Quarter interaction and placement

- [x] 3.1 Implement ray-to-pizza picking for four 90-degree sectors; verify automated geometry checks for sector centers, boundaries, outside clicks, and resized viewports.
- [x] 3.2 Add selected-quarter feedback without splitting geometry; verify clicking each quarter updates only its highlight and leaves the pizza visually contiguous.
- [x] 3.3 Implement area-uniform candidate sampling with footprint, crust-margin, and overlap checks plus a finite full-quarter outcome; verify seeded tests keep every resting sprite inside its chosen sector and produce varied positions.
- [x] 3.4 Connect ingredient commands to the selected quarter and the no-selection prompt; verify a click adds exactly one ingredient when selected and none otherwise.

## 4. Ingredient artwork and animation

- [x] 4.1 Create original transparent mozzarella, mushroom, and pineapple sprite assets with consistent lighting; verify each is recognizable at control-preview and on-pizza sizes and no supplied stock photo is embedded.
- [x] 4.2 Implement texture loading, transparent sprite and shadow rendering, batching where useful, and a missing-asset fallback; verify mixed toppings render with correct transparency and remain visible when one texture is deliberately unavailable.
- [x] 4.3 Implement spawning, falling, landing, and idle states with slight rotation, acceleration, shadow changes, and a small bounce; verify a drop passes through all states and reaches a stable final position.
- [x] 4.4 Use delta time with bounded simulation steps for ingredient motion; verify timing tests at different frame intervals produce approximately equal landing times and positions.

## 5. Local cheese response

- [x] 5.1 Implement the temporary damped spring patch created at each impact; verify tests show an initial dip, decay to rest, zero deformation beyond the patch radius, and independent responses for separated impacts.
- [x] 5.2 Apply active patches to cheese geometry and normals and make landing ingredients follow the sampled surface height; verify a browser capture shows only the area near each topping wobbling while its sprite and shadow remain aligned.
- [x] 5.3 Cancel affected patches on undo, clear, and reset, and retire settled patches; verify interrupted drops never reappear and no residual cheese motion remains after clearing.
- [x] 5.4 Profile several simultaneous drops on desktop and mobile, tune mesh/patch resolution and draw batching, and verify smooth interaction without whole-pizza deformation.

## 6. Builder controls and layout

- [x] 6.1 Build responsive ingredient buttons using the actual sprite previews, a selected-quarter indicator, and clear active states; verify mouse, touch, and keyboard use at desktop and narrow phone widths without horizontal scrolling.
- [x] 6.2 Implement Undo, Clear pizza, and Reset with their distinct state behavior; verify UI-level checks for landed and in-flight ingredients, empty Undo, preserved selections after Clear, and fresh-state Reset.
- [x] 6.3 Add accessible control labels and visible focus styles and document the three editing actions; verify keyboard-only operation and that the README matches the UI behavior.

## 7. Cross-feature verification

- [x] 7.1 Run a full desktop and mobile browser journey: select each quarter, add mixed toppings, observe local landing motion, undo, clear, reset, resize, and restore context; verify the behavior against all four capability specs and fix integration defects.
- [x] 7.2 Run the production build and all project tests, inspect final desktop and phone screenshots against the supplied pizza-view direction, and verify no rendering-engine dependency or static pizza image has entered the app.
