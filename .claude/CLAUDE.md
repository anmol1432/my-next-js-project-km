# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Commands

Two processes must run concurrently during development:

```bash
npm run convex:dev   # Terminal 1: start Convex local backend
npm run dev          # Terminal 2: start Next.js dev server (port 3000)
```

Other commands:
```bash
npm run build            # Production build
npm run lint             # ESLint
npm run convex:codegen   # Regenerate Convex API types (run after schema changes)
```

## Plan and Review
Before starting work 
write a detailed implementation plan in file name claude/task/Task_Name.md
the goal is give me Reason and list of tasks.Focus on a Minimum MVP avoid overplanning. once the plan is ready please ask me to review it. Dont proceed with the implementation until i have approved the plan.

## While implementing 
As you work, keep the plan updated. After you complete a task append a task, append a detailed description of thr changes you made to the plan.
this ensures that the chnages and next steps are clear and can be easily handed over to other engineers if needed.

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript, Convex (backend/DB), BetterAuth, Tailwind CSS v4, shadcn/ui.

### Data Flow

- **Convex** is the single source of truth for data. React components use Convex hooks (`useQuery`, `useMutation`) directly — there is no separate REST API layer for data fetching.
- **BetterAuth** handles auth sessions at `/api/auth/[...all]`. On signup/update/delete it fires triggers (`convex/auth.ts`) that sync auth users into the `users` Convex table via `authUserId`.
- Client-side auth state comes from `lib/auth-client.ts`; server-side from `lib/auth-server.ts`.

### Key Directories

| Path | Purpose |
|------|---------|
| `convex/` | All backend logic: schema, queries, mutations, auth wiring |
| `convex/betterAuth/` | BetterAuth↔Convex adapter and schema |
| `convex/_generated/` | Auto-generated types — never edit manually |
| `app/(shared-layout)/` | Main app pages with shared layout |
| `app/auth/` | Signin/signup pages |
| `app/schemas/` | Zod schemas for form validation |
| `components/web/` | Feature-level React components |
| `components/ui/` | shadcn/ui primitives |
| `components/providers/` | React context providers (Convex, Auth, Theme) |
| `lib/` | Auth client/server setup and utilities |

### Database Schema (Convex)

- **users**: `authUserId`, `name`, `email`, `createdAt` — indexes on `by_auth_user_id`, `by_email`, `by_createdAt`
- **blogs**: `authorId` (ref → users), `title`, `content`, `createdAt` — index on `by_authorId`

## Environment Variables

Required in `.env.local`:

```
CONVEX_DEPLOYMENT=dev:...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=https://[project].convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://[project].convex.site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_URL=http://localhost:3000
```

`CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` are printed by `npm run convex:dev` on first run.

## Key Conventions

- **Tailwind v4** — uses `@tailwindcss/postcss` plugin; no `tailwind.config.js`. Utility classes work the same but config is in CSS.
- **Path alias** — `@/*` resolves to the project root.
- **shadcn/ui** — New York style, Lucide icons. Add components via `npx shadcn@latest add <component>`.
- After any change to `convex/schema.ts` or Convex function signatures, run `npm run convex:codegen`.
