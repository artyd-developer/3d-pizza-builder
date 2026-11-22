# Proposal

## Why

The live pizza currently sits inside a noticeably empty brown oval, and the foreground hand does not convincingly grip its edge. The page typography also differs from the supplied PizzaBomb template, so the hero and controls need a focused visual refinement.

## What Changes

- Reframe the live pizza with a better matched camera elevation and scale so the crust occupies the intended template position without a broad brown gap. Keep rendered quarters and pointer picking aligned.
- Reposition and resize the supplied foreground hand so it joins the chef's arm and overlaps the reframed pizza edge naturally at desktop, tablet, and mobile widths.
- Replace the current Arial/Georgia mix with a close, locally available fallback for the old Pizza Hut style shown in the template. No exact font file has been supplied, so this is an approximation rather than a claim of brand-font identity.
- Preserve the existing builder interactions, toppings, cheese response, visual-only controls, and page hierarchy. No new animations or button behavior are requested.

## Capabilities

### New Capabilities

- `pizza-hero-presentation`: Visual alignment and framing of the chef, foreground hand, and interactive pizza across viewport sizes.
- `brand-typography`: Consistent template-like display and UI typography across the responsive page.

### Modified Capabilities

None. The project's main `openspec/specs/` inventory is empty; the preceding unarchived redesign change has its own `brand-page-layout` delta and is left untouched.

## Impact

Primarily the hero CSS in `src/styles.css` and camera framing in `src/engine/Camera.ts`, with pointer-coordinate handling in `src/engine/PizzaEngine.ts` if the final canvas geometry requires it. Typography affects stylesheet selectors across the header, cards, builder, and CTA. The visual match of the pizza to the supplied template is the primary acceptance point; targeted captures and quarter selection checks support it. No new runtime artwork or dependency is required.
