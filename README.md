# Vite + React (Feature-Driven layout)

The project is scaffolded with the latest Vite React template and organized using a lightweight
feature-driven structure so UI layers stay decoupled as the app grows.

## Structure

- `src/app` — entry point, global styles, providers
- `src/pages` — route-level composition
- `src/widgets` — reusable page sections built from features/shared UI
- `src/features` — self-contained business capabilities
- `src/shared` — design tokens, primitives, assets, utilities

## Getting started

```bash
npm install
npm run dev
```

Then open the dev server URL printed in the terminal.
