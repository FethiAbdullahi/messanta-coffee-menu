-- Migration: Add daily_discounts and daily_specials tables
-- Prerequisite: run 000_core_menu_schema.sql first (products table + is_super_admin).
-- Run in Supabase SQL Editor (Dashboard > SQL Editor).

-- Create daily_discounts table
CREATE TABLE IF NOT EXISTS daily_discounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    discount_percentage DECIMAL(5,2) DEFAULT NULL,
    discount_amount DECIMAL(10,2) DEFAULT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_discount_type CHECK (
        (discount_percentage IS NOT NULL AND discount_amount IS NULL) OR
        (discount_percentage IS NULL AND discount_amount IS NOT NULL)
    )
);

-- Create daily_specials table
CREATE TABLE IF NOT EXISTS daily_specials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    special_label VARCHAR(100) NOT NULL DEFAULT 'Today''s Special',
    featured_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_discounts_product_id ON daily_discounts(product_id);
CREATE INDEX IF NOT EXISTS idx_daily_discounts_dates ON daily_discounts(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_daily_discounts_active ON daily_discounts(is_active);
CREATE INDEX IF NOT EXISTS idx_daily_specials_product_id ON daily_specials(product_id);
CREATE INDEX IF NOT EXISTS idx_daily_specials_date ON daily_specials(featured_date);
CREATE INDEX IF NOT EXISTS idx_daily_specials_active ON daily_specials(is_active);

-- Enable Row Level Security
ALTER TABLE daily_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_specials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on daily_discounts" ON daily_discounts
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on daily_specials" ON daily_specials
    FOR SELECT USING (true);

-- Write access: super admins only (see 000_core_menu_schema.sql / admin_allowlist)
DROP POLICY IF EXISTS "Allow authenticated users to insert daily_discounts" ON daily_discounts;
DROP POLICY IF EXISTS "Allow authenticated users to update daily_discounts" ON daily_discounts;
DROP POLICY IF EXISTS "Allow authenticated users to delete daily_discounts" ON daily_discounts;
DROP POLICY IF EXISTS "Super admin insert daily_discounts" ON daily_discounts;
DROP POLICY IF EXISTS "Super admin update daily_discounts" ON daily_discounts;
DROP POLICY IF EXISTS "Super admin delete daily_discounts" ON daily_discounts;

CREATE POLICY "Super admin insert daily_discounts" ON daily_discounts
    FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin update daily_discounts" ON daily_discounts
    FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin delete daily_discounts" ON daily_discounts
    FOR DELETE TO authenticated USING (public.is_super_admin());

DROP POLICY IF EXISTS "Allow authenticated users to insert daily_specials" ON daily_specials;
DROP POLICY IF EXISTS "Allow authenticated users to update daily_specials" ON daily_specials;
DROP POLICY IF EXISTS "Allow authenticated users to delete daily_specials" ON daily_specials;
DROP POLICY IF EXISTS "Super admin insert daily_specials" ON daily_specials;
DROP POLICY IF EXISTS "Super admin update daily_specials" ON daily_specials;
DROP POLICY IF EXISTS "Super admin delete daily_specials" ON daily_specials;

CREATE POLICY "Super admin insert daily_specials" ON daily_specials
    FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin update daily_specials" ON daily_specials
    FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin delete daily_specials" ON daily_specials
    FOR DELETE TO authenticated USING (public.is_super_admin());

-- updated_at helper (created in 000; keep idempotent for older projects)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_daily_discounts_updated_at ON daily_discounts;
CREATE TRIGGER update_daily_discounts_updated_at
    BEFORE UPDATE ON daily_discounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_specials_updated_at ON daily_specials;
CREATE TRIGGER update_daily_specials_updated_at
    BEFORE UPDATE ON daily_specials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT ON public.daily_discounts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.daily_discounts TO authenticated;
GRANT ALL ON public.daily_discounts TO postgres, service_role;

GRANT SELECT ON public.daily_specials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.daily_specials TO authenticated;
GRANT ALL ON public.daily_specials TO postgres, service_role;

