# Design

## Context

The repository contains an OpenSpec root but no application code or existing capability specs. See `proposal.md` for the product goal and `specs/` for observable behavior. The supplied chef photographs establish a low oblique view of a substantial browned pizza; the cutout slice image informs crust and melted-cheese appearance only. None of those images will be used as the rendered pizza, and slice lifting is outside the interaction model. The app must run in desktop and mobile WebGL 2.0 browsers without a rendering engine.

## Goals / Non-Goals

**Goals:**

- Keep scene state, animation, picking, and WebGL resources in an engine independent of React; synchronize the UI on discrete state changes.
- Make the cheese response visibly physical at the contact point while bounding work and deformation near each ingredient.
- Keep the pizza one continuous object so quarter selection never opens seams.
- Make the scene recoverable after a lost WebGL context and usable when an ingredient texture fails.

**Non-Goals:**

- Rigid-body physics, fluid simulation, whole-pizza waves, slice lifting, cheese strands, or a chef character.
- Reproducing or embedding the supplied photographs as app artwork.
- A backend, persistence, or multiplayer behavior.

## Decisions

### 1. App shell and engine boundary

Use a small TypeScript/React application with a build tool such as Vite for controls and layout. A framework-independent engine owns the canvas, scene model, update loop, WebGL resources, hit testing, and event subscriptions. React sends commands such as `selectQuarter`, `addIngredient`, `undo`, `clear`, and `reset`; the engine emits compact snapshots after those commands, not on every frame. This keeps React out of the render loop. A single canvas receives pointer input; HTML controls remain native buttons for keyboard and touch use.

Alternative considered: putting animation state in React. It would drive component updates every frame and make context recovery and graphics resource ownership harder to reason about.

### 2. One pizza coordinate system and camera

Use world X/Z for the pizza plane and Y for height. Generate a bottom dough disk, inner surface, sauce, deformable cheese grid, and a radial crust ring with a rounded cross-section and low-frequency seeded irregularity. Keep the pizza geometrically continuous; a subtle shader overlay or line pass marks the selected sector. Use a perspective camera around 40 degrees above the plane, aimed at the pizza center. On resize, update projection and capped device-pixel-ratio framebuffer dimensions. Share the same view/projection matrices for crust, surfaces, sprites, shadows, and picking.

Alternative considered: four separate pizza wedges. They simplify per-quarter meshes but create visible seams and complicated deformation along boundaries.

### 3. Custom material rendering and original ingredient art

Write GLSL ES 3.00 shaders for dough, crust, sauce, cheese, and ingredient sprites. Layer a few scales of deterministic noise with warm directional and ambient lighting; use irregular masks for toasted spots, bubbles, sauce variation, melted cheese patches, and highlights. Keep material parameters tunable without replacing geometry. Draw transparent ingredient art on quads parallel to the pizza plane, with a small height offset and a separate soft shadow pass. Create original transparent PNG or WebP sprites for mozzarella pieces, mushroom slices, and pineapple chunks; pack them into an atlas if it materially reduces draw calls. Use recognizable procedural fallback visuals if an image fails to load.

Alternative considered: drawing each topping from flat primitives. This would undermine the food appearance. Using the supplied stock photos as textures would also fail to create reusable isolated toppings.

### 4. Picking and placement

Unproject pointer coordinates into a world ray and intersect the pizza plane. Reject points outside the usable pizza radius, then map `atan2` to one of four 90-degree sectors. For new ingredients, sample radius with the square-root area transform and angle uniformly in the selected sector; reject candidates whose entire sprite footprint breaches either radial edge or the crust margin. Prefer candidates with low overlap against existing toppings. Use a finite attempt budget and report a full quarter if no valid center remains. Seedable random generation will make placement tests repeatable.

Alternative considered: sampling radius linearly. That concentrates toppings near the center and does not meet the desired area distribution.

### 5. Ingredient drop and bounded cheese physics

Each ingredient has `SPAWNING`, `FALLING`, `LANDING`, and `IDLE` states. Integrate falling with elapsed time and a fixed-step cap; interpolate render positions for smooth frames. Animate height, slight rotation, soft shadow scale/opacity, and a small landing bounce. The ingredient's final pose samples the cheese height at its contact point so it follows the rebound.

At contact, create a temporary circular spring patch centered on that ingredient. A small fixed lattice of vertical masses receives a downward impulse; neighbor springs and damping make a short rebound. Clamp the patch boundary to zero displacement and use a smooth falloff, so deformation cannot propagate beyond its radius. Size that radius to roughly one to two ingredient widths and tune amplitude for an appetizing soft-cheese effect. Several active impacts can coexist; sum their bounded contributions at affected cheese vertices and retire each patch once its motion falls below a threshold. Update only active patches and the cheese vertex data they influence. Clear, reset, or undo cancels the relevant impacts. Fixed simulation steps with a cap on catch-up work prevent large frame gaps from destabilizing the motion.

Alternative considered: a full-pizza wave grid. It would send motion far from the landed ingredient, contrary to the requested local effect. A purely scripted sine animation would be cheaper, but its response to simultaneous impacts and topping contact would be less coherent.

### 6. Rendering order and resilience

Use depth testing for opaque pizza layers and ordered transparent passes for shadows and ingredient sprites. Keep slight physical layer offsets to avoid z-fighting. Batch compatible sprite instances and reuse meshes, buffers, shaders, and textures. Suspend GPU work on context loss while retaining CPU scene state; recreate shaders, buffers, and textures on restoration. Surface shader compilation and link errors in a readable fallback UI rather than leaving a blank canvas. Cap pixel ratio and tune mesh/physics resolution based on mobile performance measurements.

Alternative considered: rebuilding the entire application state on context restoration. That would lose the user's pizza and produce a disruptive restart.

## Risks / Trade-offs

- [Procedural materials may look synthetic] -> Tune against the supplied visual direction, use varied color masks and irregular geometry, and review real browser renders at desktop and mobile sizes.
- [Cheese motion may look like rubber or become too subtle] -> Tune impulse, damping, patch radius, and ingredient bounce together; inspect slow and normal-speed captures.
- [Several impacts may increase per-frame mesh updates] -> Limit active patches, retire settled patches, update only affected vertices, and profile on mobile hardware.
- [Tilted perspective can make picking and sprite boundaries disagree] -> Use shared matrices and world coordinates, test all four sector edges and viewport sizes.
- [Transparent sprites can show sorting or halo artifacts] -> Use premultiplied alpha consistently and control transparent draw order.
- [Original ingredient assets may be less photorealistic than the references] -> Favor clear silhouettes, shading, and consistent lighting while reserving effort for landing physics.

## Migration Plan

This is a greenfield application, so no data migration is needed. Build and verify the static app before deployment; rollback, if needed, is restoring the previous deployed build.
