-- Migration: Orders, order items, and staff portal access
-- Run AFTER 000, 001, 002 in Supabase SQL Editor.

-- ---------------------------------------------------------------------------
-- Staff allowlist (front desk / kitchen portal)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_allowlist (
    email TEXT PRIMARY KEY
);

INSERT INTO public.staff_allowlist (email)
VALUES ('abdullahi.feti23@gmail.com')
ON CONFLICT (email) DO NOTHING;

REVOKE ALL ON public.staff_allowlist FROM PUBLIC;
REVOKE ALL ON public.staff_allowlist FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.staff_allowlist s
        WHERE lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Order status enum
-- ---------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM (
        'pending_payment',
        'paid',
        'accepted',
        'preparing',
        'ready',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1000;

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number INTEGER NOT NULL DEFAULT nextval('public.order_number_seq'),
    tx_ref TEXT NOT NULL UNIQUE,
    status public.order_status NOT NULL DEFAULT 'pending_payment',
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    currency TEXT NOT NULL DEFAULT 'ETB',
    chapa_ref TEXT,
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- ---------------------------------------------------------------------------
-- Order items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products (id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, INSERT ON public.order_items TO anon, authenticated;
GRANT UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO postgres, service_role;
GRANT ALL ON public.order_items TO postgres, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.order_number_seq TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Anyone can create a pending order
DROP POLICY IF EXISTS "Anyone can insert pending orders" ON public.orders;
CREATE POLICY "Anyone can insert pending orders" ON public.orders
    FOR INSERT TO anon, authenticated
    WITH CHECK (status = 'pending_payment');

-- Anyone can read orders (uuid acts as secret token for success page)
DROP POLICY IF EXISTS "Anyone can read orders" ON public.orders;
CREATE POLICY "Anyone can read orders" ON public.orders
    FOR SELECT TO anon, authenticated
    USING (true);

-- Staff can update order status
DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
CREATE POLICY "Staff can update orders" ON public.orders
    FOR UPDATE TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Order items: insert with order, read all
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read order items" ON public.order_items;
CREATE POLICY "Anyone can read order items" ON public.order_items
    FOR SELECT TO anon, authenticated
    USING (true);

-- updated_at trigger
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Dev/test payment simulation until Chapa webhook is wired
CREATE OR REPLACE FUNCTION public.simulate_order_payment(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.orders
    SET status = 'paid',
        paid_at = NOW(),
        chapa_ref = 'dev-' || extract(epoch FROM now())::text
    WHERE id = p_order_id
      AND status = 'pending_payment';
END;
$$;

REVOKE ALL ON FUNCTION public.simulate_order_payment(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.simulate_order_payment(uuid) TO anon, authenticated;

-- Enable realtime for staff dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
