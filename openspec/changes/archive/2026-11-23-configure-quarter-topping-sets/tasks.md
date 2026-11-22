# Tasks

## 1. Quarter recipes and batches

- [x] 1.1 Add ordered session recipes and snapshot state for four quarters; verify two-type limits, oldest replacement, duplicate no-op, and independent quarter state through focused command checks without new test files.
- [x] 1.2 Implement exactly 12 evenly distributed pieces per type with footprint-safe batch placement; verify each ingredient in all quarters, two-type coverage, unchanged retained positions, and a maximum of 96 pieces.
- [x] 1.3 Integrate cancellable staggered batch spawning and per-item impact cleanup; verify replacement and clearing during falls leave no obsolete pieces or impacts and landing effects remain local.

## 2. Controls and popular recipes

- [x] 2.1 Derive ingredient pressed/selected styles from the current quarter, remove Undo/Reset, and move renamed Create my bomb to step 01; update README instructions and existing editing journey expectations, then verify keyboard/touch operation and clear semantics.
- [x] 2.2 Enable popular cards with the four specified recipes and rename Cheese to Lava; verify every quarter receives the exact recipe and 12 pieces per type, including replacement of an in-flight pizza and synchronized button states.

## 3. Startup readiness

- [x] 3.1 Expose settled image/texture readiness with fallback handling and guarded initialization; verify delayed/failed resources, effect reruns, and context restoration do not cause duplicate randomization or overwrite user choices.
- [x] 3.2 Initialize one or two distinct random types per quarter once per page load; update existing browser/capture/profile setup for random startup and new controls, document session-only behavior, and verify reloads reinitialize while quarter switching preserves configuration.

## 4. Integrated behavior

- [x] 4.1 Run build and updated existing browser verification plus focused maximum-pizza desktop/mobile performance inspection; verify all recipes, replacement, readiness, clear cancellation, and context recovery with camera, protected CSS, steam, and crust unchanged.

## Workflow follow-up

- Reconcile the superseded one-item-per-click, Undo/Reset, and decorative popular-card requirements in earlier unarchived changes before archiving them together.
