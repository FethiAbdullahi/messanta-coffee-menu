import { supabase } from './supabase'
import { CartItem, OrderWithItems } from '../types/orders'

function generateTxRef(): string {
  const stamp = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `messanta-${stamp}-${rand}`
}

export async function createOrder(items: CartItem[]): Promise<OrderWithItems> {
  if (items.length === 0) {
    throw new Error('Cart is empty')
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const txRef = generateTxRef()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      tx_ref: txRef,
      status: 'pending_payment',
      subtotal,
      total: subtotal,
      currency: 'ETB',
    })
    .select()
    .single()

  if (orderError || !order) {
    throw new Error(orderError?.message || 'Failed to create order')
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    line_total: item.price * item.quantity,
  }))

  const { data: insertedItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select()

  if (itemsError) {
    throw new Error(itemsError.message)
  }

  return {
    ...order,
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    items: (insertedItems || []).map((i) => ({
      ...i,
      unit_price: Number(i.unit_price),
      line_total: Number(i.line_total),
    })),
  }
}

export async function fetchOrderWithItems(orderId: string): Promise<OrderWithItems | null> {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (orderError || !order) return null

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)

  return {
    ...order,
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    items: (items || []).map((i) => ({
      ...i,
      unit_price: Number(i.unit_price),
      line_total: Number(i.line_total),
    })),
  }
}

/** Dev/test helper until Chapa webhook is wired */
export async function simulatePayment(orderId: string): Promise<void> {
  const { error } = await supabase.rpc('simulate_order_payment', {
    p_order_id: orderId,
  })

  if (error) throw new Error(error.message)
}

export function isChapaConfigured(): boolean {
  return Boolean(import.meta.env.VITE_CHAPA_PUBLIC_KEY)
}
