import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Loader2, ArrowLeft, Coffee } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useOrder } from '../hooks/useOrders'
import { simulatePayment, isChapaConfigured } from '../lib/orders'
import { formatPrice } from '../lib/utils'

const OrderCheckoutPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const { order, loading } = useOrder(orderId)
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)

  const handleChapaPay = async () => {
    if (!order) return
    setPaying(true)

    if (isChapaConfigured()) {
      // Chapa integration will redirect here once API key is provided
      toast('Chapa payment will be connected soon', { icon: '🔜' })
      setPaying(false)
      return
    }

    // Dev flow: simulate payment until Chapa is wired
    try {
      await simulatePayment(order.id)
      toast.success('Payment simulated — order sent to kitchen!')
      navigate(`/order/success/${order.id}`)
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <Link to="/" className="text-amber-600 mt-4 inline-block">Back to menu</Link>
        </div>
      </div>
    )
  }

  if (order.status !== 'pending_payment') {
    navigate(`/order/success/${order.id}`, { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-lg">
          <Link
            to="/"
            className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to menu
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6 text-center">
              <Coffee className="h-10 w-10 text-black/70 mx-auto mb-2" />
              <h1 className="text-2xl font-sora font-bold text-black">Order #{order.order_number}</h1>
              <p className="text-black/70 text-sm mt-1">Review and pay to confirm</p>
            </div>

            <div className="p-6 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-700">
                    {item.quantity}× {item.product_name}
                  </span>
                  <span className="font-medium">{formatPrice(item.line_total)}</span>
                </div>
              ))}

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-lg font-sora font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-sora font-bold text-amber-600">
                  {formatPrice(order.total)}
                </span>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Phone number and payment details are collected securely on the Chapa checkout page.
              </p>

              <button
                onClick={handleChapaPay}
                disabled={paying}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-sora font-bold rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {paying ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    {isChapaConfigured() ? 'Pay with Chapa' : 'Complete Payment (Test)'}
                  </>
                )}
              </button>

              {!isChapaConfigured() && import.meta.env.DEV && (
                <p className="text-xs text-center text-gray-400">
                  Test mode: payment is simulated until Chapa API key is added.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default OrderCheckoutPage
