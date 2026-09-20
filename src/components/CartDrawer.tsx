import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  onCheckout: () => void
}

const CartDrawer = ({ open, onClose, onCheckout }: CartDrawerProps) => {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-sora font-bold text-gray-900">Your Order</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-sora">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add items from the menu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-sora font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-amber-600 font-medium">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 ml-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-sora">Subtotal</span>
                  <span className="text-2xl font-sora font-bold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-sora font-bold rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg"
                >
                  Proceed to Pay
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
