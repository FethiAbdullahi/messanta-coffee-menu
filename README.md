# Messanta Coffee Menu

Digital menu, cart ordering, staff orders desk, and admin menu studio for Messanta Coffee (Addis Ababa).

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend:** Supabase (Postgres, Auth, RLS, Storage)
- **Deploy:** Vercel-ready (`npm run build`)

## Quick start

```bash
npm install
cp env.example .env
# Fill VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ADMIN_PASSWORD, VITE_ADMIN_EMAIL
npm run dev
```

| Route | Purpose |
|-------|---------|
| `/` | Public menu |
| `/category/:id` | Category page |
| `/admin` | Menu Studio (prices, products, discounts) |
| `/orders` | Staff orders desk |
| `/order/:id` | Customer order / checkout |

## Environment

Copy `env.example` → `.env` (never commit `.env`):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_PASSWORD="your-password"
VITE_ADMIN_EMAIL=admin@example.com
```

Admin password must match the Supabase Auth user password for `VITE_ADMIN_EMAIL`, and that email must be in `admin_allowlist` (see migrations). Quotes are required if the password contains `#`.

## Supabase setup

Run in **SQL Editor**, in order:

1. `supabase/migrations/000_core_menu_schema.sql`
2. `supabase/migrations/001_add_discounts_specials.sql`
3. `supabase/migrations/002_storage_bucket.sql`
4. `supabase/migrations/003_orders.sql`
5. `supabase/migrations/004_image_urls.sql`
6. `supabase/seed/001_seed_existing_menu.sql` (existing menu)
7. `supabase/seed/002_seed_new_photos.sql` (new photo products, optional)

Details: `supabase/README.md`

Create the admin user under **Authentication → Users** with the same email/password as `.env`.

## Project layout

```
src/
  pages/          # Routes (menu, admin, orders, checkout)
  components/     # UI pieces (Header, ProductCard, cart, …)
  context/        # Cart state
  hooks/          # Data + admin auth
  lib/            # Supabase client, orders, utils
  data/           # Offline demo fallback menu
  types/          # Shared TypeScript types
public/
  menu/           # Product images served at /menu/...
  messenta-admin-logo.png   # Admin-only mark
  Messenta.png              # Public site wordmark
scripts/          # One-off tooling (photos, QR, seed checks)
supabase/
  migrations/     # Schema + RLS
  seed/           # Menu seed SQL
docs/             # Extra notes (e.g. Telebirr API)
menu-photos/      # Drop new shoot photos here (gitignored); see README inside
```

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Local Vite server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `node scripts/process-menu-photos.mjs` | Resize/copy drop photos → `public/menu/` |
| `node scripts/verify-menu-seed.mjs` | Sanity-check seed SQL vs images |
| `node scripts/generate-print-qr.mjs` | Printable QR assets |

## Deploy (Vercel)

Vite bakes `VITE_*` into the build. In Vercel → Project → **Settings → Environment Variables**, set all of these for **Production** (then **Redeploy**):

| Variable | Required |
|----------|----------|
| `VITE_SUPABASE_URL` | Yes — same project as local `.env` |
| `VITE_SUPABASE_ANON_KEY` | Yes |
| `VITE_ADMIN_PASSWORD` | Yes — quote if it contains `#` |
| `VITE_ADMIN_EMAIL` | Yes — must match Supabase Auth user + `admin_allowlist` |

Without the admin vars, `/admin` will not unlock on production even if it works locally.

Menu photos ship in `public/menu/` with the repo so Vercel can serve `/menu/*.jpg`.

**Database:** Deploying the frontend does **not** insert products. Run the SQL seeds in Supabase SQL Editor (same project the env vars point to) if new items are missing.

## Adding new menu photos

1. Put originals in `menu-photos/` (gitignored; keep filenames).
2. Run `node scripts/process-menu-photos.mjs`
3. Update / run seed SQL under `supabase/seed/`
4. Adjust prices in `/admin`

## Notes for the next developer

- Menu writes require a logged-in **super admin** session (RLS). Password-only UI still signs into Supabase Auth.
- Product images live under `public/menu/` until Storage is fully used; paths look like `/menu/avocado-toast-1.jpg`.
- Cart / orders use tables from `003_orders.sql`. Payment (Chapa / Telebirr) is not wired yet — see `docs/telebirr-api-request.md`.
- `dist/` and `node_modules/` are gitignored; do not commit secrets.
