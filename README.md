# Pizza Builder

An interactive four-quarter pizza constructor rendered with raw WebGL 2.0 and GLSL ES 3.00. React provides the controls; the scene engine owns rendering and animation.


---

![Built with Codex](https://img.shields.io/badge/Built%20with-OpenAI%20Codex-black?logo=openai)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Powered-646CFF?logo=vite)

## Run locally

Use a current Node.js release, then run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` creates a production build in `dist/`; `npm run preview` serves it locally. `npm test` runs the engine's automated checks.

## Browser support

Use a recent desktop or mobile browser with WebGL 2.0 enabled. The app reports an unsupported-browser message when WebGL 2.0 is unavailable. Graphics context restoration retains the current pizza.

## Controls

1. Tap or click one of the four pizza quarters.
2. Choose pepperoni, mushroom, or pineapple. Each click drops one topping into the selected quarter and produces a small cheese wobble around its landing point.
3. **Undo** removes the most recent topping, even while it is falling. **Clear pizza** removes all toppings but keeps the current quarter and ingredient choices. **Reset** returns the pizza and controls to their initial state.

Controls are native buttons and work with keyboard activation. The ingredient previews are the same original sprite assets used on the pizza. The supplied pizza photographs are visual references, not rendered assets.
