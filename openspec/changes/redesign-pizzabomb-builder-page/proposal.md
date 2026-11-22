# Proposal

## Why

The current dark studio layout presents the pizza constructor separately from the supplied PizzaBomb chef and brand artwork. The page should instead make the chef holding the live 3D pizza the central experience and match the supplied desktop template while remaining practical on mobile.

## What Changes

- Replace the current dark studio presentation with a white, red, orange, and dark-brown PizzaBomb page based on the supplied template.
- Compose the supplied chef cutout below the transparent WebGL pizza and the separate right-hand cutout above it, keeping the hand in its original apparent position while it overlaps the live pizza.
- Add the supplied PizzaBomb logo, desktop navigation, account/cart presentation, popular-pizza cards, decorative extra-topping controls, and the large red call-to-action.
- Keep all newly introduced template controls visual only; they SHALL NOT navigate, open menus, add toppings, or modify builder state.
- Preserve the existing functional quarter selection, pepperoni/mushroom/pineapple toppings, landing animation, local cheese ripple, Undo, Clear pizza, Reset, keyboard behavior, and WebGL recovery.
- On mobile, show a compact brand logo and visual hamburger instead of the desktop navigation and large hero logo, then order the page as chef/live pizza, functional builder controls, and popular-pizza cards.
- Use only the supplied images, existing project assets, and crops derived from the supplied template; do not generate new artwork.

## Capabilities

### New Capabilities

- `brand-page-layout`: Responsive PizzaBomb page composition, chef/WebGL/hand layering, branded controls, decorative template content, and desktop/mobile ordering.

### Modified Capabilities

None. The existing builder and WebGL behavior remains unchanged; the project currently has no archived main capability specs.

## Impact

The React page structure and responsive CSS will be reorganized. Supplied brand assets and selected crops from the template will be added under `public/`. Existing build, test, browser-journey, and layout-capture commands will verify the redesign without adding test cases. The pizza model, physics, shaders, ingredient set, command behavior, and animation system are not changed.
