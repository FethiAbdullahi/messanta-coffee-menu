import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, Clock, ArrowLeft } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useOrder } from '../hooks/useOrders'
import { formatPrice } from '../lib/utils'

const PAID_STATUSES = ['paid', 'accepted', 'preparing', 'ready', 'completed']

const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const { order, loading } = useOrder(orderId)

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

  const isPaid = PAID_STATUSES.includes(order.status)
  const isPending = order.status === 'pending_payment'

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden text-center"
          >
            <div className={`p-8 ${isPaid ? 'bg-green-50' : 'bg-amber-50'}`}>
              {isPaid ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <Clock className="h-16 w-16 text-amber-500 mx-auto mb-4 animate-pulse" />
              )}
              <h1 className="text-2xl font-sora font-bold text-gray-900 mb-2">
                {isPaid ? 'Payment Complete!' : 'Awaiting Payment'}
              </h1>
              <p className="text-gray-600">
                {isPaid
                  ? 'Your order has been accepted. We\'re preparing it now!'
                  : 'Complete payment to confirm your order.'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Order #{order.order_number}</p>
            </div>

            <div className="p-6 text-left space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}× {item.product_name}
                  </span>
                  <span className="font-medium">{formatPrice(item.line_total)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-amber-600">{formatPrice(order.total)}</span>
              </div>

              {isPaid && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-green-700 font-medium text-sm">
                    Status: {order.status.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              )}

              {isPending && (
                <Link
                  to={`/order/checkout/${order.id}`}
                  className="block w-full py-3 mt-4 bg-amber-500 text-white font-semibold rounded-xl text-center hover:bg-amber-600 transition-colors"
                >
                  Complete Payment
                </Link>
              )}

              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-amber-700 hover:text-amber-800 font-medium mt-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to menu
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default OrderSuccessPage
