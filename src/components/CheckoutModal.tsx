import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { CartItem } from '../types/orders'
import { createOrder } from '../lib/orders'
import { formatPrice } from '../lib/utils'

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
  onSuccess?: () => void
}

const CheckoutModal = ({ open, onClose, items, onSuccess }: CheckoutModalProps) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handlePay = async () => {
    if (items.length === 0) return
    setLoading(true)
    try {
      const order = await createOrder(items)
      onSuccess?.()
      onClose()
      navigate(`/order/checkout/${order.id}`)
    } catch (err) {
      toast.error((err as Error).message || 'Could not place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[80]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-xl font-sora font-bold text-gray-900">Confirm Order</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-5 space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-sora font-bold text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  You&apos;ll enter your phone number and pay securely on the Chapa checkout page.
                </p>
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-sora font-bold rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay with Chapa
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CheckoutModal
