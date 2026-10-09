# Asmaa & Mahmoud — Wedding Invitation

A production-ready interactive invitation built with Next.js App Router, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Supabase, and Zod.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/20261009000000_create_wedding_tables.sql` in the SQL editor (or through the CLI migration workflow).
3. In **Integrations → Data API**, ensure the two tables are exposed if your project uses the new explicit exposure mode.
4. Add the project URL and publishable key to `.env.local`:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The public roles receive **insert only** permission for `wedding_messages`. Row Level Security is enabled, and there are no public `SELECT`, `UPDATE`, or `DELETE` policies. Couple messages therefore remain private in the Supabase dashboard.

## Replaceable assets

- Add the final soundtrack at `public/audio/wedding-theme.mp3`. The invitation remains functional when the file is absent.
- Core event details, asset paths, and section toggles live only in `src/config/wedding.ts`.
- The main painted scene is `public/architecture/citadel-illustrated-scene.webp`.
- The illustrated transparent depth layers are `citadel-gate-layer.webp` and `citadel-tower-layer.webp`.

## Quality checks

```bash
npm run lint
npm run build
npm audit --omit=dev
```

The calendar download is available at `/calendar.ics`; its UTC times correspond to 6:00 PM in `Africa/Cairo` on 2 December 2026.
