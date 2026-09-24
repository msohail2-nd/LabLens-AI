# LabLens AI

LabLens AI is a researcher-focused landing page and beta waitlist for an AI-assisted laboratory record-continuity platform.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/lablens-ai run dev` — run the landing page
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Landing page: `artifacts/lablens-ai`
- Beta signup API: `artifacts/api-server/src/routes/beta-signups.ts`
- API contract: `lib/api-spec/openapi.yaml`
- Database schema: `lib/db/src/schema/beta-signups.ts`

## Architecture decisions

- The public site stays focused on beta validation; it intentionally has no pricing.
- Beta submissions are validated through generated OpenAPI types and persisted in PostgreSQL.
- Duplicate emails receive a clear conflict response rather than creating repeated records.

## Product

- Responsive single-page marketing experience with accessible anchor navigation
- Scientific experiment-record product preview
- Research integrity and researcher-control messaging
- Working beta signup with validation, loading, success, duplicate, and error states

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
