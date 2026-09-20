import type { PostgrestError } from '@supabase/supabase-js'

/** Supabase RLS often returns error=null and empty data when a write is blocked. */
export function assertMutated<T>(
  data: T[] | T | null,
  error: PostgrestError | null,
  action: string
): T {
  if (error) {
    throw new Error(error.message)
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    throw new Error(
      `${action} was blocked. Sign out and sign in again so your admin session can save changes.`
    )
  }
  return row
}
