/**
 * Applies product seed via Supabase REST (requires SQL Editor for RLS bypass).
 * Prefer: paste supabase/seed/002_seed_new_photos.sql in SQL Editor.
 *
 * This script verifies public/menu images exist and prints next steps.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function loadEnv() {
  const envPath = path.join(root, '.env')
  const text = readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) env[m[1].trim()] = m[2].trim()
  }
  return env
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(url, serviceKey || key)

const menuDir = path.join(root, 'public', 'menu')
const files = fs.readdirSync(menuDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
console.log(`public/menu images: ${files.length}`)

// Try create bucket if service role
if (serviceKey) {
  const { data: buckets } = await supabase.storage.listBuckets()
  const has = buckets?.some((b) => b.name === 'product-images')
  if (!has) {
    const { error } = await supabase.storage.createBucket('product-images', { public: true })
    console.log(error ? `Bucket create: ${error.message}` : 'Created product-images bucket')
  } else {
    console.log('Bucket product-images exists')
  }

  // Upload all menu images
  let ok = 0
  let fail = 0
  for (const file of files) {
    const body = fs.readFileSync(path.join(menuDir, file))
    const { error } = await supabase.storage
      .from('product-images')
      .upload(`menu/${file}`, body, { contentType: 'image/jpeg', upsert: true })
    if (error) {
      fail++
      console.log(`Fail ${file}: ${error.message}`)
    } else ok++
  }
  console.log(`Uploaded ${ok}, failed ${fail}`)
} else {
  console.log('No SUPABASE_SERVICE_ROLE_KEY in .env — skipping Storage upload.')
  console.log('Images will load from /menu/* via the Vite public folder.')
}

// Count products
const { data: products, error } = await supabase.from('products').select('id,name')
if (error) console.log('Products read error:', error.message)
else console.log(`Products in DB: ${products?.length ?? 0}`)

console.log('\n>>> ACTION REQUIRED <<<')
console.log('Open Supabase SQL Editor and run:')
console.log('  supabase/seed/002_seed_new_photos.sql')
console.log('That inserts/updates the new photo products (bypasses RLS).')
