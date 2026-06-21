# prey

Chat for digital alchemists — a niche, Discord-style app for creative communities, with a dark glass aesthetic. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Zustand** for client state
- **Framer Motion** for animation
- **Prisma 6** ORM against **Supabase** (Postgres)
- **Lucide** icons, **Space Grotesk** / **JetBrains Mono** type

## Getting started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The UI starts on the landing page and runs off in-memory mock data, so it works with no database configured.

## Database (Supabase + Prisma)

The Prisma schema in [`prisma/schema.prisma`](prisma/schema.prisma) models the core domain — users, servers, channels, messages, reactions, direct messages, and friend requests. Two API routes read from it: `/api/health` (connectivity check) and `/api/servers`.

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → Database → Connection string**, copy both the **pooled** (Transaction, port 6543) and **direct** (Session, port 5432) URIs.
3. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — the pooled URI (append `?pgbouncer=true`); used by the app at runtime.
   - `DIRECT_URL` — the direct URI; used by Prisma for migrations.
4. Push the schema and seed it from the mock data:

```bash
bun run db:push
bun run db:seed
```

`bun run db:generate` regenerates the Prisma client (also runs automatically on install).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Next.js is detected automatically.
3. Add `DATABASE_URL` and `DIRECT_URL` as environment variables (same values as your `.env`).
4. Deploy. `prisma generate` runs on install via the `postinstall` script, so the client is built for the serverless runtime.

After the first deploy, run `bun run db:push` and `bun run db:seed` locally against the same database to create and populate the tables.

## Project layout

```
src/
├── app/
│   ├── api/            # health + servers route handlers
│   ├── globals.css     # palette, glass + motion utilities
│   ├── layout.tsx      # fonts, theme, toaster
│   └── page.tsx        # renders <AppShell />
├── components/
│   ├── ribbon/         # app components + views (DMs, chat, voice, profile, …)
│   └── ui/             # toast primitives
├── hooks/
└── lib/
    ├── db.ts           # Prisma client singleton
    └── ribbon/         # types, mock data, Zustand store
```

`AppShell` is the view router; navigation, messages, friends, settings, and the biolink editor all live in the Zustand store (`src/lib/ribbon/store.ts`).

## Notes

- The interface currently renders from mock data; the Supabase layer and API routes are the foundation for moving that state server-side.
- `bun run lint` and `bun run build` are the checks run before deploying.

## License

MIT
