#!/bin/sh
# Build CandleScan and copy dist/ into ./candlescan/ for GitHub Pages.
# Source repo: CANDLESCAN_DIR, or "candlescan" row in local.apps.paths, else ../candlescan
# Usage: from utkarsh9891.github.io root — npm run publish:candlescan
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="$ROOT/local.apps.paths"

trim() {
  echo "$1" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

resolve_src() {
  if [ -n "${CANDLESCAN_DIR:-}" ]; then
    printf '%s' "$CANDLESCAN_DIR"
    return
  fi
  if [ -f "$CONFIG" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
      case "$line" in
        \#*|'') continue ;;
      esac
      line="${line%%#*}"
      line="$(trim "$line")"
      [ -z "$line" ] && continue
      case "$line" in
        *"	"*)
          name="${line%%	*}"
          path="${line#*	}"
          ;;
        *)
          name="${line%% *}"
          path="${line#* }"
          ;;
      esac
      name="$(trim "$name")"
      path="$(trim "$path")"
      if [ "$name" = "candlescan" ] && [ -n "$path" ]; then
        case "$path" in
          ~/*) path="${HOME}/${path#~/}" ;;
          ~) path="$HOME" ;;
        esac
        printf '%s' "$path"
        return
      fi
    done < "$CONFIG"
  fi
  printf '%s' "$ROOT/../candlescan"
}

SRC="$(resolve_src)"
if [ ! -d "$SRC" ]; then
  echo "error: CandleScan source not found: $SRC"
  echo "Set CANDLESCAN_DIR or add a candlescan row to local.apps.paths"
  exit 1
fi
SRC="$(cd "$SRC" && pwd)"

if [ ! -f "$SRC/package.json" ]; then
  echo "error: not a Node project: $SRC"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "error: npm not found — install Node.js from https://nodejs.org"
  exit 1
fi

echo ">>> Building CandleScan in: $SRC"
(
  cd "$SRC"
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
  npm run build
)

if [ ! -f "$SRC/dist/index.html" ]; then
  echo "error: build produced no dist/index.html"
  exit 1
fi

echo ">>> Copying dist/ → $ROOT/candlescan/"
rm -rf "$ROOT/candlescan"
mkdir -p "$ROOT/candlescan"
cp -R "$SRC/dist/." "$ROOT/candlescan/"

echo ""
echo "Done. CandleScan is ready under ./candlescan/"
echo ""
echo "Commit and push this repo (typically master for user Pages):"
echo "  cd \"$ROOT\""
echo "  git add candlescan"
echo "  git status"
echo "  git commit -m \"chore: deploy CandleScan\""
echo "  git push origin master"
echo ""
