# CLAUDE.md — CRM App

## Project Overview

A Customer Relationship Management web application built with Next.js 15, Prisma ORM, PostgreSQL, Tailwind CSS, and shadcn/ui-style components.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode — all files must pass `tsc --noEmit`)
- **Database:** PostgreSQL via Prisma ORM v7
- **Styling:** Tailwind CSS v4 + shadcn/ui-style components
- **Linting/Formatting:** Biome v2 (NOT ESLint, NOT Prettier)
- **Container:** Docker + Docker Compose

## Project Structure

```
src/
├── app/          # Next.js App Router pages and layouts
├── components/   # Reusable React components
│   └── ui/       # Low-level UI components (shadcn/ui style)
├── lib/          # Utility functions and client singletons
└── types/        # TypeScript type definitions and re-exports
prisma/
└── schema.prisma # Database schema
```

## Architecture Rules

- **Server Components by default** — only use `"use client"` when needed (event handlers, hooks)
- **shadcn/ui patterns** — UI components go in `src/components/ui/`, page-level components in `src/components/`
- **Prisma client singleton** — always import from `@/lib/prisma`, never instantiate directly
- **No direct DB calls in components** — database queries go in Server Components or API routes only
- **`cn()` utility** — always use `cn()` from `@/lib/utils` for conditional class names

## Coding Conventions

- All imports use `@/` path alias for `src/` directory
- File naming: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- Component naming: PascalCase
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- No `any` types — use proper TypeScript types or Prisma-generated types
- Export types from `@/types` rather than importing directly from Prisma where appropriate

## Database

- Connection URL via `DATABASE_URL` env var (read by `prisma.config.ts`)
- After schema changes: run `npx prisma migrate dev` and `npx prisma generate`
- All models use cuid() for IDs and have `createdAt`/`updatedAt` timestamps

## Banned Patterns

- ❌ ESLint or Prettier (use Biome)
- ❌ `import * as` — use named imports
- ❌ Direct `PrismaClient` instantiation — use `@/lib/prisma`
- ❌ Inline styles — use Tailwind classes
- ❌ `any` type — use proper types

## Quality Gates (must pass before PR)

```bash
npm run build         # Zero errors
npx tsc --noEmit      # TypeScript strict pass
npx biome check .     # Biome lint + format pass
npx prisma validate   # Schema valid
docker compose config # Docker config valid
```
