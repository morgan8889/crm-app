---
paths:
  - "src/lib/actions/**/*.ts"
  - "src/middleware.ts"
  - "src/lib/auth.ts"
---

# Security Rules

- All server actions must call `requireAuth()` or `getSession()` before any DB operation
- Never expose user passwords or password hashes in API responses
- Always validate and sanitize form inputs before DB writes
- Use parameterized queries (Prisma handles this) — never raw SQL with string interpolation
- JWT_SECRET must come from environment variable, never hardcoded
- Rate limit auth endpoints in production
