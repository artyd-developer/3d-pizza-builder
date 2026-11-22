# Spec Delta

## Purpose

Defines recognizable ingredient visuals and the animated contact response that makes toppings feel as though they land on soft melted cheese.

## ADDED Requirements

### Requirement: Three recognizable ingredient types
The constructor SHALL provide distinct mozzarella, sliced mushroom, and pineapple visuals as transparent ingredient sprites created for this application, with depth cues, shading, and a soft contact shadow.

#### Scenario: Ingredient choice
- **WHEN** the user views the ingredient controls or placed toppings
- **THEN** each of the three types is visually recognizable and distinct from the others

#### Scenario: Ingredient asset unavailable
- **WHEN** an ingredient image cannot be loaded
- **THEN** that ingredient remains usable through a recognizable fallback visual rather than disappearing or breaking the scene

### Requirement: Falling and landing sequence
Every added ingredient SHALL visibly spawn above its target, fall with slight rotation and acceleration, contact the cheese, make a small settling bounce, and remain on the pizza.

#### Scenario: Ingredient added
- **WHEN** a user adds an ingredient to a selected quarter
- **THEN** the ingredient passes through spawning, falling, landing, and idle states in order and remains visible at its final position

### Requirement: Local cheese impact response
Each ingredient landing SHALL create a brief indentation and damped wobble centered on its contact point. The deformation SHALL be confined to a small neighborhood around that ingredient, and cheese outside that neighborhood SHALL remain stationary.

#### Scenario: Single impact
- **WHEN** an ingredient contacts the cheese
- **THEN** the nearby cheese dips and wobbles before returning to rest while distant cheese does not visibly move

#### Scenario: Separate impacts
- **WHEN** two ingredients land at different positions close in time
- **THEN** each produces a response around its own contact point without a whole-pizza ripple

### Requirement: Ingredient follows settling cheese
After contact, an ingredient SHALL move with its local cheese surface until that surface settles, with its contact shadow staying aligned beneath it.

#### Scenario: Cheese rebound
- **WHEN** the cheese rebounds beneath a newly landed ingredient
- **THEN** the ingredient and its shadow respond consistently and end at a stable resting position

### Requirement: Frame-rate-independent motion
Landing and cheese motion SHALL use elapsed time so their duration and shape remain consistent across supported frame rates.

#### Scenario: Variable frame rate
- **WHEN** the browser renders at different frame rates during an ingredient drop
- **THEN** the ingredient still lands and the local cheese response settles in approximately the same elapsed time
