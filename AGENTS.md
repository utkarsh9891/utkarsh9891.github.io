# AGENTS.md — Coding Agent Guide for utkarsh9891.github.io

> This file helps AI coding agents (Claude, Cursor, Copilot, Aider, etc.) understand the project quickly.

## What is this project?
Personal GitHub Pages site at [utkarsh9891.github.io](https://utkarsh9891.github.io). Static homepage with an app grid that links to mini-apps and tools.

## Quick commands
```bash
npm start            # Local dev server at http://127.0.0.1:8080/
```

## Architecture
- **Pure static site** — HTML, CSS, vanilla JS. No build step, no framework.
- **GitHub Pages** serves from the `main` branch
- **App manifest**: `apps.json` lists apps shown on homepage grid
- **Local dev**: `apps.local.json` + `?local=1` for dev-only apps
- **Dev server**: `scripts/local-dev-server.mjs` (Node.js, port 8080)

## Key files
| File | Purpose |
|------|---------|
| `index.html` | Homepage with embedded fallback manifest + dynamic notes JS |
| `apps.json` | App card data (production, loaded by site.js) |
| `apps.local.json` | Dev-only card data (use `?local=1` on localhost) |
| `js/site.js` | Renders app grid from manifest, environment detection |
| `css/style.css` | Dark theme, layout, card grid, bubble styles |
| `scripts/local-dev-server.mjs` | Static file server + Yahoo Finance proxy |
| `scripts/run.sh` | `npm start` entry point |

## Mini-apps
Mini-apps deploy independently from their own repositories:

| App | Repo | Deploys via |
|-----|------|-------------|
| CandleScan | [utkarsh9891/candlescan](https://github.com/utkarsh9891/candlescan) | GitHub Actions to its own Pages |

## Conventions
- No build step — edit HTML/CSS/JS directly
- Dark theme with CSS custom properties (`--bg-deep`, `--accent`, etc.)
- App cards driven by `apps.json` with `{ id, kind, title, href, description, tags, status, icon }`
- Notes section is JS-driven: pool of 15 notes, 4 randomly shown per page load
- Keep inline `#app-manifest` in index.html in sync with `apps.json`

## Deployment
Push to `main` branch. GitHub Pages auto-deploys. No build step needed.
