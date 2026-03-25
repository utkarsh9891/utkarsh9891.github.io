# utkarsh9891.github.io

Source for **[utkarsh9891.github.io](https://utkarsh9891.github.io)** — Utkarsh Upadhyay’s personal GitHub Pages site.

## What you’ll find here

- A simple **home page** with contact links (email, LinkedIn, GitHub).
- A **Notes** section with short, informal blurbs.
- An **Apps & tools** grid that highlights:
  - **[PackageSync](https://packagecontrol.io/packages/PackageSync)** — a Sublime Text package (listed on [Package Control](https://packagecontrol.io/packages/PackageSync)) for syncing packages and user settings across machines.
  - **CandleScan** — placeholder for a future trading-insights mini app under this site.
  - A link to **GitHub** for code and repos.

The live site is static HTML, CSS, and a small script; there is no build step.

## Repository layout

| Path | Purpose |
|------|--------|
| `index.html` | Page markup, notes, embedded JSON fallback for the app grid |
| `apps.json` | Data for the Apps & tools cards (used when the site is served over HTTP) |
| `js/site.js` | Renders the grid from `apps.json`, with fallback to `#app-manifest` in `index.html` |
| `css/style.css` | Layout and theme |
| `img/` | Favicons |

## For contributors / future you

**Local preview (matches production):** from the repo root:

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080/`.

**Opening `index.html` as a file:** browsers may block loading `apps.json`; the page then uses the JSON inside `<script type="application/json" id="app-manifest">` in `index.html`. After you change `apps.json`, copy the same `items` array into that script if you want file-based preview to stay in sync.

**New mini app on Pages:** add a folder with an `index.html` at the repo root, then add an entry to `apps.json` with `"path": "your-folder/"` and `"status": "live"`.

**Card fields (summary):** `title`, `description`, `status` (`live` | `placeholder`), optional `path` (site subdirectory), optional `href` (external URL — used for PackageSync → Package Control), `kind` (`tool` | `link` | other), optional `tags`, `icon` (`sync` | `github` | `candle`), optional `featured` — if `true`, that card spans two columns on wider layouts (intentionally wider than the others).

The layout also uses a minimum row height so cards in the same row share height and short descriptions do not look oddly small next to taller neighbours.

---

*If you landed here from the website: welcome. If you’re browsing the repo on GitHub, the table above is what this project is for.*
