import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coffee,
  Clock,
  ChefHat,
  Bell,
  CheckCircle2,
  Package,
  Loader2,
  RefreshCw,
  CircleDollarSign,
  TrendingUp,
  Wifi,
  ArrowRight,
  Receipt,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useOrdersDashboard } from '../hooks/useOrders'
import { OrderStatus, OrderWithItems } from '../types/orders'
import { formatPrice } from '../lib/utils'

const COLUMNS: {
  status: OrderStatus
  label: string
  subtitle: string
  icon: typeof Coffee
  accent: string
  headerBg: string
  dot: string
  btn: string
}[] = [
  {
    status: 'paid',
    label: 'Incoming',
    subtitle: 'Paid & waiting',
    icon: Bell,
    accent: 'border-l-emerald-500',
    headerBg: 'bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  {
    status: 'accepted',
    label: 'Accepted',
    subtitle: 'Queued for kitchen',
    icon: CheckCircle2,
    accent: 'border-l-sky-500',
    headerBg: 'bg-sky-500/10 border-sky-500/20',
    dot: 'bg-sky-500',
    btn: 'bg-sky-600 hover:bg-sky-700 text-white',
  },
  {
    status: 'preparing',
    label: 'In Progress',
    subtitle: 'Being prepared',
    icon: ChefHat,
    accent: 'border-l-amber-500',
    headerBg: 'bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-500',
    btn: 'bg-amber-500 hover:bg-amber-600 text-gray-900',
  },
  {
    status: 'ready',
    label: 'Ready',
    subtitle: 'Awaiting pickup',
    icon: Package,
    accent: 'border-l-violet-500',
    headerBg: 'bg-violet-500/10 border-violet-500/20',
    dot: 'bg-violet-500',
    btn: 'bg-violet-600 hover:bg-violet-700 text-white',
  },
]

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  paid: 'accepted',
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'completed',
}

const ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  paid: 'Accept Order',
  accepted: 'Send to Kitchen',
  preparing: 'Mark Ready',
  ready: 'Complete & Serve',
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-ET', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m ago`
}

function itemCount(order: OrderWithItems): number {
  return order.items.reduce((sum, i) => sum + i.quantity, 0)
}

