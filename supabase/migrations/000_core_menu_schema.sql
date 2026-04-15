-- Migration: Core menu tables, super-admin allowlist, and RLS
-- Run FIRST in Supabase SQL Editor (before 001 and 002).
--
-- Super admins: rows in admin_allowlist (email must match the Auth user email).
-- Default seed: abdullahi.feti23@gmail.com — create this user under Authentication > Users.

-- ---------------------------------------------------------------------------
-- Super admin allowlist (add more admins with INSERT into admin_allowlist)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
    email TEXT PRIMARY KEY
);

INSERT INTO public.admin_allowlist (email)
VALUES ('abdullahi.feti23@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- No direct API access; super-admin checks use SECURITY DEFINER only
REVOKE ALL ON public.admin_allowlist FROM PUBLIC;
REVOKE ALL ON public.admin_allowlist FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_allowlist a
        WHERE lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- updated_at trigger helper (shared with daily_* tables in 001)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Menu tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    category_id UUID NOT NULL REFERENCES public.categories (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);

-- API access: public reads menu; authenticated may write only when is_super_admin() (RLS)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.categories TO postgres, service_role;
GRANT ALL ON public.products TO postgres, service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Categories: public menu read; writes only for super admins
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
CREATE POLICY "Allow public read access on categories" ON public.categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Super admin insert categories" ON public.categories;
CREATE POLICY "Super admin insert categories" ON public.categories
    FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admin update categories" ON public.categories;
CREATE POLICY "Super admin update categories" ON public.categories
    FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admin delete categories" ON public.categories;
CREATE POLICY "Super admin delete categories" ON public.categories
    FOR DELETE TO authenticated USING (public.is_super_admin());

-- Products: public menu read; writes only for super admins
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Super admin insert products" ON public.products;
CREATE POLICY "Super admin insert products" ON public.products
    FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admin update products" ON public.products;
CREATE POLICY "Super admin update products" ON public.products
    FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admin delete products" ON public.products;
CREATE POLICY "Super admin delete products" ON public.products
    FOR DELETE TO authenticated USING (public.is_super_admin());

-- updated_at triggers
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
