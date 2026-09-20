-- Migration: Multi-angle product images (carousel)
-- Run AFTER 000–003.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}';

-- Backfill: if image_url is set and image_urls empty, copy it into the array
UPDATE public.products
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND image_url <> ''
  AND (image_urls IS NULL OR cardinality(image_urls) = 0);

COMMENT ON COLUMN public.products.image_urls IS
  'Ordered gallery URLs for product card carousel (primary first).';
