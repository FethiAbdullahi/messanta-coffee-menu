-- Seed: new menu photos (carousel galleries)
-- Run AFTER 000–004 and 001_seed_existing_menu.sql
-- Add-only / update galleries — does NOT delete products.
-- Images are served from the app public folder: /menu/*.jpg


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Almond Cream Cake', 'Messanta specialty — Almond Cream Cake.', 300, '/menu/almond-cream-cake-1.jpg', ARRAY['/menu/almond-cream-cake-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Almond Cream Cake')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/almond-cream-cake-1.jpg',
  image_urls = ARRAY['/menu/almond-cream-cake-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Almond Cream Cake');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Apple Crumble', 'Messanta specialty — Apple Crumble.', 300, '/menu/apple-crumble-1.jpg', ARRAY['/menu/apple-crumble-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Apple Crumble')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/apple-crumble-1.jpg',
  image_urls = ARRAY['/menu/apple-crumble-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Apple Crumble');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Avocado And Tuna Sandwich', 'Messanta specialty — Avocado And Tuna Sandwich.', 350, '/menu/avocado-and-tuna-sandwich-1.jpg', ARRAY['/menu/avocado-and-tuna-sandwich-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Avocado And Tuna Sandwich')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/avocado-and-tuna-sandwich-1.jpg',
  image_urls = ARRAY['/menu/avocado-and-tuna-sandwich-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Avocado And Tuna Sandwich');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Avocado Pineapple Smoothie', 'Messanta specialty — Avocado Pineapple Smoothie.', 220, '/menu/avocado-pineapple-smoothie-1.jpg', ARRAY['/menu/avocado-pineapple-smoothie-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Healthy Shakes'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Avocado Pineapple Smoothie')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/avocado-pineapple-smoothie-1.jpg',
  image_urls = ARRAY['/menu/avocado-pineapple-smoothie-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Avocado Pineapple Smoothie');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Avocado Toast', 'Messanta specialty — Avocado Toast.', 350, '/menu/avocado-toast-1.jpg', ARRAY['/menu/avocado-toast-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Avocado Toast')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/avocado-toast-1.jpg',
  image_urls = ARRAY['/menu/avocado-toast-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Avocado Toast');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Avocado Toast With Egg Benedict', 'Messanta specialty — Avocado Toast With Egg Benedict.', 350, '/menu/avocado-toast-with-egg-benedict-1.jpg', ARRAY['/menu/avocado-toast-with-egg-benedict-1.jpg', '/menu/avocado-toast-with-egg-benedict-2.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Avocado Toast With Egg Benedict')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/avocado-toast-with-egg-benedict-1.jpg',
  image_urls = ARRAY['/menu/avocado-toast-with-egg-benedict-1.jpg', '/menu/avocado-toast-with-egg-benedict-2.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Avocado Toast With Egg Benedict');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Avocado Toast With Smoked Salmon', 'Messanta specialty — Avocado Toast With Smoked Salmon.', 350, '/menu/avocado-toast-with-smoked-salmon-1.jpg', ARRAY['/menu/avocado-toast-with-smoked-salmon-1.jpg', '/menu/avocado-toast-with-smoked-salmon-2.jpg', '/menu/avocado-toast-with-smoked-salmon-3.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Avocado Toast With Smoked Salmon')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/avocado-toast-with-smoked-salmon-1.jpg',
  image_urls = ARRAY['/menu/avocado-toast-with-smoked-salmon-1.jpg', '/menu/avocado-toast-with-smoked-salmon-2.jpg', '/menu/avocado-toast-with-smoked-salmon-3.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Avocado Toast With Smoked Salmon');


-- Update gallery for existing: Beetroot
UPDATE public.products
SET
  image_url = '/menu/beetroot-1.jpg',
  image_urls = ARRAY['/menu/beetroot-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Beetroot');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Brownie Caramel', 'Messanta specialty — Brownie Caramel.', 300, '/menu/brownie-caramel-1.jpg', ARRAY['/menu/brownie-caramel-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Brownie Caramel')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/brownie-caramel-1.jpg',
  image_urls = ARRAY['/menu/brownie-caramel-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Brownie Caramel');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Caramel Cake', 'Messanta specialty — Caramel Cake.', 300, '/menu/caramel-cake-1.jpg', ARRAY['/menu/caramel-cake-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Caramel Cake')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/caramel-cake-1.jpg',
  image_urls = ARRAY['/menu/caramel-cake-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Caramel Cake');


-- Update gallery for existing: Caramel Iced Latte
UPDATE public.products
SET
  image_url = '/menu/caramel-ice-latte-1.jpg',
  image_urls = ARRAY['/menu/caramel-ice-latte-1.jpg', '/menu/caramel-ice-latte-2.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Caramel Iced Latte');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Caramel Macchiato', 'Messanta specialty — Caramel Macchiato.', 150, '/menu/caramel-macchiato-1.jpg', ARRAY['/menu/caramel-macchiato-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Caramel Macchiato')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/caramel-macchiato-1.jpg',
  image_urls = ARRAY['/menu/caramel-macchiato-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Caramel Macchiato');


-- Update gallery for existing: Carrot Cake
UPDATE public.products
SET
  image_url = '/menu/carrot-cake-1.jpg',
  image_urls = ARRAY['/menu/carrot-cake-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Carrot Cake');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Carrot Juice', 'Messanta specialty — Carrot Juice.', 250, '/menu/carrot-juice-1.jpg', ARRAY['/menu/carrot-juice-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cold Drinks'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Carrot Juice')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/carrot-juice-1.jpg',
  image_urls = ARRAY['/menu/carrot-juice-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Carrot Juice');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Chechebsa', 'Messanta specialty — Chechebsa.', 350, '/menu/chechebsa-1.jpg', ARRAY['/menu/chechebsa-1.jpg', '/menu/chechebsa-2.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Chechebsa')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/chechebsa-1.jpg',
  image_urls = ARRAY['/menu/chechebsa-1.jpg', '/menu/chechebsa-2.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Chechebsa');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Chia Pudding', 'Messanta specialty — Chia Pudding.', 220, '/menu/chia-pudding-1.jpg', ARRAY['/menu/chia-pudding-1.jpg', '/menu/chia-pudding-2.jpg', '/menu/chia-pudding-3.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Healthy Shakes'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Chia Pudding')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/chia-pudding-1.jpg',
  image_urls = ARRAY['/menu/chia-pudding-1.jpg', '/menu/chia-pudding-2.jpg', '/menu/chia-pudding-3.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Chia Pudding');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Chocolate Ball', 'Messanta specialty — Chocolate Ball.', 300, '/menu/chocolate-ball-1.jpg', ARRAY['/menu/chocolate-ball-1.jpg', '/menu/chocolate-ball-2.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Chocolate Ball')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/chocolate-ball-1.jpg',
  image_urls = ARRAY['/menu/chocolate-ball-1.jpg', '/menu/chocolate-ball-2.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Chocolate Ball');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Chocolate Cake', 'Messanta specialty — Chocolate Cake.', 300, '/menu/chocolate-cake-1.jpg', ARRAY['/menu/chocolate-cake-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Chocolate Cake')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/chocolate-cake-1.jpg',
  image_urls = ARRAY['/menu/chocolate-cake-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Chocolate Cake');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Chocolate Cheesecake', 'Messanta specialty — Chocolate Cheesecake.', 300, '/menu/chocolate-cheesecake-1.jpg', ARRAY['/menu/chocolate-cheesecake-1.jpg', '/menu/chocolate-cheesecake-2.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Chocolate Cheesecake')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/chocolate-cheesecake-1.jpg',
  image_urls = ARRAY['/menu/chocolate-cheesecake-1.jpg', '/menu/chocolate-cheesecake-2.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Chocolate Cheesecake');


-- Update gallery for existing: Chocolate Iced Latte
UPDATE public.products
SET
  image_url = '/menu/chocolate-ice-latte-1.jpg',
  image_urls = ARRAY['/menu/chocolate-ice-latte-1.jpg', '/menu/chocolate-ice-latte-2.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Chocolate Iced Latte');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Chocolate Milli Foni', 'Messanta specialty — Chocolate Milli Foni.', 300, '/menu/chocolate-milli-foni-1.jpg', ARRAY['/menu/chocolate-milli-foni-1.jpg', '/menu/chocolate-milli-foni-2.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Chocolate Milli Foni')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/chocolate-milli-foni-1.jpg',
  image_urls = ARRAY['/menu/chocolate-milli-foni-1.jpg', '/menu/chocolate-milli-foni-2.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Chocolate Milli Foni');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Chocolate Swirl Shake', 'Messanta specialty — Chocolate Swirl Shake.', 220, '/menu/chocolate-swirl-shake-1.jpg', ARRAY['/menu/chocolate-swirl-shake-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Healthy Shakes'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Chocolate Swirl Shake')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/chocolate-swirl-shake-1.jpg',
  image_urls = ARRAY['/menu/chocolate-swirl-shake-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Chocolate Swirl Shake');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Classic Cheese Sandwich', 'Messanta specialty — Classic Cheese Sandwich.', 350, '/menu/classic-cheese-sandwich-1.jpg', ARRAY['/menu/classic-cheese-sandwich-1.jpg', '/menu/classic-cheese-sandwich-2.jpg', '/menu/classic-cheese-sandwich-3.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Classic Cheese Sandwich')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/classic-cheese-sandwich-1.jpg',
  image_urls = ARRAY['/menu/classic-cheese-sandwich-1.jpg', '/menu/classic-cheese-sandwich-2.jpg', '/menu/classic-cheese-sandwich-3.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Classic Cheese Sandwich');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Classic Club Sandwich', 'Messanta specialty — Classic Club Sandwich.', 350, '/menu/classic-club-sandwich-1.jpg', ARRAY['/menu/classic-club-sandwich-1.jpg', '/menu/classic-club-sandwich-2.jpg', '/menu/classic-club-sandwich-3.jpg', '/menu/classic-club-sandwich-4.jpg', '/menu/classic-club-sandwich-5.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Classic Club Sandwich')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/classic-club-sandwich-1.jpg',
  image_urls = ARRAY['/menu/classic-club-sandwich-1.jpg', '/menu/classic-club-sandwich-2.jpg', '/menu/classic-club-sandwich-3.jpg', '/menu/classic-club-sandwich-4.jpg', '/menu/classic-club-sandwich-5.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Classic Club Sandwich');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Classic Mini Beef Burger', 'Messanta specialty — Classic Mini Beef Burger.', 350, '/menu/classic-mini-beef-burger-1.jpg', ARRAY['/menu/classic-mini-beef-burger-1.jpg', '/menu/classic-mini-beef-burger-2.jpg', '/menu/classic-mini-beef-burger-3.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Classic Mini Beef Burger')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/classic-mini-beef-burger-1.jpg',
  image_urls = ARRAY['/menu/classic-mini-beef-burger-1.jpg', '/menu/classic-mini-beef-burger-2.jpg', '/menu/classic-mini-beef-burger-3.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Classic Mini Beef Burger');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Coffee', 'Messanta specialty — Coffee.', 150, '/menu/coffee-1.jpg', ARRAY['/menu/coffee-1.jpg', '/menu/coffee-2.jpg', '/menu/coffee-3.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Hot Drinks'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Coffee')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/coffee-1.jpg',
  image_urls = ARRAY['/menu/coffee-1.jpg', '/menu/coffee-2.jpg', '/menu/coffee-3.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Coffee');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Crispy Falafel Tahini Bowl', 'Messanta specialty — Crispy Falafel Tahini Bowl.', 350, '/menu/crispy-falafel-tahini-bowl-1.jpg', ARRAY['/menu/crispy-falafel-tahini-bowl-1.jpg', '/menu/crispy-falafel-tahini-bowl-2.jpg', '/menu/crispy-falafel-tahini-bowl-3.jpg', '/menu/crispy-falafel-tahini-bowl-4.jpg', '/menu/crispy-falafel-tahini-bowl-5.jpg', '/menu/crispy-falafel-tahini-bowl-6.jpg', '/menu/crispy-falafel-tahini-bowl-7.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Crispy Falafel Tahini Bowl')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/crispy-falafel-tahini-bowl-1.jpg',
  image_urls = ARRAY['/menu/crispy-falafel-tahini-bowl-1.jpg', '/menu/crispy-falafel-tahini-bowl-2.jpg', '/menu/crispy-falafel-tahini-bowl-3.jpg', '/menu/crispy-falafel-tahini-bowl-4.jpg', '/menu/crispy-falafel-tahini-bowl-5.jpg', '/menu/crispy-falafel-tahini-bowl-6.jpg', '/menu/crispy-falafel-tahini-bowl-7.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Crispy Falafel Tahini Bowl');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Croissant With Egg Sandwich', 'Messanta specialty — Croissant With Egg Sandwich.', 350, '/menu/croissant-with-egg-sandwich-1.jpg', ARRAY['/menu/croissant-with-egg-sandwich-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Croissant With Egg Sandwich')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/croissant-with-egg-sandwich-1.jpg',
  image_urls = ARRAY['/menu/croissant-with-egg-sandwich-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Croissant With Egg Sandwich');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Cucumber Lemonade', 'Messanta specialty — Cucumber Lemonade.', 250, '/menu/cucumber-lemonade-1.jpg', ARRAY['/menu/cucumber-lemonade-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cold Drinks'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Cucumber Lemonade')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/cucumber-lemonade-1.jpg',
  image_urls = ARRAY['/menu/cucumber-lemonade-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Cucumber Lemonade');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Custard Milli Foni', 'Messanta specialty — Custard Milli Foni.', 300, '/menu/custard-milli-foni-1.jpg', ARRAY['/menu/custard-milli-foni-1.jpg', '/menu/custard-milli-foni-2.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Cakes & Pastries'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Custard Milli Foni')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/custard-milli-foni-1.jpg',
  image_urls = ARRAY['/menu/custard-milli-foni-1.jpg', '/menu/custard-milli-foni-2.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Custard Milli Foni');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Date With Flaxseed', 'Messanta specialty — Date With Flaxseed.', 220, '/menu/date-with-flaxseed-1.jpg', ARRAY['/menu/date-with-flaxseed-1.jpg', '/menu/date-with-flaxseed-2.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Healthy Shakes'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Date With Flaxseed')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/date-with-flaxseed-1.jpg',
  image_urls = ARRAY['/menu/date-with-flaxseed-1.jpg', '/menu/date-with-flaxseed-2.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Date With Flaxseed');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Fetira', 'Messanta specialty — Fetira.', 350, '/menu/fetira-1.jpg', ARRAY['/menu/fetira-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Fetira')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/fetira-1.jpg',
  image_urls = ARRAY['/menu/fetira-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Fetira');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Messanta Brunch Spread', 'Messanta specialty — Messanta Brunch Spread.', 350, '/menu/messanta-brunch-spread-1.jpg', ARRAY['/menu/messanta-brunch-spread-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Messanta Brunch Spread')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/messanta-brunch-spread-1.jpg',
  image_urls = ARRAY['/menu/messanta-brunch-spread-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Messanta Brunch Spread');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Messanta Combo', 'Messanta specialty — Messanta Combo.', 350, '/menu/messanta-combo-1.jpg', ARRAY['/menu/messanta-combo-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Messanta Combo')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/messanta-combo-1.jpg',
  image_urls = ARRAY['/menu/messanta-combo-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Messanta Combo');


INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT 'Shakshuka', 'Messanta specialty — Shakshuka.', 350, '/menu/shakshuka-1.jpg', ARRAY['/menu/shakshuka-1.jpg'], c.id
FROM public.categories c
WHERE c.name = 'Food'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('Shakshuka')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '/menu/shakshuka-1.jpg',
  image_urls = ARRAY['/menu/shakshuka-1.jpg'],
  updated_at = NOW()
WHERE lower(name) = lower('Shakshuka');

