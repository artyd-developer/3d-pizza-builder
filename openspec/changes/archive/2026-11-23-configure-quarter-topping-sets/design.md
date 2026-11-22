# Design

## Context

See proposal.md for motivation. PizzaModel currently stores individual pieces and one global selectedIngredient. PizzaEngine adds one piece per call; Placement samples random candidates with a least-overlap fallback. App uses disabled popular cards and an Undo/Clear/Reset section. Textures load asynchronously in the renderers. CheesePhysics caps patches at 18 and exposes eight visual impacts, so simultaneous 96-piece drops require bounded scheduling. Existing smoke/profile scripts assume one item per click and the old editing controls.

## Goals / Non-Goals

**Goals:** One authoritative recipe per quarter, consistent manual/preset/random commands, bounded placement and animation, and no late-loading overwrite of user work.

**Non-Goals:** Persistence across reloads, new ingredients or images, ordering/cart behavior, camera or geometry changes, protected CSS class edits, and new test files.

## Decisions

### Ordered recipes plus rendered pieces

Store four ordered ingredient arrays in PizzaModel, snapshot them for React, and retain the existing piece array for rendering. An existing selection returns before any mutation. A third selection removes only the oldest type's pieces and impact IDs; the retained type keeps positions and motion. Commit each batch atomically and emit once, including a count of pieces. Avoid inferring insertion order from animated pieces or using the current global selectedIngredient for button states.

### Even coverage with fixed batches

Use 12 equal-area strata over the usable quarter with bounded jitter and separation-aware candidate selection, checking footprint boundaries with fitsQuarter. Offset the second batch against retained pieces. Allow modest overlap where current sprite footprints make perfect packing impossible; never reduce the promised count or alter the camera/mesh to fit. Avoid 12 independent unconstrained random samples, which cluster. Compute the complete batch before committing it.

### Share replacement commands

Use one recipe-application path for popular cards and random startup; recipes listed in the spec are ordered oldest to newest. Preserve selectedQuarter during preset and clear commands. Preset activation explicitly replaces the whole pizza; manual duplicate choices are no-ops. Use native buttons with aria-pressed for ingredients, not radio semantics because two selections are valid. Reuse existing card artwork for Lava and update its label; no new artwork is requested. Leave the separate decorative bottom CTA unchanged.

### Readiness and one-time initialization

Aggregate load/decode success or error fallback for page images and renderer textures. Expose renderer readiness without duplicating image fetches. Gate mutating controls until initialization completes and guard initialization at the model/session level against effect reruns and context restoration. Startup chooses one or two types without replacement per quarter; repeat results across reloads are allowed by randomness. No browser storage is used. If WebGL is unavailable, retain the existing error state.

### Keep landing work bounded

Schedule batches with staggered spawn times through the existing animation lifecycle. Treat scheduled pieces as part of the current recipe and count, and cancel them by recipe revision on clear, replacement, or preset. Retain per-item local impacts and avoid increasing physics limits blindly. Verify worst-case 96-piece startup/preset performance. No changes to white steam or crust shading are needed.

## Risks / Trade-offs

- [Dense batches overlap] → Use equal-area coverage and bounded spacing candidates; preserve all 12 pieces and inspect two-type quarters.
- [Late callbacks restore deleted toppings] → Cancel pending spawns and invalidate stale initialization/recipe revisions before applying replacements.
- [Many landings overload physics] → Stagger arrivals and inspect the existing frame profile at maximum configuration.
- [Old checks encode removed controls] → Update existing smoke/profile/capture expectations and README in the affected implementation tasks; add no new test files.
- [Unarchived specs conflict] → This user request supersedes the old one-piece action, Undo/Reset UI, and decorative popular-card requirements; reconcile these records before archive.

## Migration Plan

Implement model and batch placement first, then controls/presets, then readiness-gated startup. Verify existing journeys with their updated expected behavior and focused desktop/mobile inspection. No persisted data migration is required. Rollback restores the prior command/model/UI paths together.
