---
name: crud
description: Scaffold a new CRUD entity for the CRM app. Pass the entity name as argument.
context: fork
disable-model-invocation: true
argument-hint: "[entity-name]"
---

# Scaffold CRUD Entity: $ARGUMENTS

Generate all files for a new entity following existing patterns.

## Files to Create

1. **Server Actions** — `src/lib/actions/$0.ts`
   - Follow pattern from `src/lib/actions/contacts.ts`
   - Include: list (with search/pagination), get, create, update, delete
   - All actions must call `requireAuth()`

2. **Pages**
   - `src/app/(app)/$0/page.tsx` — list with search and pagination
   - `src/app/(app)/$0/[id]/page.tsx` — detail view
   - `src/app/(app)/$0/[id]/edit/page.tsx` — edit form
   - `src/app/(app)/$0/new/page.tsx` — create form
   - All pages must have `export const dynamic = "force-dynamic"` as first line

3. **Components** — `src/components/$0/`
   - Form component (using useActionState)
   - Delete button/dialog
   - Search component
   - Pagination component

4. **Tests** — alongside source files

## Conventions
- Import types from `@/types`
- Use existing UI components from `src/components/ui/`
- Follow existing page layout patterns
- Add navigation link to sidebar
