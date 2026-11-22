# Spec Delta

## Purpose

Defines how users select one of four pizza quarters and place ingredients within its usable area without breaking the whole-pizza presentation.

## ADDED Requirements

### Requirement: Four selectable quarters
The pizza SHALL have four equal 90-degree selectable regions, and pointer or touch input on the pizza SHALL select the region beneath the contact point.

#### Scenario: Select a quarter
- **WHEN** a user taps or clicks inside one pizza quarter
- **THEN** that quarter becomes selected and the interface identifies it

#### Scenario: Contact outside the pizza
- **WHEN** a user taps or clicks outside the pizza
- **THEN** the current quarter selection is unchanged

### Requirement: Subtle selection feedback
The selected quarter SHALL be distinguishable through a subtle boundary or surface highlight while the pizza remains visually contiguous.

#### Scenario: Selection changes
- **WHEN** a user selects a different quarter
- **THEN** the previous highlight disappears and only the newly selected quarter is highlighted, without a gap between quarters

### Requirement: Ingredient placement in selected quarter
Choosing an ingredient SHALL add one instance to the selected quarter at a randomized valid position. If no quarter is selected, the application SHALL prompt for a quarter without adding an ingredient.

#### Scenario: Add to selected quarter
- **WHEN** a user has selected a quarter and activates an ingredient control
- **THEN** exactly one instance of that ingredient begins landing within the selected quarter

#### Scenario: Add before selection
- **WHEN** a user activates an ingredient control before selecting a quarter
- **THEN** no ingredient is added and the interface asks the user to select a quarter

### Requirement: Bounded and varied placement
The final visible footprint of every ingredient SHALL remain inside its selected quarter's usable cheese area, leaving a margin at the crust. Repeated valid placements SHALL be spatially varied, with crowding reduced where space permits.

#### Scenario: Repeated additions
- **WHEN** a user adds several ingredients to one quarter
- **THEN** each rests within that quarter and placements are not all at a fixed point

#### Scenario: Crowded quarter
- **WHEN** available space is limited by existing ingredients
- **THEN** the application chooses a valid position with the least practical overlap or reports that the quarter is full; it does not place an ingredient outside the quarter

### Requirement: Mixed ingredients per quarter
A quarter SHALL retain multiple ingredient instances of different types until the user removes them through an editing control.

#### Scenario: Mixed toppings
- **WHEN** a user adds mozzarella, mushroom, and pineapple to the same quarter
- **THEN** all three remain visible in that quarter after their landing animations finish
