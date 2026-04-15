import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        })
      } catch (error) {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: (error as Error).message
        })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        })
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setAuthState({
        user: data.user,
        session: data.session,
        loading: false,
        error: null
      })

      return { success: true }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: (error as Error).message
      }))
      return { success: false, error: (error as Error).message }
    }
  }

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null
      })

      return { success: true }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: (error as Error).message
      }))
      return { success: false, error: (error as Error).message }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      // Note: User may need to confirm email before being fully authenticated
      setAuthState({
        user: data.user,
        session: data.session,
        loading: false,
        error: null
      })

      return { success: true, needsConfirmation: !data.session }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: (error as Error).message
      }))
      return { success: false, error: (error as Error).message }
    }
  }

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.session,
    signIn,
    signOut,
    signUp
  }
}

