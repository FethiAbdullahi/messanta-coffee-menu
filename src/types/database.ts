export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      daily_discounts: {
        Row: {
          id: string
          product_id: string
          discount_percentage: number | null
          discount_amount: number | null
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          discount_percentage?: number | null
          discount_amount?: number | null
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          discount_percentage?: number | null
          discount_amount?: number | null
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      daily_specials: {
        Row: {
          id: string
          product_id: string
          special_label: string
          featured_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          special_label?: string
          featured_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          special_label?: string
          featured_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type DailyDiscount = Database['public']['Tables']['daily_discounts']['Row']
export type DailyDiscountInsert = Database['public']['Tables']['daily_discounts']['Insert']
export type DailyDiscountUpdate = Database['public']['Tables']['daily_discounts']['Update']

export type DailySpecial = Database['public']['Tables']['daily_specials']['Row']
export type DailySpecialInsert = Database['public']['Tables']['daily_specials']['Insert']
export type DailySpecialUpdate = Database['public']['Tables']['daily_specials']['Update']

// Extended types with relations
export type ProductWithDiscount = Product & {
  discount?: DailyDiscount | null
}

export type ProductWithSpecial = Product & {
  special?: DailySpecial | null
}

export type ProductWithAll = Product & {
  discount?: DailyDiscount | null
  special?: DailySpecial | null
}
