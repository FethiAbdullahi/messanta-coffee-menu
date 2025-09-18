import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Category, Product } from '../types/database'
import { demoCategories, demoProducts } from '../data/demoData'

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
      
      // Check if we have valid Supabase credentials
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('order', { ascending: true })

        if (error) throw error
        setCategories(data || [])
      } else {
        // Use demo data if Supabase is not configured
        setCategories(demoCategories)
      }
    } catch (err) {
      // Fallback to demo data on error
      setCategories(demoCategories)
      setError(null) // Clear error when using demo data
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
      
      // Check if we have valid Supabase credentials
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
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
        // Use demo data if Supabase is not configured
        let filteredProducts = demoProducts
        if (categoryId) {
          filteredProducts = demoProducts.filter(product => product.category_id === categoryId)
        }
        setProducts(filteredProducts)
      }
    } catch (err) {
      // Fallback to demo data on error
      let filteredProducts = demoProducts
      if (categoryId) {
        filteredProducts = demoProducts.filter(product => product.category_id === categoryId)
      }
      setProducts(filteredProducts)
      setError(null) // Clear error when using demo data
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchProducts }
}