function OrderCard({
  order,
  onAction,
  loading,
  accent,
  btnClass,
}: {
  order: OrderWithItems
  onAction: (id: string, status: OrderStatus) => void
  loading: string | null
  accent: string
  btnClass: string
}) {
  const next = NEXT_STATUS[order.status]
  const actionLabel = ACTION_LABELS[order.status]
  const count = itemCount(order)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`group bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden border-l-4 ${accent}`}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-sora font-bold text-gray-900 tracking-tight">
                #{order.order_number}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(order.paid_at || order.created_at)}</span>
              <span className="text-gray-300">·</span>
              <span>{timeAgo(order.paid_at || order.created_at)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-sora font-bold text-gray-900">
              {formatPrice(order.total)}
            </span>
            {order.chapa_ref && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wide">
                <CircleDollarSign className="h-3 w-3" />
                Paid
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 rounded-lg bg-gray-50/80 p-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <div className="flex items-start gap-2 min-w-0">
                <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md bg-white border border-gray-200 text-xs font-bold text-gray-700">
                  {item.quantity}
                </span>
                <span className="font-medium text-gray-800 leading-snug">{item.product_name}</span>
              </div>
              <span className="shrink-0 text-gray-500 font-medium tabular-nums">
                {formatPrice(item.line_total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {next && actionLabel && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onAction(order.id, next)}
            disabled={loading === order.id}
            className={`w-full py-3 rounded-lg font-sora font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${btnClass}`}
          >
            {loading === order.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {actionLabel}
                <ArrowRight className="h-4 w-4 opacity-70" />
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string
  value: string | number
  icon: typeof Coffee
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? 'bg-emerald-500/10 border-emerald-500/25'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
        <Icon className={`h-4 w-4 ${highlight ? 'text-emerald-400' : 'text-gray-500'}`} />
      </div>
      <p
        className={`text-2xl font-sora font-bold tabular-nums ${
          highlight ? 'text-emerald-400' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

const OrdersDashboard = () => {
  const { orders, loading: ordersLoading, updateOrderStatus, refetch } = useOrdersDashboard()
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  const handleAction = async (orderId: string, status: OrderStatus) => {
    setActionLoading(orderId)
    try {
      await updateOrderStatus(orderId, status)
      toast.success(status === 'completed' ? 'Order served!' : 'Order updated')
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const newCount = orders.filter((o) => o.status === 'paid').length
  const activeCount = orders.length
  const todayRevenue = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">
      {/* Top bar */}
      <header className="shrink-0 border-b border-white/10 bg-[#161922]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <img
                    src="/Messenta.png"
                    alt=""
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-sora font-bold text-white leading-tight">
                    Messanta Order Desk
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Live kitchen & front desk
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-gray-400">Live</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white tabular-nums">
                  {now.toLocaleTimeString('en-ET', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-gray-500">
                  {now.toLocaleDateString('en-ET', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {newCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                  <Bell className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-emerald-400">{newCount} new</span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
                title="Refresh orders"
              >
                <RefreshCw
                  className={`h-5 w-5 text-gray-400 ${refreshing ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="shrink-0 border-b border-white/5 bg-[#13161e]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Active Orders" value={activeCount} icon={Receipt} />
            <StatCard
              label="Awaiting Action"
              value={newCount}
              icon={Bell}
              highlight={newCount > 0}
            />
            <StatCard
              label="In Kitchen"
              value={orders.filter((o) => o.status === 'preparing').length}
              icon={ChefHat}
            />
            <StatCard
              label="Session Revenue"
              value={formatPrice(todayRevenue)}
              icon={TrendingUp}
            />
          </div>
        </div>
      </div>

      {/* Board */}
      <main className="flex-1 overflow-hidden">
        {ordersLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
            <p className="text-sm text-gray-500">Loading orders…</p>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 h-full min-h-[calc(100vh-220px)]">
              {COLUMNS.map((col) => {
                const colOrders = orders.filter((o) => o.status === col.status)
                const Icon = col.icon
                return (
                  <div
                    key={col.status}
                    className="flex flex-col rounded-2xl border border-white/10 bg-[#161922]/60 overflow-hidden min-h-[420px] max-h-[calc(100vh-240px)]"
                  >
                    <div
                      className={`shrink-0 px-4 py-4 border-b ${col.headerBg}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-lg flex items-center justify-center bg-white/10`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h2 className="font-sora font-bold text-white text-sm">
                              {col.label}
                            </h2>
                            <p className="text-[11px] text-gray-500">{col.subtitle}</p>
                          </div>
                        </div>
                        <span className="flex items-center justify-center h-7 min-w-[28px] px-2 rounded-lg bg-white/10 text-sm font-bold text-white tabular-nums">
                          {colOrders.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                      <AnimatePresence mode="popLayout">
                        {colOrders.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                              <Icon className="h-6 w-6 text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">No orders here</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {col.status === 'paid'
                                ? 'Paid orders will appear instantly'
                                : 'Move orders through the pipeline'}
                            </p>
                          </div>
                        ) : (
                          colOrders.map((order) => (
                            <OrderCard
                              key={order.id}
                              order={order}
                              onAction={handleAction}
                              loading={actionLoading}
                              accent={col.accent}
                              btnClass={col.btn}
                            />
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer status */}
      <footer className="shrink-0 border-t border-white/5 bg-[#13161e] px-4 py-2">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Wifi className="h-3.5 w-3.5 text-emerald-500/70" />
            <span>Connected · Real-time sync</span>
          </div>
          <span className="hidden sm:inline text-gray-700">
            Messanta Coffee · Order Management
          </span>
        </div>
      </footer>
    </div>
  )
}

export default OrdersDashboard
