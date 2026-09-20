export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'

export interface Order {
  id: string
  order_number: number
  tx_ref: string
  status: OrderStatus
  subtotal: number
  total: number
  currency: string
  chapa_ref: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  line_total: number
  created_at: string
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string | null
}
