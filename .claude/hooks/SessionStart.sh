#!/usr/bin/env bash
# SessionStart: print a short project/environment summary into Claude's context.
# Fast (<1s), read-only. Never prints secret values.
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT" || exit 0
INPUT="$(cat 2>/dev/null)"

echo "## IskaVT session context"
echo "- Branch: $(git branch --show-current 2>/dev/null || echo unknown)"
changed=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
echo "- Uncommitted files: ${changed}"
echo "- Node: $(node --version 2>/dev/null || echo 'not found') | yarn: $(yarn --version 2>/dev/null || echo 'not found')"

[ -d client/node_modules ] || echo "- WARNING: client/node_modules missing -> run 'yarn' in client/"
[ -d backend/node_modules ] || echo "- WARNING: backend/node_modules missing -> run 'yarn' in backend/"
if [ -f backend/.env ]; then echo "- backend/.env present (do not read or print it)"; else echo "- backend/.env missing: backend can't connect to MongoDB locally"; fi

echo "- Baseline: client 'yarn build' passes (~3 min); 'yarn lint' has many pre-existing errors (mostly no-explicit-any) - don't add new ones."
echo "- No test suite. Never commit unless asked. Ask before touching client/public/models or tuned control values."

# After a compaction, re-inject the snapshot PreCompact saved.
if printf '%s' "$INPUT" | grep -q '"source"[[:space:]]*:[[:space:]]*"compact"' && [ -f .claude/.session-context.md ]; then
  echo
  echo "## Snapshot saved before last compaction"
  cat .claude/.session-context.md
fi
exit 0
