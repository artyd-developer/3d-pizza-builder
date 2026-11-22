[English](README.md) | [Русский](README.ru.md)

# Pizza Builder

An interactive four-quarter pizza constructor rendered with raw WebGL 2.0 and GLSL ES 3.00. React provides the controls; the scene engine owns rendering and animation.

---

![Built with Codex](https://img.shields.io/badge/Built%20with-OpenAI%20Codex-black?logo=openai)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Powered-646CFF?logo=vite)

## Project tools and typography

This project was built with ChatGPT Codex and planned with OpenSpec.

- Headings font: Makcex by Khurasan
- Interface text font: PastiRegular by Visia Yerian

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

1. A random pizza appears after the images load. Click **Create my bomb** to clear it for a custom pizza.
2. Select a quarter, then choose up to two of the six ingredients. Each new type adds 12 pieces. A third replaces the oldest type; clicking an existing type changes nothing.
3. Popular pizza cards apply their recipes to every quarter. Recipes remain only while this page is open.

Controls are native buttons and work with keyboard activation. The ingredient previews are the same original sprite assets used on the pizza. The supplied pizza photographs are visual references, not rendered assets.

## Build for GitHub Pages

The Vite configuration uses relative asset paths, so the production build works from a GitHub Pages project URL such as `https://<user>.github.io/<repository>/`.

```sh
npm ci
npm run build
```

Publish the generated `dist/` directory through GitHub Pages. This repository does not currently include a GitHub Actions deployment workflow; configure one in GitHub or deploy the `dist/` folder with your preferred publishing method.
