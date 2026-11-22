# quarter-topping-configuration Specification

## Purpose

Defines consistent quarter recipes shared by manual ingredient selection, popular-pizza presets, and random startup configuration.

## Requirements

### Requirement: Bounded session configuration
Each quarter SHALL retain an ordered set of zero to two distinct topping types during the current page session. Choosing a third type SHALL replace the oldest type on that quarter only. Choosing an existing type SHALL leave its pieces, positions, animation, and insertion order unchanged.

#### Scenario: Replace oldest selection
- **WHEN** Pepperoni then Mushroom are chosen for a quarter and Bacon is chosen next
- **THEN** Pepperoni pieces and their active impacts are removed, Mushroom stays in place, and Bacon becomes the newest choice

#### Scenario: Repeat a choice
- **WHEN** a user activates an ingredient already configured for the selected quarter
- **THEN** no pieces are added, removed, moved, or restarted and replacement order stays unchanged

### Requirement: Twelve distributed pieces per type
Each configured topping type SHALL have exactly 12 pieces distributed evenly across its quarter's usable cheese surface. A quarter SHALL have at most 24 pieces. New pieces SHALL use the existing falling and local landing response.

#### Scenario: Add a batch
- **WHEN** a user chooses a new topping for a selected quarter
- **THEN** 12 pieces cover the quarter without leaving it, with no concentrated pile or systematic empty region, and retained pieces in that quarter and all other quarters stay in place

### Requirement: Controls reflect the current quarter
Ingredient buttons SHALL display selected states for all types configured on the current quarter, including accessible pressed state. Without a selected quarter, manual ingredient activation SHALL add nothing and provide selection guidance.

#### Scenario: Switch quarters
- **WHEN** a user switches between quarters with different recipes
- **THEN** the ingredient button states reflect the newly selected quarter's saved choices without changing either recipe

### Requirement: Start custom pizza
The controls SHALL show Create my bomb as step 01, quarter selection as step 02, and ingredients as step 03. Undo, Reset, and the Clear pizza label SHALL be removed. Create my bomb SHALL clear all recipes, pieces, and impacts while retaining the currently selected quarter.

#### Scenario: Clear during falling
- **WHEN** Create my bomb is activated while toppings are falling
- **THEN** the pizza becomes a bare cheese base with no queued pieces or impacts returning, and all ingredient buttons become unselected

### Requirement: Popular recipe presets
Popular cards SHALL apply the same recipe to every quarter: Supreme = Pepperoni and Mushroom; Meat Lover's = Pepperoni and Bacon; Lava = Pineapple and Jalapeño; Pepperoni = Pepperoni. Lava SHALL replace the Cheese card label.

#### Scenario: Apply preset
- **WHEN** a popular card is clicked, tapped, or keyboard-activated
- **THEN** previous recipes, pieces, and impacts are replaced across all four quarters with 12 pieces per preset type per quarter, and selected ingredient states reflect the result

### Requirement: Random startup after readiness
Each page load SHALL initialize the pizza once with one or two distinct random topping types per quarter after required page images and renderer textures are ready. Configuration SHALL remain in memory only. Failed images SHALL resolve through existing fallbacks rather than block initialization indefinitely.

#### Scenario: Slow images and recovery
- **WHEN** image loading is delayed and subsequently completes or falls back
- **THEN** a single random pizza is generated, subsequent renders and graphics-context recovery preserve it, and a reload generates a fresh random configuration

### Requirement: Presentation preserved
Configuration changes SHALL preserve camera angle and distance, pizza geometry, pizza-window and chef-hand positioning, crust appearance, white steam, and local rather than pizza-wide landing effects.

#### Scenario: Maximum configuration
- **WHEN** all four quarters contain two topping types
- **THEN** all 96 pieces render with responsive controls and the existing pizza/chef composition
