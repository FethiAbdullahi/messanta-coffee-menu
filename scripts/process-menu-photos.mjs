/**
 * Groups menu-photos, copies them to public/menu/, writes seed SQL.
 * Run: node scripts/process-menu-photos.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const srcDir = path.join(root, 'menu-photos')
const outDir = path.join(root, 'public', 'menu')
const sqlOut = path.join(root, 'supabase', 'seed', '002_seed_new_photos.sql')

fs.mkdirSync(outDir, { recursive: true })

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Strip (1), (2), leading/trailing spaces, fix known typos */
function baseName(filename) {
  let n = path.basename(filename, path.extname(filename)).trim()
  n = n.replace(/\s*\(\d+\)\s*$/i, '').trim()
  // typos / aliases → canonical product title
  const aliases = {
    'caramel ice lattee': 'Caramel Ice Latte',
    'caramel ice latte': 'Caramel Ice Latte',
    'caramel machiato': 'Caramel Macchiato',
    'avocado toast with egg bendict': 'Avocado Toast With Egg Benedict',
    'custerd milli foni': 'Custard Milli Foni',
    'chocolate milli foni': 'Chocolate Milli Foni',
    'club sandwich': 'Classic Club Sandwich',
    'shaksuka': 'Shakshuka',
    'dsc08560': 'Chocolate Swirl Shake',
    'foods': 'Messanta Brunch Spread',
  }
  const key = n.toLowerCase()
  if (aliases[key]) return aliases[key]
  // Title Case for display
  return n
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function categoryFor(title) {
  const t = title.toLowerCase()

  // Desserts first
  if (
    /\b(cake|brownie|cheesecake|crumble|milli foni|chocolate ball|almond cream)\b/.test(t)
  ) {
    return 'Cakes & Pastries'
  }

  // Healthy / wellness drinks
  if (
    /\b(chia|smoothie|beetroot|flaxseed|flax|shake)\b/.test(t) ||
    t.includes('date with')
  ) {
    return 'Healthy Shakes'
  }

  // Hot coffee drinks
  if (/\b(coffee|macchiato|machiato|espresso)\b/.test(t) && !/\b(ice|iced)\b/.test(t)) {
    return 'Hot Drinks'
  }

  // Cold drinks
  if (/\b(latte|lemonade|juice|iced|ice)\b/.test(t)) {
    return 'Cold Drinks'
  }

  return 'Food'
}

function descriptionFor(title) {
  return `Messanta specialty — ${title}.`
}

function defaultPrice(category) {
  if (category === 'Food') return 350
  if (category === 'Cakes & Pastries') return 300
  if (category === 'Healthy Shakes') return 220
  if (category === 'Hot Drinks') return 150
  return 250
}

/** Map new titles → existing DB product names (lowercase keys) */
const EXISTING_MATCH = {
  beetroot: 'Beetroot',
  'caramel ice latte': 'Caramel Iced Latte',
  'chocolate ice latte': 'Chocolate Iced Latte',
  'carrot cake': 'Carrot Cake',
}

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

const groups = new Map()

for (const file of files) {
  const title = baseName(file)
  const full = path.join(srcDir, file)
  if (!groups.has(title)) groups.set(title, [])
  groups.get(title).push({ file, full })
}

// Sort each group's files by angle number
for (const [title, arr] of groups) {
  arr.sort((a, b) => {
    const na = parseInt(a.file.match(/\((\d+)\)/)?.[1] || '0', 10)
    const nb = parseInt(b.file.match(/\((\d+)\)/)?.[1] || '0', 10)
    return na - nb
  })
  groups.set(title, arr)
}

const products = []

for (const [title, images] of [...groups.entries()].sort((a, b) =>
  a[0].localeCompare(b[0])
)) {
  const slug = slugify(title)
  const urls = []
  images.forEach((img, i) => {
    const ext = path.extname(img.file).toLowerCase() || '.jpg'
    const destName = `${slug}-${i + 1}${ext}`
    const dest = path.join(outDir, destName)
    fs.copyFileSync(img.full, dest)
    urls.push(`/menu/${destName}`)
  })
  const category = categoryFor(title)
  products.push({
    title,
    category,
    price: defaultPrice(category),
    description: descriptionFor(title),
    urls,
    existingName: EXISTING_MATCH[title.toLowerCase()] ?? null,
  })
}

let sql = `-- Seed: new menu photos (carousel galleries)
-- Run AFTER 000–004 and 001_seed_existing_menu.sql
-- Add-only / update galleries — does NOT delete products.
-- Images are served from the app public folder: /menu/*.jpg

`

for (const p of products) {
  const urlsLiteral = `ARRAY[${p.urls.map((u) => `'${u.replace(/'/g, "''")}'`).join(', ')}]`
  const primary = p.urls[0].replace(/'/g, "''")
  const nameEsc = p.title.replace(/'/g, "''")
  const descEsc = p.description.replace(/'/g, "''")

  if (p.existingName) {
    const existEsc = p.existingName.replace(/'/g, "''")
    sql += `
-- Update gallery for existing: ${p.existingName}
UPDATE public.products
SET
  image_url = '${primary}',
  image_urls = ${urlsLiteral},
  updated_at = NOW()
WHERE lower(name) = lower('${existEsc}');

`
  } else {
    sql += `
INSERT INTO public.products (name, description, price, image_url, image_urls, category_id)
SELECT '${nameEsc}', '${descEsc}', ${p.price}, '${primary}', ${urlsLiteral}, c.id
FROM public.categories c
WHERE c.name = '${p.category.replace(/'/g, "''")}'
AND NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(p.name) = lower('${nameEsc}')
);

-- If product already exists (re-run), refresh gallery
UPDATE public.products
SET
  image_url = '${primary}',
  image_urls = ${urlsLiteral},
  updated_at = NOW()
WHERE lower(name) = lower('${nameEsc}');

`
  }
}

fs.writeFileSync(sqlOut, sql)
console.log(`Grouped ${products.length} products from ${files.length} files`)
console.log(`Copied images → public/menu/`)
console.log(`Wrote ${sqlOut}`)
for (const p of products) {
  console.log(`  - [${p.category}] ${p.title} (${p.urls.length} imgs)${p.existingName ? ' → update ' + p.existingName : ''}`)
}
