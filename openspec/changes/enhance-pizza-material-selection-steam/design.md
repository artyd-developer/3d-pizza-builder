# Design

## Context

See `proposal.md` for motivation and `specs/pizza-presentation-effects/spec.md` for behavior. `Geometry.ts` already builds a raised, irregular crust mesh and `materialShaders.ts` shades it as material 1. The same fragment shader currently receives the selected quarter and brightens it with a static edge treatment. `PizzaRenderer` clears a transparent WebGL canvas and draws pizza meshes followed by topping sprites; it has no presentation-particle layer.

## Goals / Non-Goals

**Goals:** Improve the baked rim as part of the current procedural material system, preserve normal pizza color outside the selected quarter, and add an inexpensive transparent heat cue that works inside the existing canvas.

**Non-Goals:** Change pizza size or camera framing, page/chef/hand layout, quarter math, topping assets, ingredient physics, cheese-impact behavior, or builder controls. No external image download or large raster texture is required.

## Decisions

### Refine the existing crust material

Adjust the material-1 shader palette and layered noise so the raised mesh reads as a brighter golden bread rim with uneven toasted patches, smaller char marks, and a soft baked highlight. The existing mesh already supplies rim volume and irregularity, so changing the material is safer than replacing geometry or widening the pizza. A new raster crust texture was considered, but would add hosting weight and can visibly tile at this scale.

### Blink only the selected quarter

Pass a renderer time value to the material shader and use a smooth periodic intensity only inside the selected cheese sector. Remove any selected-state darkening or full-pizza overlay. Keep the highlight low-opacity and local to cheese so the crust and toppings remain readable. A CSS overlay was rejected because it cannot follow the pizza perspective or quarter boundaries accurately.

### Render procedural transparent steam after toppings

Add a small WebGL steam layer made from a fixed number of camera-facing transparent wisps with procedural alpha and time-based vertical drift. Draw it after the pizza and topping sprites using alpha blending and disabled depth writes, while limiting its opacity and footprint to the pizza's upper region. This retains the canvas alpha outside the pizza, needs no external asset, and keeps the foreground chef hand above the canvas through the current DOM stacking order.

### Preserve renderer lifecycle behavior

Create and destroy steam GPU resources alongside the existing renderer resources, and recreate them through the current `webglcontextrestored` path. Do not put steam state in `PizzaModel`, selection state, or `CheesePhysics`; it is purely presentational.

## Risks / Trade-offs

- [Steam becomes too opaque or hides toppings] → Keep alpha low, limit wisp count, and capture pizza states with toppings at desktop and mobile sizes.
- [A time-driven selection flicker feels harsh] → Use a smooth pulse with a restrained brightness range rather than binary flashing.
- [Extra transparent draw calls affect frame time] → Use a small fixed particle count and one instanced draw path; compare the current browser performance profile before and after.
- [Context restoration loses presentation effects] → Exercise the existing lost-context browser flow and verify crust, selection, and steam return.

## Migration Plan

Update the material shader first and compare the idle/selected pizza against the supplied reference. Add the steam layer, then verify the existing placement and editing journey, transparent canvas boundary, mobile view, and context restoration. Rollback removes the presentation renderer resources and restores the current shader behavior; no saved state or migration is involved.
