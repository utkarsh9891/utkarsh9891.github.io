#!/bin/sh
# Build every mini-app listed in local.apps.paths, copy into this site, serve locally.
# No git pull on app sources — only your local trees. See README.md.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8080}"
CONFIG="$ROOT/local.apps.paths"

expand_tilde() {
  p="$1"
  case "$p" in
    ~/*) printf '%s' "${HOME}/${p#~/}" ;;
    ~) printf '%s' "$HOME" ;;
    *) printf '%s' "$p" ;;
  esac
}

trim() {
  echo "$1" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

# build_mini_app <site_subdir> <source_path>
build_mini_app() {
  target="$1"
  src="$2"
  src="$(expand_tilde "$src")"
  src="$(trim "$src")"
  if [ ! -d "$src" ]; then
    echo "error: [$target] source folder not found: $src"
    exit 1
  fi
  src="$(cd "$src" && pwd)"

  echo ">>> [$target] ← $src"

  if [ -f "$src/package.json" ]; then
    if ! command -v npm >/dev/null 2>&1; then
      echo "Install Node.js: https://nodejs.org"
      exit 1
    fi
    (cd "$src" && npm install && npm run build)
    if [ ! -f "$src/dist/index.html" ]; then
      echo "error: [$target] expected dist/index.html after npm run build"
      exit 1
    fi
    rm -rf "$ROOT/$target"
    mkdir -p "$ROOT/$target"
    cp -R "$src/dist/." "$ROOT/$target/"
  elif [ -f "$src/index.html" ]; then
    rm -rf "$ROOT/$target"
    mkdir -p "$ROOT/$target"
    cp -R "$src/." "$ROOT/$target/"
  else
    echo "error: [$target] need package.json (npm/vite app) or index.html (static) in: $src"
    exit 1
  fi
}

if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js: https://nodejs.org"
  exit 1
fi

if [ -d "$ROOT/.git" ]; then
  echo ">>> Updating this site (git pull)..."
  git -C "$ROOT" pull --ff-only 2>/dev/null || echo "    (skipped)"
fi

BUILT_COUNT=0
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
    if [ -z "$name" ] || [ -z "$path" ]; then
      continue
    fi
    case "$name" in
      *[!a-zA-Z0-9_-]*)
        echo "error: invalid site folder name (use letters, digits, -, _): $name"
        exit 1
        ;;
    esac
    build_mini_app "$name" "$path"
    BUILT_COUNT=$((BUILT_COUNT + 1))
  done < "$CONFIG"
fi

if [ "$BUILT_COUNT" -eq 0 ]; then
  if [ -f "$CONFIG" ]; then
    echo "error: local.apps.paths has no app rows (add name + path lines)."
    exit 1
  fi
  echo ">>> No local.apps.paths — using default ../candlescan"
  def="${CANDLESCAN_DIR:-$ROOT/../candlescan}"
  build_mini_app candlescan "$def"
  BUILT_COUNT=1
fi

echo ""
echo "  ============================================"
echo "  OPEN IN YOUR BROWSER:"
echo "  http://127.0.0.1:${PORT}/?local=1"
echo "  --- mini-apps ---"
if [ "$BUILT_COUNT" -gt 0 ] && [ -f "$CONFIG" ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      \#*|'') continue ;;
    esac
    line="${line%%#*}"
    line="$(trim "$line")"
    [ -z "$line" ] && continue
    case "$line" in
      *"	"*)
        n="${line%%	*}"
        p="${line#*	}"
        ;;
      *)
        n="${line%% *}"
        p="${line#* }"
        ;;
    esac
    n="$(trim "$n")"
    p="$(trim "$p")"
    if [ -z "$n" ] || [ -z "$p" ]; then
      continue
    fi
    echo "  http://127.0.0.1:${PORT}/${n}/"
  done < "$CONFIG"
else
  echo "  http://127.0.0.1:${PORT}/candlescan/"
fi
echo "  ============================================"
echo "  Stop with Ctrl+C"
echo ""

cd "$ROOT"
export PORT
exec node "$ROOT/scripts/local-dev-server.mjs"
