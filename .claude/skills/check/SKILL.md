---
name: check
description: Run all quality gates for the CRM app. Use before committing or opening a PR.
context: fork
disable-model-invocation: true
---

Run all quality gates in order. Fix any failures before proceeding.

1. `npx biome check .` — lint and format check
2. `npx tsc --noEmit` — TypeScript strict check
3. `npm run build` — Next.js build
4. `npx prisma validate` — schema validation
5. Run test suite: `npx vitest run` (if configured)

If any check fails:
- Fix the issue
- Re-run ALL checks from the beginning
- Report results

Output format:
```
✅ biome check — passed
✅ tsc --noEmit — passed
✅ npm run build — passed (X routes)
✅ prisma validate — passed
✅ tests — passed (X/X)
```
