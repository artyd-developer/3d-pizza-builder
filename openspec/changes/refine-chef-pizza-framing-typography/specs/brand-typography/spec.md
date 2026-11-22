# Spec Delta

## Purpose

Defines a consistent, readable type treatment that evokes the supplied PizzaBomb template across desktop and compact layouts.

## ADDED Requirements

### Requirement: Template-like display and interface type
The page SHALL use a cohesive bold, rounded, high-impact type treatment for section headings and primary controls, with supporting text that visually matches the supplied template. An available close fallback is acceptable until an exact font asset is supplied.

#### Scenario: Desktop type hierarchy
- **WHEN** a user views the desktop page
- **THEN** the navigation, popular-pizza heading and cards, builder heading and steps, and call to action have a clear type hierarchy consistent with the reference image

#### Scenario: Compact type hierarchy
- **WHEN** a user views the page at tablet or mobile width
- **THEN** headings and control labels remain readable without clipping, unintended truncation, overlap, or page-level horizontal scrolling

