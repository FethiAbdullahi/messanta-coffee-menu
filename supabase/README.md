# Supabase Setup Instructions

## 1. Run Database Migrations

Go to your Supabase Dashboard → **SQL Editor** and run these files **in order**:

1. **`migrations/000_core_menu_schema.sql`** — Creates `categories`, `products`, `admin_allowlist`, `is_super_admin()`, and row-level security so only super admins can change menu data. Seeds `abdullahi.feti23@gmail.com` as the first super admin.
2. **`migrations/001_add_discounts_specials.sql`** — Creates `daily_discounts` and `daily_specials` (writes restricted to super admins).
3. **`migrations/002_storage_bucket.sql`** — Creates the `product-images` storage bucket (uploads restricted to super admins).

If you already ran older versions of `001` or `002` (when any logged-in user could write), run the updated files again so policies are replaced.

## 2. Super Admin Account

1. Go to **Authentication** → **Providers** and ensure **Email** is enabled.
2. Go to **Authentication** → **Users** → **Add user**.
3. Create a user with email **`abdullahi.feti23@gmail.com`** and a strong password (or use **Invite** and accept the invite with that address).

Only emails listed in **`admin_allowlist`** can insert/update/delete categories, products, discounts, specials, and storage objects for product images. The migration seeds that table with `abdullahi.feti23@gmail.com`.

### Adding More Admins Later

In the SQL Editor (as a privileged user):

```sql
INSERT INTO public.admin_allowlist (email)
VALUES ('other.admin@example.com')
ON CONFLICT (email) DO NOTHING;
```

Then create or invite that user under **Authentication** → **Users** with the same email.

## 3. Environment Variables

In your project `.env`:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Admin Dashboard

After setup, open:

```
http://localhost:5173/admin
```

Sign in with the super admin email and password. Populate **Categories** first, then **Products** (each product needs a `category_id` from your categories).

## 5. Create Storage Bucket Manually (Optional)

If the storage migration fails:

1. Go to **Storage** → **New bucket** → name **`product-images`**, public bucket.
2. Add policies consistent with `002_storage_bucket.sql` (public read; writes only for `is_super_admin()`), or re-run `002` after `000`.
