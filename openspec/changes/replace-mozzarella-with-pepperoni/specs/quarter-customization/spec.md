# Spec Delta

## Purpose

Defines how users assign and combine ingredient instances within the four contiguous pizza quarters.

## ADDED Requirements

### Requirement: Pepperoni in mixed quarters
A quarter SHALL accept multiple pepperoni, mushroom, and pineapple instances, subject to the same placement bounds and crowding behavior as other toppings.

#### Scenario: Mix the available toppings
- **WHEN** a user adds pepperoni, mushroom, and pineapple to one selected quarter
- **THEN** all three remain visible in that quarter at distinct valid placements

#### Scenario: Pepperoni near a quarter edge
- **WHEN** a pepperoni is placed near the selected quarter boundary
- **THEN** its visible footprint remains inside that quarter and the pizza remains visually contiguous
