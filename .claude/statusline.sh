#!/usr/bin/env bash
# Status line: model | branch (+uncommitted count) | current folder within the repo.
INPUT="$(cat)"
MODEL="$(printf '%s' "$INPUT" | grep -o '"display_name"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')"
CWD="$(printf '%s' "$INPUT" | grep -o '"current_dir"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/' | sed 's#\\\\#/#g')"
DIR="$(printf '%s' "$CWD" | sed -E 's#^.*/iska-vt/?#iska-vt/#')"
BRANCH="$(git -C "${CWD:-.}" branch --show-current 2>/dev/null)"
DIRTY="$(git -C "${CWD:-.}" status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
[ "$DIRTY" != "0" ] && BRANCH="$BRANCH +$DIRTY"
printf '%s | %s | %s' "${MODEL:-Claude}" "${BRANCH:-no-git}" "${DIR:-iska-vt}"
