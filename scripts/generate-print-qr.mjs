/**
 * Writes 4096×4096 PNG QR codes to public/print-qr/
 * Run: npm run generate:print-qr
 */
import QRCode from 'qrcode'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { googlePlaceId, menuSiteUrl } from './print-qr-config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'print-qr')

const SIZE = 4096
const qrOptions = {
  width: SIZE,
  margin: 4,
  errorCorrectionLevel: 'H',
  color: { dark: '#000000', light: '#FFFFFF' },
  type: 'png',
}

const reviewUrl = `https://search.google.com/local/writereview?placeid=${googlePlaceId}`

function normalizeMenuUrl(url) {
  const u = String(url).trim().replace(/\/$/, '')
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    throw new Error(`menuSiteUrl must start with https:// (got: ${url})`)
  }
  return u
}

async function main() {
  const menu = normalizeMenuUrl(menuSiteUrl)

  await mkdir(outDir, { recursive: true })

  const reviewPath = join(outDir, 'google-review-qr-4096.png')
  const menuPath = join(outDir, 'menu-site-qr-4096.png')

  const reviewBuffer = await QRCode.toBuffer(reviewUrl, qrOptions)
  const menuBuffer = await QRCode.toBuffer(menu, qrOptions)

  await writeFile(reviewPath, reviewBuffer)
  await writeFile(menuPath, menuBuffer)

  console.log('Wrote', reviewPath)
  console.log('  →', reviewUrl)
  console.log('Wrote', menuPath)
  console.log('  →', menu)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
