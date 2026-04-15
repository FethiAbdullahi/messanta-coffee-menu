import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Save, X, Eye, EyeOff, 
  Coffee, Star, LogOut, Percent, Calendar,
  LayoutDashboard, Package, Sparkles
} from 'lucide-react'
import { 
  Category, Product, CategoryInsert, ProductInsert,
  DailyDiscount, DailyDiscountInsert, DailySpecial, DailySpecialInsert
} from '../types/database'
import { useCategories, useProducts, useAllDiscounts, useAllSpecials } from '../hooks/useSupabase'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/utils'
import ImageUpload from '../components/ImageUpload'
import toast from 'react-hot-toast'

type TabType = 'categories' | 'products' | 'discounts' | 'specials'

const AdminDashboard = () => {
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useCategories()
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts()
  const { discounts, loading: discountsLoading, refetch: refetchDiscounts } = useAllDiscounts()
  const { specials, loading: specialsLoading, refetch: refetchSpecials } = useAllSpecials()
  const { user, loading: authLoading, isAuthenticated, signIn, signOut } = useAuth()
  
  const [activeTab, setActiveTab] = useState<TabType>('categories')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingDiscount, setEditingDiscount] = useState<DailyDiscount | null>(null)
  const [editingSpecial, setEditingSpecial] = useState<DailySpecial | null>(null)
  
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [showSpecialForm, setShowSpecialForm] = useState(false)
  
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Category form state
  const [categoryForm, setCategoryForm] = useState<CategoryInsert>({
    name: '',
    description: '',
    order: 0
  })

  // Product form state
  const [productForm, setProductForm] = useState<ProductInsert>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category_id: ''
  })

  // Discount form state
  const [discountForm, setDiscountForm] = useState<DailyDiscountInsert>({
    product_id: '',
    discount_percentage: null,
    discount_amount: null,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    is_active: true
  })
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage')

  // Special form state
  const [specialForm, setSpecialForm] = useState<DailySpecialInsert>({
    product_id: '',
    special_label: "Today's Special",
    featured_date: new Date().toISOString().split('T')[0],
    is_active: true
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    
    const result = await signIn(email, password)
    
    if (result.success) {
      toast.success('Welcome to Admin Dashboard!')
    } else {
      toast.error(result.error || 'Invalid credentials')
    }
    
    setLoginLoading(false)
  }

  const handleLogout = async () => {
    await signOut()
    toast.success('Logged out successfully')
  }

  // Category CRUD
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryForm as any)
          .eq('id', editingCategory.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryForm as any])
        if (error) throw error
      }
      await refetchCategories()
      toast.success(editingCategory ? 'Category updated!' : 'Category added!')
      setShowCategoryForm(false)
      setEditingCategory(null)
      setCategoryForm({ name: '', description: '', order: 0 })
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Error saving category')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) throw error
        await refetchCategories()
        toast.success('Category deleted!')
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Error deleting category')
      }
    }
  }

  const startEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      order: category.order
    })
    setShowCategoryForm(true)
  }

  // Product CRUD
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productForm as any)
          .eq('id', editingProduct.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productForm as any])
        if (error) throw error
      }
      await refetchProducts()
      toast.success(editingProduct ? 'Product updated!' : 'Product added!')
      setShowProductForm(false)
      setEditingProduct(null)
      setProductForm({ name: '', description: '', price: 0, image_url: '', category_id: '' })
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Error saving product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) throw error
        await refetchProducts()
        toast.success('Product deleted!')
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error('Error deleting product')
      }
    }
  }

  const startEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url || '',
      category_id: product.category_id
    })
    setShowProductForm(true)
  }

  // Discount CRUD
  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const discountData = {
        ...discountForm,
        discount_percentage: discountType === 'percentage' ? discountForm.discount_percentage : null,
        discount_amount: discountType === 'amount' ? discountForm.discount_amount : null
      }

      if (editingDiscount) {
        const { error } = await supabase
          .from('daily_discounts')
          .update(discountData as any)
          .eq('id', editingDiscount.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('daily_discounts')
          .insert([discountData as any])
        if (error) throw error
      }
      await refetchDiscounts()
      toast.success(editingDiscount ? 'Discount updated!' : 'Discount added!')
      setShowDiscountForm(false)
      setEditingDiscount(null)
      setDiscountForm({
        product_id: '',
        discount_percentage: null,
        discount_amount: null,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        is_active: true
      })
    } catch (error) {
      console.error('Error saving discount:', error)
      toast.error('Error saving discount')
    }
  }

  const handleDeleteDiscount = async (id: string) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      try {
        const { error } = await supabase.from('daily_discounts').delete().eq('id', id)
        if (error) throw error
        await refetchDiscounts()
        toast.success('Discount deleted!')
      } catch (error) {
        console.error('Error deleting discount:', error)
        toast.error('Error deleting discount')
      }
    }
  }

  const startEditDiscount = (discount: DailyDiscount) => {
    setEditingDiscount(discount)
    setDiscountType(discount.discount_percentage ? 'percentage' : 'amount')
    setDiscountForm({
      product_id: discount.product_id,
      discount_percentage: discount.discount_percentage,
      discount_amount: discount.discount_amount,
      start_date: discount.start_date,
      end_date: discount.end_date,
      is_active: discount.is_active
    })
    setShowDiscountForm(true)
  }

  // Special CRUD
  const handleSpecialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingSpecial) {
        const { error } = await supabase
          .from('daily_specials')
          .update(specialForm as any)
          .eq('id', editingSpecial.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('daily_specials')
          .insert([specialForm as any])
        if (error) throw error
      }
      await refetchSpecials()
      toast.success(editingSpecial ? 'Special updated!' : 'Special added!')
      setShowSpecialForm(false)
      setEditingSpecial(null)
      setSpecialForm({
        product_id: '',
        special_label: "Today's Special",
        featured_date: new Date().toISOString().split('T')[0],
        is_active: true
      })
    } catch (error) {
      console.error('Error saving special:', error)
      toast.error('Error saving special')
    }
  }

  const handleDeleteSpecial = async (id: string) => {
    if (confirm('Are you sure you want to delete this special?')) {
      try {
        const { error } = await supabase.from('daily_specials').delete().eq('id', id)
        if (error) throw error
        await refetchSpecials()
        toast.success('Special deleted!')
      } catch (error) {
        console.error('Error deleting special:', error)
        toast.error('Error deleting special')
      }
    }
  }

  const startEditSpecial = (special: DailySpecial) => {
    setEditingSpecial(special)
    setSpecialForm({
      product_id: special.product_id,
      special_label: special.special_label,
      featured_date: special.featured_date,
      is_active: special.is_active
    })
    setShowSpecialForm(true)
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4">
              <Coffee className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-sora font-bold text-gray-900">
              Admin Login
            </h1>
            <p className="text-gray-500 mt-2 font-sora font-light">
              Messanta Coffee Management
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="admin@messanta.coffee"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-sora font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <p className="text-xs text-gray-400 mt-6 text-center">
            Contact your administrator for access credentials
          </p>
        </motion.div>
      </div>
    )
  }

  // Loading dashboard data
  if (categoriesLoading || productsLoading || discountsLoading || specialsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-sora">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'categories' as TabType, label: 'Categories', icon: LayoutDashboard, count: categories.length },
    { id: 'products' as TabType, label: 'Products', icon: Package, count: products.length },
    { id: 'discounts' as TabType, label: 'Discounts', icon: Percent, count: discounts.length },
    { id: 'specials' as TabType, label: 'Specials', icon: Sparkles, count: specials.length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-sora font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-sora font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-sora font-bold text-gray-900">Categories</h2>
              <button
                onClick={() => {
                  setShowCategoryForm(true)
                  setEditingCategory(null)
                  setCategoryForm({ name: '', description: '', order: 0 })
                }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-md transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-sora font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
                  )}
                  <div className="text-sm text-gray-500 mb-4">
                    Order: {category.order}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditCategory(category)}
                      className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-sora font-bold text-gray-900">Products</h2>
              <button
                onClick={() => {
                  setShowProductForm(true)
                  setEditingProduct(null)
                  setProductForm({ name: '', description: '', price: 0, image_url: '', category_id: '' })
                }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-md transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Image</th>
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const category = categories.find(cat => cat.id === product.category_id)
                    return (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Coffee className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-sora font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{category?.name || 'Unknown'}</td>
                        <td className="py-3 px-4 font-sora font-semibold text-gray-900">{formatPrice(product.price)}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditProduct(product)}
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-sora font-bold text-gray-900">Daily Discounts</h2>
              <button
                onClick={() => {
                  setShowDiscountForm(true)
                  setEditingDiscount(null)
                  setDiscountForm({
                    product_id: '',
                    discount_percentage: null,
                    discount_amount: null,
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: new Date().toISOString().split('T')[0],
                    is_active: true
                  })
                  setDiscountType('percentage')
                }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:shadow-md transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Discount
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Discount</th>
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Duration</th>
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-sora font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((discount) => {
                    const product = products.find(p => p.id === discount.product_id)
                    const isActive = discount.is_active && 
                      new Date(discount.start_date) <= new Date() && 
                      new Date(discount.end_date) >= new Date()
                    return (
                      <tr key={discount.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-sora font-medium text-gray-900">
                          {product?.name || 'Unknown Product'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                            {discount.discount_percentage 
                              ? `${discount.discount_percentage}% OFF`
                              : `${discount.discount_amount} ETB OFF`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {discount.start_date} to {discount.end_date}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditDiscount(discount)}
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDiscount(discount.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {discounts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Percent className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No discounts yet. Create your first discount!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Specials Tab */}
        {activeTab === 'specials' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-sora font-bold text-gray-900">Daily Specials</h2>
              <button
                onClick={() => {
                  setShowSpecialForm(true)
                  setEditingSpecial(null)
                  setSpecialForm({
                    product_id: '',
                    special_label: "Today's Special",
                    featured_date: new Date().toISOString().split('T')[0],
                    is_active: true
                  })
                }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-lg hover:shadow-md transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Special
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specials.map((special) => {
                const product = products.find(p => p.id === special.product_id)
                const isToday = special.featured_date === new Date().toISOString().split('T')[0]
                return (
                  <div key={special.id} className={`rounded-xl p-6 border-2 ${
                    isToday && special.is_active 
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300' 
                      : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className={`h-5 w-5 ${isToday ? 'text-amber-500' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold ${isToday ? 'text-amber-600' : 'text-gray-500'}`}>
                        {special.special_label}
                      </span>
                    </div>
                    <h3 className="text-lg font-sora font-semibold text-gray-900 mb-2">
                      {product?.name || 'Unknown Product'}
                    </h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{special.featured_date}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditSpecial(special)}
                        className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSpecial(special.id)}
                        className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
              {specials.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No specials yet. Create your first daily special!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-sora font-bold">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowCategoryForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={categoryForm.description || ''}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-sora font-bold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETB)</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <ImageUpload
                  currentImageUrl={productForm.image_url}
                  onImageUploaded={(url) => setProductForm({ ...productForm, image_url: url })}
                  onImageRemoved={() => setProductForm({ ...productForm, image_url: '' })}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Discount Form Modal */}
      {showDiscountForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-sora font-bold">
                {editingDiscount ? 'Edit Discount' : 'Add Discount'}
              </h3>
              <button onClick={() => setShowDiscountForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleDiscountSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <select
                  value={discountForm.product_id}
                  onChange={(e) => setDiscountForm({ ...discountForm, product_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatPrice(product.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setDiscountType('percentage')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      discountType === 'percentage'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('amount')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      discountType === 'amount'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Fixed Amount (ETB)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (ETB)'}
                </label>
                <input
                  type="number"
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  min="0"
                  max={discountType === 'percentage' ? '100' : undefined}
                  value={discountType === 'percentage' 
                    ? discountForm.discount_percentage || '' 
                    : discountForm.discount_amount || ''
                  }
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || null
                    if (discountType === 'percentage') {
                      setDiscountForm({ ...discountForm, discount_percentage: value, discount_amount: null })
                    } else {
                      setDiscountForm({ ...discountForm, discount_amount: value, discount_percentage: null })
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder={discountType === 'percentage' ? 'e.g., 20' : 'e.g., 50'}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={discountForm.start_date}
                    onChange={(e) => setDiscountForm({ ...discountForm, start_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={discountForm.end_date}
                    onChange={(e) => setDiscountForm({ ...discountForm, end_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="discount-active"
                  checked={discountForm.is_active}
                  onChange={(e) => setDiscountForm({ ...discountForm, is_active: e.target.checked })}
                  className="w-5 h-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="discount-active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowDiscountForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Special Form Modal */}
      {showSpecialForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-sora font-bold">
                {editingSpecial ? 'Edit Special' : 'Add Special'}
              </h3>
              <button onClick={() => setShowSpecialForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSpecialSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <select
                  value={specialForm.product_id}
                  onChange={(e) => setSpecialForm({ ...specialForm, product_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Label</label>
                <input
                  type="text"
                  value={specialForm.special_label}
                  onChange={(e) => setSpecialForm({ ...specialForm, special_label: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Today's Special, Chef's Pick"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Date</label>
                <input
                  type="date"
                  value={specialForm.featured_date}
                  onChange={(e) => setSpecialForm({ ...specialForm, featured_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="special-active"
                  checked={specialForm.is_active}
                  onChange={(e) => setSpecialForm({ ...specialForm, is_active: e.target.checked })}
                  className="w-5 h-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="special-active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowSpecialForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
