-- Seed: Messanta existing menu (categories + products)
-- Run AFTER migrations 000–004 in Supabase SQL Editor.
-- Safe to re-run: only inserts if category/product name is missing.
-- Does NOT delete or replace existing rows.
--
-- Local images use site-root paths (/Macchiato.webp) from the app's public/ folder.
-- Remote images keep their existing CDN URLs.
-- After you upload legacy files to Storage (optional), you can update URLs in Admin.

-- ---------------------------------------------------------------------------
-- Categories (adds Food + Healthy Shakes for the new photos)
-- ---------------------------------------------------------------------------
INSERT INTO public.categories (name, description, "order")
SELECT v.name, v.description, v.ord
FROM (VALUES
  ('Hot Drinks', 'Warm beverages to comfort your soul', 1),
  ('Cold Drinks', 'Refreshing beverages for any time', 2),
  ('Mojitos', 'Fresh and fruity mocktails', 3),
  ('Smoothies & Juices', 'Healthy and delicious smoothies', 4),
  ('Cakes & Pastries', 'Sweet treats and desserts', 5),
  ('Food', 'Savory plates, sandwiches, and breakfast', 6),
  ('Healthy Shakes', 'Nutritious shakes and wellness bowls', 7)
) AS v(name, description, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories c WHERE lower(c.name) = lower(v.name)
);

-- ---------------------------------------------------------------------------
-- Hot Drinks
-- ---------------------------------------------------------------------------
INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Macchiato', 'Rich espresso with a dollop of steamed milk', 140, '/Macchiato.webp', ARRAY['/Macchiato.webp'], c.id
FROM public.categories c WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'macchiato');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Espresso', 'Pure, intense Espresso experience', 90, '/Espresso.webp', ARRAY['/Espresso.webp'], c.id
FROM public.categories c WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'espresso');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Messanta Tea', 'Pure, intense House Special Tea experience', 185, '/messanta-tea.webp', ARRAY['/messanta-tea.webp'], c.id
FROM public.categories c WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'messanta tea');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Hot Caramel', 'Rich and creamy Caramel drink', 230, '/hot-caramel.webp', ARRAY['/hot-caramel.webp'], c.id
FROM public.categories c WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'hot caramel');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Espresso Tea', 'Strong tea with espresso notes', 100,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Espresso-Tea-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Espresso-Tea-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'espresso tea');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Tea with Spices', 'Tea with cinnamon, cardamom, and clove seeds', 120,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Tea-with-spices-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Tea-with-spices-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'tea with spices');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Lemon Tea', 'Refreshing tea with fresh lemon', 100,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Lemon-Tea-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Lemon-Tea-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'lemon tea');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Herbal Tea', 'English Breakfast, Chamomile, Darjeeling, Earl Grey, Fennel', 120,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Herbal-Tea-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Herbal-Tea-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'herbal tea');

-- ---------------------------------------------------------------------------
-- Cold Drinks
-- ---------------------------------------------------------------------------
INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Caramel Iced Latte', 'Smooth coffee with caramel syrup and milk over ice', 270, '/Caramel.webp', ARRAY['/Caramel.webp'], c.id
FROM public.categories c WHERE c.name = 'Cold Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'caramel iced latte');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Chocolate Iced Latte', 'Smooth coffee with chocolate syrup and milk over ice', 270, '/Chocolate.webp', ARRAY['/Chocolate.webp'], c.id
FROM public.categories c WHERE c.name = 'Cold Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'chocolate iced latte');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Iced Coffee', 'Cold coffee served over ice', 170, '/iced-coffee.webp', ARRAY['/iced-coffee.webp'], c.id
FROM public.categories c WHERE c.name = 'Cold Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'iced coffee');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Iced Tea', 'Cold tea served over ice', 135, '/iced-tea.webp', ARRAY['/iced-tea.webp'], c.id
FROM public.categories c WHERE c.name = 'Cold Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'iced tea');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Iced Latte', 'Cold coffee with milk over ice', 195, '/iced-latte.webp', ARRAY['/iced-latte.webp'], c.id
FROM public.categories c WHERE c.name = 'Cold Drinks'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'iced latte');

