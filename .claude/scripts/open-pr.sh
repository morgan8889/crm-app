#!/bin/bash
# open-pr.sh — Create a PR and immediately notify Nick
# Usage: .claude/scripts/open-pr.sh --title "title" --body "body" --head branch --base main
#
# This script ensures the "waiting for CI + review" notification
# is ALWAYS sent immediately after PR creation — never forgotten.

set -e

TITLE=""
BODY=""
HEAD=""
BASE="main"

while [[ $# -gt 0 ]]; do
  case $1 in
    --title) TITLE="$2"; shift 2 ;;
    --body) BODY="$2"; shift 2 ;;
    --head) HEAD="$2"; shift 2 ;;
    --base) BASE="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [ -z "$TITLE" ] || [ -z "$HEAD" ]; then
  echo "Usage: open-pr.sh --title '...' --head branch [--body '...'] [--base main]"
  exit 1
fi

# 1. Create the PR
PR_URL=$(gh pr create \
  --title "$TITLE" \
  --body "${BODY:-"No description provided."}" \
  --head "$HEAD" \
  --base "$BASE" 2>&1)

if [[ ! "$PR_URL" =~ https://github.com ]]; then
  echo "Failed to create PR: $PR_URL"
  exit 1
fi

PR_NUM=$(echo "$PR_URL" | grep -oE '[0-9]+$')
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

echo "✅ PR #$PR_NUM created: $PR_URL"

# 2. Immediately send "waiting" notification — never forget this
openclaw message send \
  --channel telegram \
  --account lovelace \
  --target 7775782519 \
  --message "⏳ PR #$PR_NUM open — waiting for CI + Claude review.

$TITLE

PR: $PR_URL" 2>/dev/null || echo "⚠️  Notification failed — send manually"

echo "📨 Waiting notification sent"
echo "$PR_URL"
