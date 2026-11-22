# Spec Delta

## Purpose

Defines the live pizza's baked presentation, quarter-selection feedback, and visible warmth without interfering with construction controls.

## ADDED Requirements

### Requirement: Bright realistic pizza rim
The rendered pizza SHALL show a raised crust rim with a warm golden baked surface, varied toasted areas, and sparse darker char detail. The rim SHALL remain distinct from the cheese and sauce at all supported page sizes.

#### Scenario: Pizza renders before interaction
- **WHEN** a user opens the builder with no selected quarter
- **THEN** the complete pizza, including its raised rim, appears bright and baked without a gray inactive treatment

### Requirement: Non-dimming selection feedback
Selecting a quarter SHALL preserve the normal color and visibility of every pizza quarter. The selected quarter SHALL be identified by a subtle repeating blink that is visible without obscuring cheese, toppings, or the crust.

#### Scenario: Quarter selected
- **WHEN** a user selects a pizza quarter by the canvas or a quarter control
- **THEN** the selected quarter has a repeating visual highlight and the other quarters retain their normal full-color presentation

#### Scenario: Selection cleared
- **WHEN** Reset clears the selected quarter
- **THEN** the selection highlight stops and the complete pizza remains at its normal full-color appearance

### Requirement: Visible warm steam
The pizza SHALL display a gentle, transparent steam effect that rises from above the hot surface. The effect SHALL remain contained near the pizza, be visible against the page, and keep the pizza, toppings, chef hand, and pointer interaction usable.

#### Scenario: Steam across pizza states
- **WHEN** the pizza is idle, a quarter is selected, or toppings are falling
- **THEN** steam continues to rise softly above the pizza without covering the selected-quarter feedback or preventing pizza interaction

### Requirement: Existing construction behavior preserved
The presentation effects SHALL not change quarter picking, ingredient placement, topping animation, local cheese impacts, Undo, Clear pizza, Reset, graphics-context recovery, or the current camera and chef composition.

#### Scenario: Editing while effects render
- **WHEN** a user selects quarters, adds toppings, and uses the editing commands while the rim, selection, and steam effects are visible
- **THEN** each command produces its existing pizza-construction outcome
