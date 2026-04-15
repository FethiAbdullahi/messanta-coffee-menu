-- Migration: Create storage bucket for product images
-- Prerequisite: run 000_core_menu_schema.sql first (public.is_super_admin).
-- Run in Supabase SQL Editor (Dashboard > SQL Editor).

-- Insert the storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public read access to images
CREATE POLICY "Allow public read access on product-images" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-images');

-- Super admin only (requires 000_core_menu_schema.sql first for public.is_super_admin)
DROP POLICY IF EXISTS "Allow authenticated users to upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Super admin upload product-images" ON storage.objects;
CREATE POLICY "Super admin upload product-images" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_super_admin());

DROP POLICY IF EXISTS "Allow authenticated users to update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Super admin update product-images" ON storage.objects;
CREATE POLICY "Super admin update product-images" ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_super_admin());

DROP POLICY IF EXISTS "Allow authenticated users to delete product-images" ON storage.objects;
DROP POLICY IF EXISTS "Super admin delete product-images" ON storage.objects;
CREATE POLICY "Super admin delete product-images" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_super_admin());