-- ---------------------------------------------------------------------------
-- Mojitos
-- ---------------------------------------------------------------------------
INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Orange Mojito', 'Fresh orange with mint and soda', 205, '/Orange.webp', ARRAY['/Orange.webp'], c.id
FROM public.categories c WHERE c.name = 'Mojitos'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'orange mojito');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Strawberry Mojito', 'Sweet strawberry with mint and soda', 205, '/Strawberry.webp', ARRAY['/Strawberry.webp'], c.id
FROM public.categories c WHERE c.name = 'Mojitos'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'strawberry mojito');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Pineapple Mojito', 'Tropical pineapple with mint and soda', 205, '/Pineapple.webp', ARRAY['/Pineapple.webp'], c.id
FROM public.categories c WHERE c.name = 'Mojitos'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'pineapple mojito');

-- ---------------------------------------------------------------------------
-- Smoothies & Juices
-- ---------------------------------------------------------------------------
INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Strawberry Smoothie', 'Fresh strawberry smoothie', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Strawberry-Smoothie-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Strawberry-Smoothie-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'strawberry smoothie');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Mango Smoothie', 'Fresh mango with yogurt, milk, and sugar', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mango-Smoothie-Messanta-1-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mango-Smoothie-Messanta-1-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'mango smoothie');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Pineapple Mango', 'Tropical pineapple and mango blend', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Pineapple-Mango-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Pineapple-Mango-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'pineapple mango');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Dates Smoothie', 'Healthy dates smoothie', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Dates-Smoothie-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Dates-Smoothie-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'dates smoothie');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Date-Flax Smoothie', 'Nutritious dates and flax seed smoothie', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Date-Flax-Smoothie-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Date-Flax-Smoothie-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'date-flax smoothie');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Mixed Juice', 'Fresh mixed fruit juice', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mixed-Juice-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mixed-Juice-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'mixed juice');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Mango Milkshake', 'Creamy mango milkshake', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mango-Milkshake-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mango-Milkshake-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'mango milkshake');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Strawberry Milkshake', 'Sweet strawberry milkshake', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Strawberry-Milkshake-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Strawberry-Milkshake-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'strawberry milkshake');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Beetroot', 'Healthy beetroot juice', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Beetroot-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Beetroot-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'beetroot');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Green Juice', 'Green apple, spinach, milk, and sugar', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Green-Juice-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Green-Juice-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'green juice');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Detox', 'Cleansing detox juice', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Detox-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Detox-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'detox');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Pineapple Celery', 'Refreshing pineapple and celery juice', 200,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Pineapple-Celery-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Pineapple-Celery-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Smoothies & Juices'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'pineapple celery');

-- ---------------------------------------------------------------------------
-- Cakes & Pastries
-- ---------------------------------------------------------------------------
INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Opera', 'Classic French opera cake', 300,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Opera-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Opera-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'opera');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Sacher', 'Traditional Austrian sacher cake', 300,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Sacher-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Sacher-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'sacher');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Red Velvet', 'Classic red velvet cake', 300,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Red-Velvet-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Red-Velvet-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'red velvet');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Carrot Cake', 'Moist carrot cake with cream cheese frosting', 300,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Carrot-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Carrot-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'carrot cake');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Muffin', 'Fresh baked muffin', 300,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Muffin-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Muffin-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'muffin');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Marble Cake', 'Classic marble cake with chocolate and vanilla', 300,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Marble-Cake-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Marble-Cake-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'marble cake');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Chocolate Croissant', 'Buttery croissant with chocolate filling', 300,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Chocolate-Croissant-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Chocolate-Croissant-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'chocolate croissant');

INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Danish', 'Flaky Danish pastry', 300,
  'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Danish-Messanta-scaled.jpg',
  ARRAY['https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Danish-Messanta-scaled.jpg'], c.id
FROM public.categories c WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (SELECT 1 FROM public.products p WHERE lower(p.name) = 'danish');
