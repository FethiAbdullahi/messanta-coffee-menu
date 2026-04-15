import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Category, Product, DailyDiscount, DailySpecial } from '../types/database'
import { demoCategories, demoProducts } from '../data/demoData'

// Helper to check if Supabase is configured
const isSupabaseConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  return supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('order', { ascending: true })

        if (error) throw error
        setCategories(data || [])
      } else {
        setCategories(demoCategories)
      }
    } catch (err) {
      setCategories(demoCategories)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  return { categories, loading, error, refetch: fetchCategories }
}

export function useProducts(categoryId?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [categoryId])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('products')
          .select('*')
          .order('name', { ascending: true })

        if (categoryId) {
          query = query.eq('category_id', categoryId)
        }

        const { data, error } = await query

        if (error) throw error
        setProducts(data || [])
      } else {
        // Match Supabase: same category filter + alphabetical order so home preview aligns with /category/:id
        let filteredProducts = [...demoProducts]
        if (categoryId) {
          filteredProducts = filteredProducts.filter((product) => product.category_id === categoryId)
        }
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        setProducts(filteredProducts)
      }
    } catch (err) {
      let filteredProducts = [...demoProducts]
      if (categoryId) {
        filteredProducts = filteredProducts.filter((product) => product.category_id === categoryId)
      }
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
      setProducts(filteredProducts)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchProducts }
}

export function useDailyDiscounts() {
  const [discounts, setDiscounts] = useState<DailyDiscount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      
      if (isSupabaseConfigured()) {
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
          .from('daily_discounts')
          .select('*')
          .eq('is_active', true)
          .lte('start_date', today)
          .gte('end_date', today)
          .order('created_at', { ascending: false })

        if (error) throw error
        setDiscounts(data || [])
      } else {
        setDiscounts([])
      }
    } catch (err) {
      console.error('Error fetching discounts:', err)
      setDiscounts([])
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return { discounts, loading, error, refetch: fetchDiscounts }
}

export function useAllDiscounts() {
  const [discounts, setDiscounts] = useState<DailyDiscount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('daily_discounts')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setDiscounts(data || [])
      } else {
        setDiscounts([])
      }
    } catch (err) {
      console.error('Error fetching discounts:', err)
      setDiscounts([])
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return { discounts, loading, error, refetch: fetchDiscounts }
}

export function useDailySpecials() {
  const [specials, setSpecials] = useState<DailySpecial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSpecials()
  }, [])

  const fetchSpecials = async () => {
    try {
      setLoading(true)
      
      if (isSupabaseConfigured()) {
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
          .from('daily_specials')
          .select('*')
          .eq('is_active', true)
          .eq('featured_date', today)
          .order('created_at', { ascending: false })

        if (error) throw error
        setSpecials(data || [])
      } else {
        setSpecials([])
      }
    } catch (err) {
      console.error('Error fetching specials:', err)
      setSpecials([])
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return { specials, loading, error, refetch: fetchSpecials }
}

export function useAllSpecials() {
  const [specials, setSpecials] = useState<DailySpecial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSpecials()
  }, [])

  const fetchSpecials = async () => {
    try {
      setLoading(true)
      
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('daily_specials')
          .select('*')
          .order('featured_date', { ascending: false })

        if (error) throw error
        setSpecials(data || [])
      } else {
        setSpecials([])
      }
    } catch (err) {
      console.error('Error fetching specials:', err)
      setSpecials([])
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return { specials, loading, error, refetch: fetchSpecials }
}

// Get discount for a specific product
export function getProductDiscount(productId: string, discounts: DailyDiscount[]): DailyDiscount | null {
  return discounts.find(d => d.product_id === productId) || null
}

// Get special label for a specific product
export function getProductSpecial(productId: string, specials: DailySpecial[]): DailySpecial | null {
  return specials.find(s => s.product_id === productId) || null
}

// Calculate discounted price
export function calculateDiscountedPrice(price: number, discount: DailyDiscount | null): number {
  if (!discount) return price
  
  if (discount.discount_percentage) {
    return price * (1 - discount.discount_percentage / 100)
  }
  
  if (discount.discount_amount) {
    return Math.max(0, price - discount.discount_amount)
  }
  
  return price
}
