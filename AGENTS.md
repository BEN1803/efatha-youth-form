# AGENTS.md — Efatha Youth Form

## Stack

- Next.js 16.2.9 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4 (`@import "tailwindcss"` in CSS, **not** v3 `@tailwind` directives)
- React Compiler enabled via `reactCompiler: true` in next.config.ts
- Supabase (auth + database), jsPDF (server-side PDF generation), recharts (admin charts)

## Developer commands

```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # eslint (flat config: eslint.config.mjs)
```

No typecheck, test, or codegen scripts exist.

## Project structure

```
app/
  page.tsx          — public registration form (Swahili UI), inserts into "candidates" table
  login/page.tsx    — Supabase auth login, redirects to /admin on success
  admin/page.tsx    — dashboard with stats, charts (recharts), PDF download, logout
  api/pdf/route.ts  — GET /api/pdf returns all candidates as PDF (uses service role key)
lib/
  supabaseAdmin.ts  — Supabase admin client (service role key, server-side only)
  supabaseClient.ts — Supabase browser client (anon key, uses @supabase/ssr cookies)
middleware.ts       — route protection: redirects /admin/* to /login if unauthenticated
```

## Supabase clients

- `lib/supabaseAdmin.ts` — uses `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Server-side only (API routes).
- `lib/supabaseClient.ts` — uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` via `createBrowserClient` from `@supabase/ssr` (cookie-based auth, so middleware can read the session). Used by all client components.
- **Cookie auth is required** — the middleware checks cookies for session. Client `createBrowserClient` stores auth in cookies. Regular `createClient` (localStorage) will NOT work with the middleware guard.

## Database

Table `candidates` with columns: `id`, `jina`, `jinsia`, `umri`, `kazi`, `simu`.

## Path alias

`@/*` maps to project root (e.g. `@/lib/supabaseAdmin`).
