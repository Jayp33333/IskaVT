#!/usr/bin/env bash
# PreCompact: save a small snapshot of the working state so SessionStart (source=compact)
# can re-inject it after compaction. Writes only .claude/.session-context.md (git-ignored).
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT" || exit 0
OUT=".claude/.session-context.md"
{
  echo "Saved: $(date '+%Y-%m-%d %H:%M')"
  echo "Branch: $(git branch --show-current 2>/dev/null)"
  echo
  echo "Uncommitted changes (git status --short):"
  git status --short 2>/dev/null | head -40
  echo
  echo "Diff stat:"
  git diff --stat 2>/dev/null | tail -20
  echo
  echo "Standing constraints: no commits unless asked; ask before touching client/public/models or tuned controls;"
  echo "validate client changes with 'yarn build'; explain R3F/three.js reasoning briefly."
} > "$OUT" 2>/dev/null
exit 0
