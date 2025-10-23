# SEC Unity Website

React front-end for the SEC Unity site, built with the Vite tooling stack.

## Prerequisites

- Node.js 18 or newer (includes npm)

## Install dependencies

```bash
npm install
```

Run this once to download the project dependencies into `node_modules`.

## Local development

```bash
npm run dev
```

Starts the Vite dev server on `http://localhost:5173/`. Because the script passes `--host`, the site is also reachable from other devices on the same network.

## Production build

```bash
npm run build
```

Generates a production-ready bundle in the `dist` directory. To preview the built output locally, run:

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

Runs ESLint against the project to surface any JavaScript or JSX issues.
