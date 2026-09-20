import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import CategoryPage from './pages/CategoryPage'
import AdminDashboard from './pages/AdminDashboard'
import OrdersDashboard from './pages/OrdersDashboard'
import OrderCheckoutPage from './pages/OrderCheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import { SupabaseProvider } from './lib/supabase'
import { CartProvider, useCart } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'

function CartUI() {
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { items, clearCart } = useCart()

  useEffect(() => {
    const handler = () => setCartOpen(true)
    window.addEventListener('open-cart', handler)
    return () => window.removeEventListener('open-cart', handler)
  }, [])

  return (
    <>
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        onSuccess={clearCart}
      />
    </>
  )
}

function App() {
  return (
    <SupabaseProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/orders" element={<OrdersDashboard />} />
              <Route path="/order/checkout/:orderId" element={<OrderCheckoutPage />} />
              <Route path="/order/success/:orderId" element={<OrderSuccessPage />} />
            </Routes>
            <CartUI />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </SupabaseProvider>
  )
}

export default App
