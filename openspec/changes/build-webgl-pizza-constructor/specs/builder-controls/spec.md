# Spec Delta

## Purpose

Defines the responsive controls that let users choose ingredients, understand the selected quarter, and revise or restart their pizza.

## ADDED Requirements

### Requirement: Ingredient controls and feedback
The interface SHALL provide working mozzarella, mushroom, and pineapple controls using previews of their ingredient visuals, and SHALL indicate the most recently chosen ingredient and the selected quarter.

#### Scenario: Choose an ingredient
- **WHEN** a user activates an ingredient control after selecting a quarter
- **THEN** that ingredient is added and its control shows a clear active state

#### Scenario: Quarter changes
- **WHEN** a user selects another quarter
- **THEN** the selected-quarter indicator updates immediately

### Requirement: Undo last ingredient
Undo SHALL remove the most recently added ingredient, including an ingredient still falling or settling, and SHALL cancel its associated local cheese response when no other impact needs it.

#### Scenario: Undo after landing
- **WHEN** the user activates Undo after adding an ingredient
- **THEN** the newest ingredient disappears and earlier ingredients remain

#### Scenario: Undo during fall
- **WHEN** the user activates Undo while the newest ingredient is still animated
- **THEN** that ingredient's animation ends and it does not reappear

#### Scenario: Nothing to undo
- **WHEN** the pizza has no ingredients
- **THEN** Undo is unavailable or has no effect without an error

### Requirement: Clear pizza
Clear pizza SHALL remove all placed and animating ingredients and active cheese impacts while retaining the current quarter and ingredient choices.

#### Scenario: Clear a customized pizza
- **WHEN** the user activates Clear pizza
- **THEN** the pizza has no toppings or active landing effects, and the current selections remain visible

### Requirement: Reset builder
Reset SHALL restore the initial builder state: no toppings, no active impacts, no selected quarter or ingredient, and the default camera view.

#### Scenario: Reset after customization
- **WHEN** the user activates Reset
- **THEN** the pizza and controls return to the same state as a fresh visit

### Requirement: Responsive usable interface
The pizza and controls SHALL remain visible and operable with mouse, touch, and keyboard on desktop, tablet, and mobile layouts.

#### Scenario: Narrow viewport
- **WHEN** a user opens the constructor on a narrow mobile screen
- **THEN** the pizza and ingredient and editing controls remain accessible without horizontal page scrolling

#### Scenario: Keyboard controls
- **WHEN** a keyboard user focuses a control and activates it
- **THEN** it performs the same action as pointer or touch activation
