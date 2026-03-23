---
paths:
  - "src/components/**/*.tsx"
  - "src/app/**/*.tsx"
---

# Component Rules

- Server Components by default — only add `"use client"` when using hooks, event handlers, or browser APIs
- UI primitives go in `src/components/ui/` — page-specific components in `src/components/<feature>/`
- Use `cn()` from `@/lib/utils` for conditional class names
- All forms must have loading states (useTransition or useActionState)
- All delete actions must have confirmation dialogs
- All pages that query the DB must have `export const dynamic = "force-dynamic"` as the first line
- Use Tailwind classes only — no inline styles, no CSS modules
- Responsive: every page must work on mobile
