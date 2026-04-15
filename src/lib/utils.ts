import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
  }).format(price)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Vite serves `public/` at site root — `public/foo.webp` must be `/foo.webp` for <img src>. */
export function resolveProductImageUrl(url: string | null | undefined): string {
  if (!url?.trim()) return ''
  const u = url.trim()
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  if (u.startsWith('public/')) return `/${u.slice('public/'.length)}`
  if (u.startsWith('/')) return u
  return `/${u.replace(/^\.?\//, '')}`
}
