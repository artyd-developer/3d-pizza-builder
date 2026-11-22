# Tasks

## 1. Supplied artwork preparation

- [x] 1.1 Copy the supplied chef, hand, and logo files into `public/brand/`, record their source and dimensions in `public/brand/README.md`, and verify the copied PNGs preserve their alpha channels.
- [x] 1.2 Crop the four popular-pizza thumbnails and the Olives, Jalapeño, and Extra Cheese previews from the supplied template into tightly bounded runtime assets; verify each crop matches its template subject and the full flattened template is not shipped.

## 2. Branded page structure and desktop layout

- [x] 2.1 Replace the current masthead and generic intro with the PizzaBomb header, desktop navigation, account/cart presentation, large logo, popular-pizza cards, and red CTA; verify every new template control is visibly present, disabled/aria-disabled, and leaves the URL and builder snapshot unchanged.
- [x] 2.2 Build the percentage-based chef stage with the chef below the WebGL canvas and the supplied hand above it using pointer-transparent overlay positioning; verify a desktop capture shows no visible `LOADING` oval or black halo and quarter picking still agrees with the visible pizza.
- [x] 2.3 Restyle and place the existing functional builder inside the branded right column, add the three decorative extra-topping tiles without registering ingredient handlers, and verify only pepperoni, mushroom, pineapple, quarter selection, Undo, Clear pizza, and Reset modify pizza state.

## 3. Responsive composition

- [x] 3.1 Implement the desktop two-column layout at 1040px and wider and verify a 1440×900 screenshot matches the supplied hierarchy with aligned chef, pizza, hand, logo, popular cards, and builder content.
- [x] 3.2 Implement the tablet/mobile compact header with small logo and hamburger, hide desktop navigation and the large hero logo, and order content as chef/live pizza, builder, then popular cards; verify 768×1024 and 390×844 captures have stable layer alignment and no page-level horizontal overflow.
- [x] 3.3 Preserve keyboard, touch, focus, reduced-motion, unsupported-WebGL, and context-restoration behavior in the new layout; verify the existing browser journey passes at desktop and mobile widths and decorative controls cannot receive or create builder selection state.

## 4. Cross-feature verification

- [x] 4.1 Run the existing production build, automated tests, and browser journey without adding test cases; verify the existing builder outcomes remain unchanged and inspect DOM state for layer order, responsive order, asset loading, inert decorative controls, and transformed-canvas picking.
- [x] 4.2 Inspect final desktop, tablet, and mobile screenshots against the supplied template and asset provenance note; verify the chef and foreground hand align with the live pizza, the builder is the first mobile section after the hero, and no generated or unapproved raster artwork entered the project.
