# Arsitektur Awal

## Prinsip

- Monorepo tunggal dengan `pnpm workspace`.
- Satu app Next.js sebagai host frontend + backend route handlers.
- Backend domain dipisah ke package reusable (`db`, `schemas`, `ui`).

## Struktur

```text
javascript-workspace/
|-- apps/
|   `-- web/                  # Next.js app (frontend + app/api backend endpoints)
|-- packages/
|   |-- db/                   # Prisma schema + Prisma client wrapper
|   |-- schemas/              # Zod schemas shared
|   `-- ui/                   # UI components foundation (shadcn-style)
|-- docs/
|   `-- architecture.md
|-- package.json
`-- pnpm-workspace.yaml
```

## Boundary

- `apps/web` hanya konsumsi API, schemas, dan db client wrapper.
- `packages/db` tidak bergantung ke `apps/*`.
- `packages/schemas` tidak bergantung ke Next.js atau database.
- `packages/ui` hanya berisi komponen presentasional yang bisa dipakai lintas app.
