# Spec Delta

## Purpose

Defines the dynamically rendered pizza scene, its oblique food presentation, and reliable behavior on supported WebGL 2.0 browsers.

## ADDED Requirements

### Requirement: Dynamic WebGL pizza
The application SHALL render the pizza and its toppings dynamically with raw WebGL 2.0 and custom GLSL ES 3.00 shaders, without a third-party rendering engine or a static pizza image standing in for the scene.

#### Scenario: Pizza appears
- **WHEN** a user opens the constructor in a browser supporting WebGL 2.0
- **THEN** a live pizza scene appears and responds to topping and selection changes

#### Scenario: WebGL is unavailable
- **WHEN** the browser cannot provide a WebGL 2.0 context
- **THEN** the application shows a clear unsupported-browser message instead of a blank or broken canvas

### Requirement: Volumetric contiguous pizza
The pizza SHALL have visible dough thickness, a rounded irregular browned crust, and contiguous dough, tomato sauce, and melted cheese surfaces without gaps at the four selection boundaries.

#### Scenario: Oblique view
- **WHEN** the pizza is viewed from the default camera
- **THEN** the crust thickness and raised rim are visible and the four selectable regions still read as one whole pizza

### Requirement: Food material appearance
The dough, crust, sauce, and cheese SHALL show organic color and surface variation, soft lighting, and shadows that support a substantial cooked-food appearance.

#### Scenario: Initial scene
- **WHEN** the pizza first renders
- **THEN** the crust has browned variation and the cheese and sauce are visually distinct rather than flat single-color discs

### Requirement: Responsive tilted camera
The scene SHALL use a stable tilted view of roughly 35 to 45 degrees above the pizza plane and keep the complete pizza visible on desktop, tablet, and mobile viewports.

#### Scenario: Viewport resize
- **WHEN** the browser viewport changes size or orientation
- **THEN** the pizza remains fully visible, correctly proportioned, and aligned with interactive picking

### Requirement: Recoverable graphics context
The application SHALL handle WebGL context loss without losing the current pizza configuration and SHALL restore the scene when the context returns.

#### Scenario: Context restored
- **WHEN** the graphics context is lost and later restored
- **THEN** the same selected quarter and placed toppings appear again without requiring a page reload
