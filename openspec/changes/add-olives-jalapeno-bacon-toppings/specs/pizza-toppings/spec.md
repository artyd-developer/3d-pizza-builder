# Spec Delta

## Purpose

Defines which toppings a user can add to a selected pizza quarter and how each topping appears, lands, affects nearby cheese, and responds to editing commands.

## ADDED Requirements

### Requirement: Six functional topping choices
The builder SHALL offer Pepperoni, Mushroom, Pineapple, Olives, Jalapeño, and Bacon as functional ingredient choices. Bacon SHALL replace the former Extra Cheese preview in the ingredient row.

#### Scenario: New ingredient buttons
- **WHEN** a user views the ingredient row
- **THEN** Olives, Jalapeño, and Bacon are enabled choices alongside the original three toppings, and Extra Cheese is absent from that row

#### Scenario: Selected quarter receives a new topping
- **WHEN** a user selects a quarter and activates Olives, Jalapeño, or Bacon
- **THEN** one corresponding topping is added within that quarter, the topping count increases by one, and the selected ingredient and status message identify that type

#### Scenario: No quarter selected
- **WHEN** a user activates any of the six toppings before selecting a quarter
- **THEN** no topping is added and the existing quarter-selection guidance appears

### Requirement: New toppings share existing landing behavior
Olives, Jalapeño, and Bacon SHALL be visible on the live pizza and use the same falling, landing, and settling lifecycle as existing toppings.

#### Scenario: A new topping lands
- **WHEN** an Olive, Jalapeño, or Bacon piece falls onto the selected quarter
- **THEN** its visible sprite settles at its placement and the cheese dips and ripples only near that single landing piece before returning to rest

#### Scenario: Multiple impacts
- **WHEN** new toppings land at separate positions or times
- **THEN** each impact remains local to its own landing piece without a pizza-wide ripple

### Requirement: Editing applies to all topping types
Undo, Clear pizza, and Reset SHALL handle the three new types with the existing selection and history semantics.

#### Scenario: Undo and clearing
- **WHEN** a user adds a new topping and uses Undo, Clear pizza, or Reset, including while it is falling or settling
- **THEN** the affected piece and its active impact are removed as they are for existing toppings, and the command retains its current quarter-selection behavior

### Requirement: Artwork remains identifiable
Olives, Jalapeño, and Bacon SHALL each use recognizable transparent ingredient artwork in their button preview and rendered pizza piece.

#### Scenario: Ingredient artwork loads
- **WHEN** the ingredient row and pizza render with the new types
- **THEN** the user can distinguish Olives, Jalapeño, and Bacon from one another and from the original toppings
