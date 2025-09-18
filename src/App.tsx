
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import CategoryPage from './pages/CategoryPage'
import { SupabaseProvider } from './lib/supabase'

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
          </Routes>
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
    </SupabaseProvider>
  )
}

export default App
