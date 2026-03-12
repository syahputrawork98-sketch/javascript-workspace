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
- Integrasi Learning Hub mengikuti struktur v2: `rak (Rxx) -> buku (Bxx) -> materi`.
- Arsip `v1` dibaca lewat katalog terpisah dan diekspos pada route `/legacy`.

## UI Direction

- Workspace diarahkan menjadi reader layer `JavaScript Focuspace` untuk `JavaScript Learning Hub`.
- Jalur utama UX berfokus pada `V2`, sedangkan `V1` diposisikan sebagai arsip.
- Target pengalaman baca dan wireframe halaman ada di `docs/focuspace-v2-reader-wireframe.md`.
