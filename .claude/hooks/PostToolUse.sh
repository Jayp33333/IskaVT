#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit): lightweight, non-blocking checks on the one file just changed.
#  - client/src/**/*.ts(x): fast grep checks for project rules (any, hard-coded model URLs,
#    raw fetch, object selectors on useWorld, secret-looking VITE_* vars).
#  - backend/**/*.js: node --check syntax validation.
#  - client/public/models/**: reminder that model files need user approval.
# Never modifies files. Always exits 0 (advisory only).
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
INPUT="$(cat)"

FILE="$(printf '%s' "$INPUT" | node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
  try{const j=JSON.parse(s);process.stdout.write((j.tool_input&&(j.tool_input.file_path||j.tool_input.path))||"");}catch{}
});')"
[ -z "$FILE" ] && exit 0

REL="$(printf '%s' "$FILE" | tr '\\' '/' | sed -E 's#^.*/iska-vt/##')"
MSG=""

case "$REL" in
  client/public/models/*)
    MSG="Reminder: $REL is a model file. Changes under client/public/models need explicit user approval and a modelRegistry.ts/PWA-cache check."
    ;;
  client/src/*)
    case "$REL" in *.ts|*.tsx) ;; *) exit 0 ;; esac
    # Fast project-rule checks (full ESLint takes ~13s per file, so it runs in /test and /build instead).
    F="$ROOT/$REL"
    [ -f "$F" ] || exit 0
    OUT=""
    n=$(grep -cE ':[[:space:]]*any\b|as any\b|<any>' "$F")
    [ "$n" -gt 0 ] && OUT="$OUT
- $n use(s) of 'any' (lint error no-explicit-any) - don't add new ones."
    case "$REL" in
      client/src/data/modelRegistry.ts) ;;
      *) grep -nE '["'"'"'`]\.?/?models/[^"'"'"'`]*\.(glb|gltf|vrm)' "$F" >/dev/null && OUT="$OUT
- Hard-coded model URL: use MODEL_PATHS from data/modelRegistry.ts." ;;
    esac
    case "$REL" in
      client/src/services/*) ;;
      *) grep -nE '\bfetch\(' "$F" >/dev/null && OUT="$OUT
- Raw fetch(): API calls belong in src/services/*Api.ts via apiClient.ts." ;;
    esac
    grep -nE 'useWorld\(\(?[a-z]+(: any)?\)? => \(\{' "$F" >/dev/null && OUT="$OUT
- Object selector on useWorld re-renders on every store change; use single-value selectors or useShallow."
    grep -nE 'VITE_[A-Z_]*(PASSWORD|SECRET|TOKEN|KEY)' "$F" >/dev/null && OUT="$OUT
- Secret-looking VITE_* variable: VITE_* values are public in the bundle."
    [ -n "$OUT" ] && MSG="Project-rule check on $REL (may include pre-existing issues; fix ones you introduced):$OUT"
    ;;
  backend/*.js|backend/*/*.js)
    OUT="$(node --check "$ROOT/$REL" 2>&1)" || MSG="node --check failed for $REL:
$OUT"
    ;;
esac

[ -z "$MSG" ] && exit 0
printf '%s' "$MSG" | node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
  process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:s}}));
});'
exit 0
