# Spec Delta

## Purpose

Defines how individual toppings look, fall, and settle on the cheese so each selected ingredient is recognizable and responsive.

## ADDED Requirements

### Requirement: Recognizable pepperoni topping
Pepperoni SHALL appear as a distinct round, red baked-meat slice with transparent edges, depth shading, and a soft contact shadow. A recognizable fallback SHALL appear if its image cannot load.

#### Scenario: Pepperoni asset loads
- **WHEN** a user views the pepperoni preview or a placed pepperoni
- **THEN** it is visually distinguishable from mushroom and pineapple

#### Scenario: Pepperoni asset fails
- **WHEN** the pepperoni image cannot load
- **THEN** the topping remains selectable and visible through a recognizable fallback

### Requirement: Pepperoni landing response
A pepperoni topping SHALL fall, make a small settling bounce, and trigger a brief cheese indentation and damped ripple confined to its landing neighborhood.

#### Scenario: Pepperoni contacts the cheese
- **WHEN** a falling pepperoni touches the cheese
- **THEN** only the cheese near that pepperoni moves, and the topping and shadow settle with the local surface
