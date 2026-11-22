# Spec Delta

## Purpose

Defines the ingredient and editing controls users rely on to build and revise a pizza across screen sizes.

## ADDED Requirements

### Requirement: Pepperoni ingredient control
The builder SHALL offer pepperoni, mushroom, and pineapple as its selectable toppings, with a recognizable visual preview for each. It SHALL NOT offer mozzarella as a selectable topping.

#### Scenario: Choose pepperoni
- **WHEN** a user selects a quarter and activates the pepperoni control
- **THEN** a pepperoni topping is added to that quarter and the pepperoni control shows the active choice

#### Scenario: Available ingredient lineup
- **WHEN** a user views the ingredient controls
- **THEN** pepperoni, mushroom, and pineapple are available and mozzarella is absent

### Requirement: Pepperoni editing behavior
Undo, Clear pizza, and Reset SHALL apply to pepperoni toppings with the same behavior as other toppings.

#### Scenario: Undo pepperoni during a fall
- **WHEN** a user activates Undo while the newest pepperoni is falling
- **THEN** that pepperoni disappears and does not reappear

#### Scenario: Clear a pizza containing pepperoni
- **WHEN** a user activates Clear pizza after adding pepperoni
- **THEN** the pepperoni is removed while the current quarter and ingredient choices remain selected
