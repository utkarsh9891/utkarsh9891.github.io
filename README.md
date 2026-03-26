# utkarsh9891.github.io

Personal site hosted on **GitHub Pages**: [utkarsh9891.github.io](https://utkarsh9891.github.io)

Static homepage with contact links, notes, and an **Apps & tools** card grid.

---

## Tech stack

- **HTML / CSS / JS** — no bundler, no framework
- **GitHub Pages** — deploys from `master` branch

---

## Quick start

```bash
git clone https://github.com/utkarsh9891/utkarsh9891.github.io.git
cd utkarsh9891.github.io
npm start     # Local server at http://127.0.0.1:8080/
```

---

## Project structure

| Path | Purpose |
|------|---------|
| `index.html` | Homepage with embedded fallback app manifest |
| `apps.json` | App card data (production) |
| `apps.local.json` | Dev-only card data (`?local=1` on localhost) |
| `js/site.js` | Renders app grid from manifest |
| `css/style.css` | Dark theme, layout, card grid |
| `img/` | Favicons |
| `scripts/local-dev-server.mjs` | Static file server + Yahoo Finance proxy for CandleScan dev |
| `scripts/run.sh` | `npm start` entry: optional git pull + start server |

---

## App grid

Cards are driven by `apps.json`. Each item has: `id`, `kind` (mini-app/tool/link), `title`, `href`, `description`, `tags`, `status`, `icon`.

The embedded `#app-manifest` in `index.html` is the offline fallback — keep it in sync with `apps.json`.

---

## Mini-apps

Mini-apps deploy independently from their own repositories:

| App | Repo | URL |
|-----|------|-----|
| **CandleScan** | [utkarsh9891/candlescan](https://github.com/utkarsh9891/candlescan) | [/candlescan/](https://utkarsh9891.github.io/candlescan/) |

CandleScan deploys via GitHub Actions from its own repo to its own GitHub Pages. No build artifacts are stored in this repository.

---

## Local development

```bash
npm start    # Runs scripts/run.sh → local-dev-server.mjs on port 8080
```

| URL | Use |
|-----|-----|
| `http://127.0.0.1:8080/` | Homepage with `apps.json` |
| `http://127.0.0.1:8080/?local=1` | Homepage with `apps.local.json` |

The dev server includes a `/__candlescan-yahoo` proxy for testing CandleScan locally.

Set `PORT=9000 npm start` to use a different port.

---

## Deployment

Push to `master` — GitHub Pages serves automatically. No build step needed.

---

## Related repositories

- **[candlescan](https://github.com/utkarsh9891/candlescan)** — CandleScan source (React/Vite)
- **[PackageSync](https://packagecontrol.io/packages/PackageSync)** — Sublime Text sync tool
