# CRM App

A Customer Relationship Management web application built with Next.js 15, Prisma ORM, PostgreSQL, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via [Prisma ORM](https://www.prisma.io/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Linting/Formatting:** [Biome](https://biomejs.dev/)
- **Container:** Docker + Docker Compose

## Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local development with PostgreSQL)
- npm

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd crm-app
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work with Docker Compose):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_app"
```

### 3. Start the database

```bash
docker compose up db -d
```

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Running with Docker Compose (Full Stack)

To run both the app and database in Docker:

```bash
docker compose up --build
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run lint:fix` | Auto-fix Biome lint issues |
| `npm run format` | Format code with Biome |
| `npm run type-check` | Run TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard page
│   ├── contacts/           # Contacts page
│   ├── companies/          # Companies page
│   ├── deals/              # Deals pipeline page
│   └── activities/         # Activities page
├── components/             # Reusable components
│   ├── sidebar.tsx         # Navigation sidebar
│   └── ui/                 # shadcn/ui-style components
│       └── button.tsx      # Button component
├── lib/                    # Utility libraries
│   ├── prisma.ts           # Prisma client singleton
│   └── utils.ts            # Helper utilities (cn, etc.)
└── types/                  # TypeScript type exports
    └── index.ts            # Re-exports from Prisma client
prisma/
└── schema.prisma           # Database schema
```

## Database Schema

| Model | Description |
|-------|-------------|
| `User` | App users with role-based access (ADMIN/USER) |
| `Contact` | CRM contacts with company association |
| `Company` | Organizations/companies |
| `Deal` | Sales deals with pipeline stages |
| `Activity` | Calls, emails, meetings, and notes |

## Development

### Code Style

This project uses **Biome** for both linting and formatting (not ESLint or Prettier).

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

### Prisma Schema Changes

After modifying `prisma/schema.prisma`:

```bash
npm run db:migrate    # Create and apply migration
npm run db:generate   # Regenerate Prisma client
```
