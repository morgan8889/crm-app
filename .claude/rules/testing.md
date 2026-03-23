---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Testing Rules

- Write tests alongside implementation — TDD preferred
- Test framework: Vitest + React Testing Library
- Test files: `<name>.test.ts` or `<name>.test.tsx` next to source file
- Server actions: test validation, auth checks, and DB operations
- Components: test rendering, user interactions, form submissions
- Minimum: every server action must have tests for success case, validation failure, and auth failure
