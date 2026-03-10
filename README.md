# JavaScript Workspace

JavaScript Workspace adalah **platform pembelajaran** untuk ekosistem JavaScript.

Analogi utamanya:

- **JavaScript Learning Hub** = perpustakaan (koleksi buku/materi).
- **JavaScript Workspace** = gedung/platform belajar (pengalaman belajar + operasional).

Learning Hub menyimpan ilmu. Workspace menyajikan pengalaman belajarnya.

## Tech Stack

- Framework: Next.js
- Language: JavaScript + JSX
- Styling: Tailwind CSS
- UI Components: shadcn/ui foundations
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Auth.js
- Validation: Zod
- Monorepo: pnpm workspace

## Monorepo Structure

```text
javascript-workspace/
|-- apps/
|   `-- web/                  # frontend + backend route handlers (Next.js app/api)
|-- packages/
|   |-- db/                   # prisma schema + prisma client wrapper
|   |-- schemas/              # zod schemas lintas layer
|   `-- ui/                   # komponen UI foundation (shadcn style)
|-- docs/
|   `-- architecture.md
|-- .env.example
|-- package.json
`-- pnpm-workspace.yaml
```

## Development Commands

```bash
pnpm install
pnpm dev
```

Database commands:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

## Environment

Salin `.env.example` menjadi `.env`, lalu isi nilai yang valid:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `LEARNING_HUB_PATH` (opsional, untuk override path source materi)

## Current Status

- Fondasi monorepo sudah dibuat.
- App Next.js `apps/web` sudah aktif.
- Package `db`, `schemas`, dan `ui` sudah tersedia sebagai baseline.
- Endpoint backend awal tersedia di `GET /api/health`.
- Halaman katalog buku tersedia di `/books`.
- Halaman detail materi per buku tersedia di `/books/[bookId]`.

## Local Setup Checklist

1. Buat database PostgreSQL lokal.
2. Salin `.env.example` ke `.env`, isi kredensial yang valid.
3. Jalankan:

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```
