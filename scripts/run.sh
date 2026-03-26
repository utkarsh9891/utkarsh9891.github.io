#!/bin/sh
# Start the local dev server. See README.md.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8080}"

if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js: https://nodejs.org"
  exit 1
fi

echo ""
echo "  ============================================"
echo "  OPEN IN YOUR BROWSER:"
echo "  http://127.0.0.1:${PORT}/"
echo "  http://127.0.0.1:${PORT}/?local=1  (dev manifest)"
echo "  ============================================"
echo "  Stop with Ctrl+C"
echo ""

cd "$ROOT"
export PORT
exec node "$ROOT/scripts/local-dev-server.mjs"
