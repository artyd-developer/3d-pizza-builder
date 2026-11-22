# Spec Delta

## Purpose

Defines how the chef artwork, foreground hand, and live interactive pizza appear as a single coherent hero across supported screen sizes.

## ADDED Requirements

### Requirement: Pizza fills the intended serving position
The live pizza SHALL occupy the serving area shown in the supplied template, with its crust visibly framed and without a broad empty brown band between the crust and the apparent tray edge.

#### Scenario: Desktop and compact hero
- **WHEN** the page is viewed at 1440×900, 768×1024, or 390×844 CSS pixels
- **THEN** the crust fills the visible pizza opening proportionally, with no exposed black `LOADING` placeholder, black halo, or conspicuous empty brown annulus

### Requirement: Foreground hand joins the chef composition
The supplied hand artwork SHALL visually continue the chef's near arm and overlap the left foreground edge of the pizza while leaving the usable pizza surface available for selection.

#### Scenario: Hand alignment across viewports
- **WHEN** the chef hero scales between desktop, tablet, and mobile widths
- **THEN** the hand remains aligned with the arm, appears in front of the pizza edge, and does not drift into the pizza center

### Requirement: Visible pizza and selection agree
The displayed pizza SHALL use a camera and pointer mapping that select the quarter indicated by the visible surface at every supported size.

#### Scenario: Selecting visible quarters
- **WHEN** a user taps or clicks the center of each visible quarter after the hero is reframed
- **THEN** the corresponding quarter is selected and existing ingredient placement follows that selection

