import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'messanta_admin_unlocked'

/**
 * Password-only UI gate that also establishes a real Supabase session.
 * Menu writes require authenticated + is_super_admin() under RLS.
 */
export function useAdminPassword() {
  const [unlocked, setUnlocked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const restore = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (cancelled) return

        if (session?.user) {
          const { data: isAdmin, error } = await supabase.rpc('is_super_admin')
          if (!error && isAdmin) {
            localStorage.setItem(STORAGE_KEY, '1')
            setUnlocked(true)
            setLoading(false)
            return
          }
        }

        // Stale unlock flag without a valid admin session → force re-login
        localStorage.removeItem(STORAGE_KEY)
        setUnlocked(false)
      } catch {
        if (!cancelled) {
          localStorage.removeItem(STORAGE_KEY)
          setUnlocked(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const signInWithPassword = useCallback(async (password: string) => {
    const expected = String(import.meta.env.VITE_ADMIN_PASSWORD || '').trim()
    const entered = password.trim()
    const email = String(import.meta.env.VITE_ADMIN_EMAIL || '').trim()

    if (!expected) {
      return { success: false, error: 'Admin password is not configured in .env' }
    }
    if (entered !== expected) {
      return { success: false, error: 'Incorrect password' }
    }
    if (!email) {
      return {
        success: false,
        error: 'VITE_ADMIN_EMAIL is missing — required so price/menu saves can pass security rules',
      }
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: expected,
    })

    if (authError) {
      return {
        success: false,
        error:
          authError.message.includes('Invalid login')
            ? 'Supabase Auth password must match VITE_ADMIN_PASSWORD. Update the Auth user password in Supabase Dashboard → Authentication → Users.'
            : `Could not sign in to Supabase: ${authError.message}`,
      }
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_super_admin')
    if (adminError) {
      await supabase.auth.signOut().catch(() => {})
      return { success: false, error: `Admin check failed: ${adminError.message}` }
    }
    if (!isAdmin) {
      await supabase.auth.signOut().catch(() => {})
      return {
        success: false,
        error: `${email} is not in admin_allowlist. Add it in Supabase SQL, then try again.`,
      }
    }

    localStorage.setItem(STORAGE_KEY, '1')
    setUnlocked(true)
    return { success: true }
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY)
    setUnlocked(false)
    await supabase.auth.signOut().catch(() => {})
  }, [])

  return {
    isAuthenticated: unlocked,
    loading,
    signInWithPassword,
    signOut,
  }
}
