# CLAUDE.md — AI Agent Guide for utkarsh9891.github.io

## What is this project?
Personal GitHub Pages site at [utkarsh9891.github.io](https://utkarsh9891.github.io). Static homepage with an app grid that links to mini-apps.

## Quick commands
```bash
npm install          # Install dependencies (minimal)
npm start            # Local dev server at http://127.0.0.1:8080/
```

## Architecture
- **Pure static site** — HTML, CSS, vanilla JS. No build step.
- **GitHub Pages** serves from the `master` branch
- **App manifest**: `apps.json` lists mini-apps shown on homepage
- **Local dev**: `apps.local.json` + `?local=1` for dev-only apps
- **Dev server**: `scripts/local-dev-server.mjs` (Node.js, port 8080)
  - Serves static files with MIME types
  - Proxies `/__candlescan-yahoo` → Yahoo Finance (for local candlescan testing)

## Key files
| File | Purpose |
|------|---------|
| `index.html` | Homepage with embedded fallback manifest |
| `apps.json` | Production app manifest (loaded by site.js) |
| `apps.local.json` | Dev-only app manifest (with `?local=1`) |
| `js/site.js` | App grid loader, environment detection |
| `css/style.css` | Site styles |
| `scripts/local-dev-server.mjs` | Local dev server with Yahoo proxy |
| `scripts/publish-candlescan.sh` | Legacy: build + copy candlescan here |
| `local.apps.paths` | Gitignored. Maps app names to local source paths |

## Mini-app hosting
Mini-apps were previously deployed as built bundles under subpaths (e.g., `/candlescan/`).
**CandleScan now deploys from its own repo** via GitHub Actions to its own GitHub Pages.
The `candlescan/` directory has been removed from this repo.

## Conventions
- No build step — edit HTML/CSS/JS directly
- `apps.json` entries: `{ "id": "...", "kind": "mini-app", "path": "...", "title": "..." }`
- `local.apps.paths` is gitignored — maps app folder → local source path for dev server
