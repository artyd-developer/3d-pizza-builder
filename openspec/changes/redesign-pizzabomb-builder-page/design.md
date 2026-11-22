# Design

## Context

The current React page places a transparent WebGL 2 pizza canvas in a generic dark scene beside the functional builder controls. The renderer already clears with zero alpha, and pointer picking derives from the canvas bounding rectangle, so the canvas can be composited over supplied artwork without changing the pizza model or renderer. The supplied assets are `cook.png` (795×1014, transparent with a black pizza placeholder), `hand.png` (192×266, transparent foreground hand), `logo.png` (874×257), and the 1448×1086 flattened template.

## Goals / Non-Goals

**Goals:**
- Rebuild the page hierarchy and styling around the supplied PizzaBomb desktop template.
- Keep chef, live pizza, and foreground hand aligned at every supported width.
- Make the live pizza and builder the first mobile content while retaining all decorative template sections.
- Preserve current builder behavior and accessibility.

**Non-Goals:**
- Add navigation, ordering, account, cart, menu, or hamburger behavior.
- Add olives, jalapeño, extra cheese, popular-pizza presets, or any new ingredient type.
- Modify pizza geometry, shaders, physics, camera angle, or state APIs.
- Add automated test cases or new animations.
- Generate replacement artwork.

## Decisions

### Asset preparation

Copy `cook.png`, `hand.png`, and `logo.png` into `public/brand/` without altering their content. Create seven transparent or tightly bounded crops from the supplied template for the four popular-pizza thumbnails (Supreme, Meat Lover's, Cheese, Pepperoni) and three decorative topping previews (Olives, Jalapeño, Extra Cheese). Keep a small provenance note in `public/brand/README.md` naming the supplied source for each asset. Do not ship the flattened template itself because it is a reference and crop source rather than runtime content.

### Hero layer system

Create a `.chef-stage` with the source image aspect ratio `795 / 1014` and percentage-positioned children:

1. `cook.png` fills the stage at z-index 1.
2. A clipped pizza window occupies approximately `left: 14%`, `top: 52%`, `width: 82%`, `height: 45%` at z-index 2, matching the black oval. The existing canvas fills this window and uses a centered scale near `1.35` to cover the placeholder; final values are accepted only when the black `LOADING` oval is not visible around the crust.
3. `hand.png` is restored at approximately `left: 0%`, `top: 63%`, `width: 24%`, `height: 26%` at z-index 3. It uses `pointer-events: none`, so the overlap does not prevent pizza selection.

Use percentages rather than viewport pixels so all layers scale from the same reference coordinate system. Keep the existing canvas element and engine lifecycle so its pointer and resize behavior remain intact. Alternative separate desktop and mobile composites were rejected because they would duplicate alignment tuning and risk behavioral drift.

### Responsive page composition

Desktop (`>= 1040px`) uses a white header with the compact logo, visual navigation, account/cart area, and a two-column main grid. The chef stage occupies the left feature column. The right column contains the large logo, a 2×2 popular-pizza grid, and the existing builder restyled to match the template, followed by the red CTA.

Tablet (`621–1039px`) uses the compact logo and hamburger, followed by the chef stage, builder, and popular cards. The builder may use two internal columns where space permits.

Mobile (`<= 620px`) uses the small logo and hamburger only. It hides the desktop navigation, account/cart area, and large hero logo. Main content order is chef stage, functional builder, then popular cards. Popular cards form a single column or a horizontally scrollable row without creating page-level horizontal overflow.

### Functional and decorative controls

Keep the existing quarter, pepperoni, mushroom, pineapple, Undo, Clear pizza, and Reset elements wired to their current handlers and state. Render extra topping tiles, header actions, popular cards, Pizza Menu, hamburger, and the red CTA as disabled buttons with normal visual opacity, `aria-disabled="true"`, no handlers, and styles that do not imply a selected builder state. The decorative topping tiles must not share `.ingredient-button` or participate in the ingredient array.

Use the template's white panels, red-to-dark-red gradients, orange active accents, dark-brown quarter buttons, rounded cards, and bold display type. CSS-drawn hamburger lines and simple account/cart outlines are interface chrome rather than new raster artwork.

## Risks / Trade-offs

- [The live pizza does not fully cover the black placeholder] → Tune only the pizza-window percentages and canvas scale against desktop, tablet, and mobile captures; fail visual verification if `LOADING` or a black halo is visible.
- [The foreground hand drifts from the arm] → Keep stage, chef, and hand in the same reference aspect ratio and verify overlap in screenshots at all three breakpoints.
- [Canvas transforms break picking] → Run quarter-center and boundary clicks after responsive layout at each viewport; adjust the wrapper rather than the engine unless picking evidence shows a real mismatch.
- [Decorative controls appear functional] → Mark them disabled/aria-disabled, remove hover lift/active styling, and verify activation leaves URL and builder state unchanged.
- [Large artwork increases page weight] → Preserve supplied resolution for the hero, crop runtime thumbnails tightly, and avoid loading the full template image.

## Migration Plan

Add the prepared assets, replace the page markup and CSS, then update browser journeys and layout captures before release. No persisted data or public API migration is required. Rollback restores the previous page structure and stylesheet while leaving the independent pizza engine untouched.
