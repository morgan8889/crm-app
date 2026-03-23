---
name: dev
description: Development workflow for implementing a feature. Use when starting work on a ticket.
context: fork
disable-model-invocation: true
---

# Development Workflow

Follow this workflow for every feature implementation:

## 1. Understand
- Read the ticket/requirements in $ARGUMENTS
- Identify affected files and models
- Check existing patterns in similar features

## 2. Plan
- List files to create/modify
- Identify test cases needed
- Check for schema changes needed

## 3. Implement with TDD
- Write test first (or alongside)
- Implement the feature
- Run tests after each significant change: `npx vitest run`

## 4. Verify
- Start dev server: `npm run dev`
- Test affected routes manually
- Check responsive layout

## 5. Quality Gates
- Run `/check` to verify all gates pass
- Fix any failures

## 6. Code Review
- Run `/code-review` locally
- Fix all critical and medium findings
- Re-run until clean

## 7. Commit
- `npx biome check --write .` to auto-fix formatting
- Stage changes: `git add -A`
- Conventional commit: `git commit -m "feat: <description>"`
- Push branch: `git push origin <branch>`
