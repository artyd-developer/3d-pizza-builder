# Design

## Context

See `proposal.md` for motivation and the two delta specs for acceptance criteria. The chef stage uses the 795:1014 aspect ratio of `cook.png`; `.chef-stage::before` paints a large brown oval, `.pizza-window` clips the transparent canvas, `.pizza-canvas` is CSS-scaled to 1.34, and `.chef-hand` is positioned independently above it. The current 40° camera elevation and perspective are shared by rendering and `planePoint`, while `PizzaEngine` derives pointer coordinates from the canvas rectangle. Current headings use Georgia and interface text uses Arial. The prior redesign change is unarchived and its code edits are present in the worktree.

## Goals / Non-Goals

**Goals:** Make the live pizza fill the template serving position first; keep one proportional stage coordinate system for artwork and rendering; retain camera-to-picking consistency; make typography look closer to the supplied template with fonts available to ordinary browsers.

**Non-Goals:** Change pizza geometry, topping physics, ingredient assets, button behavior, navigation, page content order, or animation timing. No exact Pizza Hut proprietary font is claimed or bundled.

## Decisions

### Fit the pizza before changing its projection

Use desktop, tablet, and mobile captures to measure the visible crust bounds relative to the target oval. First tune the canvas/window size and camera distance or field of view so the rendered crust nearly reaches the intended edge. Change camera elevation only to match the template's visible top surface and crust depth. Reduce or eliminate the separate brown oval and the wide background margin once the pizza itself covers the placeholder. Avoid expanding the crust mesh: geometry changes would alter ingredient and hit boundaries. Keep the same camera matrix for rendering and picking.

### Maintain correct pointer coordinates

Prefer an untransformed canvas inside a proportionally sized wrapper; use the camera to create the required zoom. A CSS transform changes the displayed rectangle independently of the camera's internal width and height. If a transform remains necessary for final alignment, explicitly convert pointer positions from its displayed rectangle into the camera's CSS pixel space. Verify visible quarter centers and near-boundary clicks rather than assuming the existing smoke journey covers the new projection.

### Align hand from the shared stage

Tune only percentage `left`, `top`, and `width` for the supplied `hand.png` against the original chef arm at the three captured widths. Keep it at the foreground z-index with `pointer-events: none`; the wrapper and hand must scale together. Avoid a separate mobile asset or hand animation.

### Use an available type stack

Try `Rockwell Extra Bold`/`Rockwell` for the chunky display headings and `Trebuchet MS` for navigation, buttons, and supporting text, with Georgia and sans-serif fallbacks. These families are present on the development workstation, but CSS fallbacks are necessary on other systems. Tune weight, spacing, line height, and responsive sizes against the supplied screenshot. Do not download or label a different typeface as an official Pizza Hut font. The image logo remains unchanged.

## Risks / Trade-offs

- [A tighter frame clips crust or falling ingredients] → Compare initial and active-topping captures at every target width and keep the full visible pizza within the clip.
- [Projection change makes taps select a different quarter] → Check each visible quarter center and boundary at desktop and mobile sizes; keep camera and pointer mapping synchronized.
- [The black placeholder reappears around the pizza] → Check the full perimeter at all widths before removing the mask; retain only the smallest matching background needed.
- [Local fonts vary by device] → Use explicit fallback stacks and check line wrapping at the target viewports.

## Migration Plan

Tune the pizza framing first, then align the foreground hand and typography. Compare fresh desktop, tablet, and mobile captures with the supplied template and check that visible quarter selection still agrees with the pizza. The separate broad integration verification task is omitted at the user's request. No persisted data or API migration is required. Rollback restores the prior CSS and camera framing values.
