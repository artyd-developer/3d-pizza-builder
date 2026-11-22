# Spec Delta

## Purpose

Defines the responsive PizzaBomb presentation that integrates supplied brand artwork with the live pizza constructor while preserving builder usability.

## ADDED Requirements

### Requirement: Layered chef and live pizza hero
The page SHALL present the supplied chef artwork below the transparent live pizza scene and the supplied right-hand artwork above the pizza. The hand SHALL remain aligned with the chef's arm and overlap the pizza at its original apparent position.

#### Scenario: Desktop hero renders
- **WHEN** a user opens the page on a desktop viewport with WebGL 2.0 available
- **THEN** the chef appears to hold the live interactive pizza and the foreground hand visibly covers the correct part of the pizza without blocking the usable pizza center

#### Scenario: Hero scales responsively
- **WHEN** the hero changes size between supported viewport widths
- **THEN** the chef, pizza, and hand preserve their relative alignment and remain fully contained without horizontal page scrolling

### Requirement: Branded desktop composition
On desktop, the page SHALL show the compact header logo, full template navigation, account/cart presentation, large hero logo, popular-pizza cards, live chef/pizza hero, builder controls, and red call-to-action in the supplied template's visual hierarchy.

#### Scenario: Desktop layout
- **WHEN** the viewport is at least 1040 CSS pixels wide
- **THEN** the chef/live pizza occupies the left feature area and the large logo, popular pizzas, and builder content occupy the right area under the full header navigation

### Requirement: Builder-first mobile composition
On mobile, the page SHALL replace the desktop navigation and large hero logo with a compact logo and hamburger, then order the main content as chef/live pizza, functional builder controls, and popular-pizza cards.

#### Scenario: Narrow mobile layout
- **WHEN** the viewport is 620 CSS pixels wide or narrower
- **THEN** the hero is the first main feature, the builder follows immediately, popular pizzas follow the builder, and no desktop navigation or large hero logo is visible

#### Scenario: Mobile interaction
- **WHEN** a touch or keyboard user operates the builder on a narrow viewport
- **THEN** quarter selection, the three existing toppings, Undo, Clear pizza, and Reset remain reachable and behave as before

### Requirement: Decorative template controls
New navigation, account, cart, popular-pizza, extra-topping, hamburger, pizza-menu, and call-to-action controls SHALL be visibly presented where applicable but SHALL NOT navigate, open content, add toppings, or alter builder state.

#### Scenario: Decorative control activated
- **WHEN** a user clicks, taps, or keyboard-activates a newly added template control
- **THEN** the URL, pizza configuration, selected quarter, selected ingredient, and topping count remain unchanged

#### Scenario: Functional controls remain distinct
- **WHEN** a user views the builder controls
- **THEN** pepperoni, mushroom, pineapple, quarter selection, Undo, Clear pizza, and Reset are identifiable as the controls that operate the pizza

### Requirement: Supplied artwork only
The redesign SHALL use only the supplied chef, hand, logo, and template images, existing project artwork, and image crops derived from those supplied files.

#### Scenario: Asset inventory reviewed
- **WHEN** the redesign assets are inspected
- **THEN** each new raster asset is either a supplied file copied into the project or a documented crop from the supplied template, with no newly generated artwork

### Requirement: Existing live builder preserved
The redesigned page SHALL retain the current transparent WebGL pizza, quarter picking, topping animation, local cheese response, editing commands, unsupported-browser message, and graphics-context recovery.

#### Scenario: Complete builder journey after redesign
- **WHEN** a user selects every quarter, adds existing toppings, uses Undo, Clear pizza, and Reset, and restores a lost graphics context
- **THEN** the same builder outcomes occur within the new branded layout
