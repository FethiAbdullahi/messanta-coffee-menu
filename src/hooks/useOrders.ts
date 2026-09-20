import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Order, OrderItem, OrderStatus, OrderWithItems } from '../types/orders'

function mapOrder(row: Record<string, unknown>): Order {
  return {
    ...(row as unknown as Order),
    subtotal: Number(row.subtotal),
    total: Number(row.total),
  }
}

function mapItem(row: Record<string, unknown>): OrderItem {
  return {
    ...(row as unknown as OrderItem),
    unit_price: Number(row.unit_price),
    line_total: Number(row.line_total),
  }
}

export function useStaffCheck() {
  const [isStaff, setIsStaff] = useState(false)
  const [loading, setLoading] = useState(true)

  const check = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('is_staff')
      if (error) throw error
      setIsStaff(Boolean(data))
    } catch {
      setIsStaff(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    check()
  }, [check])

  return { isStaff, loading, recheck: check }
}

export function useOrdersDashboard() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const { data: orderRows, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['paid', 'accepted', 'preparing', 'ready'])
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!orderRows?.length) {
        setOrders([])
        return
      }

      const orderIds = orderRows.map((o) => o.id)
      const { data: itemRows } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds)

      const itemsByOrder = (itemRows || []).reduce(
        (acc, item) => {
          const mapped = mapItem(item)
          if (!acc[mapped.order_id]) acc[mapped.order_id] = []
          acc[mapped.order_id].push(mapped)
          return acc
        },
        {} as Record<string, OrderItem[]>
      )

      setOrders(
        orderRows.map((o) => ({
          ...mapOrder(o),
          items: itemsByOrder[o.id] || [],
        }))
      )
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('orders-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchOrders])

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) throw new Error(error.message)
    await fetchOrders()
  }

  return { orders, loading, updateOrderStatus, refetch: fetchOrders }
}

export function useOrder(orderId: string | undefined) {
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    const load = async () => {
      const { data: row, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error || !row) {
        setOrder(null)
        setLoading(false)
        return
      }

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      setOrder({
        ...mapOrder(row),
        items: (items || []).map(mapItem),
      })
      setLoading(false)
    }

    load()

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        () => load()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId])

  return { order, loading }
}
