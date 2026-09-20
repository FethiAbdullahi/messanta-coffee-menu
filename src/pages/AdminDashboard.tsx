import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Star,
  LogOut,
  Percent,
  Calendar,
  LayoutDashboard,
  Package,
  Sparkles,
  Image as ImageIcon,
  Search,
  Layers,
} from 'lucide-react'
import {
  Category,
  Product,
  CategoryInsert,
  ProductInsert,
  DailyDiscount,
  DailyDiscountInsert,
  DailySpecial,
  DailySpecialInsert,
} from '../types/database'
import { useCategories, useProducts, useAllDiscounts, useAllSpecials } from '../hooks/useSupabase'
import { useAdminPassword } from '../hooks/useAdminPassword'
import { supabase } from '../lib/supabase'
import { assertMutated } from '../lib/adminWrite'
import { formatPrice, resolveProductImageUrl } from '../lib/utils'
import ImageUpload from '../components/ImageUpload'
import toast from 'react-hot-toast'

type TabType = 'categories' | 'products' | 'discounts' | 'specials'

const CATEGORY_ACCENTS = [
  'from-teal-500/90 to-cyan-700/90',
  'from-sky-500/90 to-indigo-700/90',
  'from-emerald-500/90 to-teal-800/90',
  'from-rose-400/90 to-orange-600/90',
  'from-violet-500/90 to-fuchsia-700/90',
  'from-amber-400/90 to-orange-700/90',
]

const inputClass =
  'w-full px-4 py-3 text-slate-800 bg-white/90 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-400 transition-colors font-sora'
const labelClass = 'block text-xs font-sora font-semibold uppercase tracking-wider text-slate-500 mb-2'
const primaryBtnClass =
  'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-teal-600/25 hover:from-teal-500 hover:to-cyan-500 transition-all'
const modalPanelClass =
  'bg-white rounded-3xl p-8 w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-900/15 border border-slate-200/80 text-slate-900'

const AdminDashboard = () => {
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useCategories()
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts()
  const { discounts, loading: discountsLoading, refetch: refetchDiscounts } = useAllDiscounts()
  const { specials, loading: specialsLoading, refetch: refetchSpecials } = useAllSpecials()
  const { isAuthenticated, loading: authLoading, signInWithPassword, signOut } = useAdminPassword()

  const [activeTab, setActiveTab] = useState<TabType>('categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all')

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingDiscount, setEditingDiscount] = useState<DailyDiscount | null>(null)
  const [editingSpecial, setEditingSpecial] = useState<DailySpecial | null>(null)

  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [showSpecialForm, setShowSpecialForm] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [categoryForm, setCategoryForm] = useState<CategoryInsert>({
    name: '',
    description: '',
    order: 0,
  })

  const [productForm, setProductForm] = useState<ProductInsert>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category_id: '',
  })

  const [discountForm, setDiscountForm] = useState<DailyDiscountInsert>({
    product_id: '',
    discount_percentage: null,
    discount_amount: null,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    is_active: true,
  })
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage')

  const [specialForm, setSpecialForm] = useState<DailySpecialInsert>({
    product_id: '',
    special_label: "Today's Special",
    featured_date: new Date().toISOString().split('T')[0],
    is_active: true,
  })

  const q = searchQuery.trim().toLowerCase()

  const filteredCategories = useMemo(() => {
    if (!q) return categories
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
    )
  }, [categories, q])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category_id)
      const matchesCat = productCategoryFilter === 'all' || p.category_id === productCategoryFilter
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (cat?.name || '').toLowerCase().includes(q) ||
        String(p.price).includes(q)
      return matchesCat && matchesQ
    })
  }, [products, categories, productCategoryFilter, q])

  const categoryStats = useMemo(() => {
    return categories.map((category, index) => {
      const items = products.filter((p) => p.category_id === category.id)
      const cover = items.find((p) => p.image_url || p.image_urls?.[0])
      const coverUrl = resolveProductImageUrl(cover?.image_url || cover?.image_urls?.[0])
      return {
        category,
        count: items.length,
        coverUrl,
        accent: CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length],
      }
    })
  }, [categories, products])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    const result = await signInWithPassword(password)
    if (result.success) {
      toast.success('Welcome to Menu Studio')
    } else {
      toast.error(result.error || 'Invalid password')
    }
    setLoginLoading(false)
  }

  const handleLogout = async () => {
    await signOut()
    toast.success('Signed out')
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingCategory) {
        const { data, error } = await supabase
          .from('categories')
          .update(categoryForm as any)
          .eq('id', editingCategory.id)
          .select()
        assertMutated(data, error, 'Category update')
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert([categoryForm as any])
          .select()
        assertMutated(data, error, 'Category create')
      }
      await refetchCategories()
      toast.success(editingCategory ? 'Category updated' : 'Category added')
      setShowCategoryForm(false)
      setEditingCategory(null)
      setCategoryForm({ name: '', description: '', order: 0 })
    } catch (error: any) {
      console.error('Error saving category:', error)
      toast.error(error?.message || 'Error saving category')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category and its products?')) return
    try {
      const { data, error } = await supabase.from('categories').delete().eq('id', id).select()
      assertMutated(data, error, 'Category delete')
      await refetchCategories()
      await refetchProducts()
      toast.success('Category deleted')
    } catch (error: any) {
      console.error('Error deleting category:', error)
      toast.error(error?.message || 'Error deleting category')
    }
  }

  const startEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      order: category.order,
    })
    setShowCategoryForm(true)
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const existingImage =
        editingProduct?.image_url || editingProduct?.image_urls?.[0] || ''
      const imageUrl =
        productForm.image_url || (editingProduct ? existingImage : '') || ''
      const existingUrls = editingProduct?.image_urls?.filter(Boolean) || []
      const imageUrls =
        imageUrl && existingUrls.length
          ? [imageUrl, ...existingUrls.filter((u) => u !== imageUrl)]
          : imageUrl
            ? [imageUrl]
            : existingUrls

      const payload = {
        name: productForm.name.trim(),
        description: productForm.description || null,
        price: Number(productForm.price),
        image_url: imageUrl || null,
        image_urls: imageUrls.length ? imageUrls : null,
        category_id: productForm.category_id,
      }

      if (!Number.isFinite(payload.price) || payload.price < 0) {
        throw new Error('Enter a valid price')
      }

      if (editingProduct) {
        const { data, error } = await supabase
          .from('products')
          .update(payload as any)
          .eq('id', editingProduct.id)
          .select('id, name, price, image_url')
        const saved = assertMutated(data, error, 'Product update')
        toast.success(`Saved · ${saved.name} · ${formatPrice(Number(saved.price))}`)
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([payload as any])
          .select('id, name, price')
        assertMutated(data, error, 'Product create')
        toast.success('Product added')
      }

      await refetchProducts()
      setShowProductForm(false)
      setEditingProduct(null)
      setProductForm({ name: '', description: '', price: 0, image_url: '', category_id: '' })
    } catch (error: any) {
      console.error('Error saving product:', error)
      toast.error(error?.message || 'Error saving product')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try {
      const { data, error } = await supabase.from('products').delete().eq('id', id).select()
      assertMutated(data, error, 'Product delete')
      await refetchProducts()
      toast.success('Product deleted')
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error(error?.message || 'Error deleting product')
    }
  }

  const startEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      image_url: product.image_url || product.image_urls?.[0] || '',
      category_id: product.category_id,
    })
    setShowProductForm(true)
  }

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const discountData = {
        ...discountForm,
        discount_percentage: discountType === 'percentage' ? discountForm.discount_percentage : null,
        discount_amount: discountType === 'amount' ? discountForm.discount_amount : null,
      }

      if (editingDiscount) {
        const { data, error } = await supabase
          .from('daily_discounts')
          .update(discountData as any)
          .eq('id', editingDiscount.id)
          .select()
        assertMutated(data, error, 'Discount update')
      } else {
        const { data, error } = await supabase
          .from('daily_discounts')
          .insert([discountData as any])
          .select()
        assertMutated(data, error, 'Discount create')
      }
      await refetchDiscounts()
      toast.success(editingDiscount ? 'Discount updated' : 'Discount added')
      setShowDiscountForm(false)
      setEditingDiscount(null)
      setDiscountForm({
        product_id: '',
        discount_percentage: null,
        discount_amount: null,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        is_active: true,
      })
    } catch (error: any) {
      console.error('Error saving discount:', error)
      toast.error(error?.message || 'Error saving discount')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDiscount = async (id: string) => {
    if (!confirm('Delete this discount?')) return
    try {
      const { data, error } = await supabase.from('daily_discounts').delete().eq('id', id).select()
      assertMutated(data, error, 'Discount delete')
      await refetchDiscounts()
      toast.success('Discount deleted')
    } catch (error: any) {
      console.error('Error deleting discount:', error)
      toast.error(error?.message || 'Error deleting discount')
    }
  }

  const startEditDiscount = (discount: DailyDiscount) => {
    setEditingDiscount(discount)
    setDiscountType(discount.discount_percentage != null ? 'percentage' : 'amount')
    setDiscountForm({
      product_id: discount.product_id,
      discount_percentage: discount.discount_percentage,
      discount_amount: discount.discount_amount,
      start_date: discount.start_date,
      end_date: discount.end_date,
      is_active: discount.is_active,
    })
    setShowDiscountForm(true)
  }

  const handleSpecialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingSpecial) {
        const { data, error } = await supabase
          .from('daily_specials')
          .update(specialForm as any)
          .eq('id', editingSpecial.id)
          .select()
        assertMutated(data, error, 'Special update')
      } else {
        const { data, error } = await supabase
          .from('daily_specials')
          .insert([specialForm as any])
          .select()
        assertMutated(data, error, 'Special create')
      }
      await refetchSpecials()
      toast.success(editingSpecial ? 'Special updated' : 'Special added')
      setShowSpecialForm(false)
      setEditingSpecial(null)
      setSpecialForm({
        product_id: '',
        special_label: "Today's Special",
        featured_date: new Date().toISOString().split('T')[0],
        is_active: true,
      })
    } catch (error: any) {
      console.error('Error saving special:', error)
      toast.error(error?.message || 'Error saving special')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSpecial = async (id: string) => {
    if (!confirm('Delete this special?')) return
    try {
      const { data, error } = await supabase.from('daily_specials').delete().eq('id', id).select()
      assertMutated(data, error, 'Special delete')
      await refetchSpecials()
      toast.success('Special deleted')
    } catch (error: any) {
      console.error('Error deleting special:', error)
      toast.error(error?.message || 'Error deleting special')
    }
  }

  const startEditSpecial = (special: DailySpecial) => {
    setEditingSpecial(special)
    setSpecialForm({
      product_id: special.product_id,
      special_label: special.special_label,
      featured_date: special.featured_date,
      is_active: special.is_active,
    })
    setShowSpecialForm(true)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f8] flex items-center justify-center">
        <div className="rounded-3xl bg-black p-5 shadow-xl animate-pulse">
          <img
            src="/messenta-admin-logo.png"
            alt="Messanta"
            className="h-24 w-auto object-contain"
          />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#eef3f4]">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 opacity-35"
          style={{ backgroundImage: "url('/delicious-coffee-cup-indoors.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-[#eef6f5]/92 to-[#dceae8]/95" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[420px]"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.45 }}
              className="mx-auto w-fit rounded-[2rem] bg-black p-6 sm:p-7 shadow-2xl shadow-slate-900/30 ring-1 ring-white/10"
            >
              <img
                src="/messenta-admin-logo.png"
                alt="Messanta Coffee"
                className="h-28 sm:h-32 w-auto object-contain"
              />
            </motion.div>
            <h1 className="mt-6 text-3xl font-display font-bold text-slate-900 tracking-tight">
              Messanta
            </h1>
            <p className="mt-2 text-sm font-sora tracking-[0.18em] uppercase text-teal-700/80">
              Menu Studio
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 backdrop-blur-xl p-8 shadow-2xl shadow-teal-900/10">
            <p className="text-center text-slate-500 text-sm font-sora mb-6">
              Enter your password to manage the menu
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                    placeholder="••••••••••••"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-sora font-bold tracking-wide hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg shadow-teal-600/25 disabled:opacity-50"
              >
                {loginLoading ? 'Signing in…' : 'Enter Studio'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  if (categoriesLoading || productsLoading || discountsLoading || specialsLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f8] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 w-fit rounded-3xl bg-black p-4 shadow-lg animate-pulse">
            <img
              src="/messenta-admin-logo.png"
              alt=""
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="text-slate-500 font-sora text-sm tracking-wide">Loading studio…</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'categories' as TabType, label: 'Categories', icon: Layers, count: categories.length },
    { id: 'products' as TabType, label: 'Products', icon: Package, count: products.length },
    { id: 'discounts' as TabType, label: 'Discounts', icon: Percent, count: discounts.length },
    { id: 'specials' as TabType, label: 'Specials', icon: Sparkles, count: specials.length },
  ]

  const searchPlaceholder =
    activeTab === 'categories'
      ? 'Search categories…'
      : activeTab === 'products'
        ? 'Search products, prices, categories…'
        : activeTab === 'discounts'
          ? 'Search discounts…'
          : 'Search specials…'

  return (
    <div className="min-h-screen bg-[#f3f6f7] text-slate-900 relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[24rem] w-[24rem] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-2xl shadow-sm shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="rounded-2xl bg-black p-2.5 shadow-md ring-1 ring-black/40">
                <img
                  src="/messenta-admin-logo.png"
                  alt="Messanta"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-display font-bold text-slate-900 leading-tight truncate">
                  Menu Studio
                </h1>
                <p className="text-[11px] text-teal-700/80 font-sora tracking-[0.16em] uppercase">
                  Messanta Coffee
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-all font-sora"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200/80 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 font-sora text-sm"
            />
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[2rem] overflow-hidden border border-white/70 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white shadow-xl shadow-slate-900/20"
        >
          <div className="relative p-6 sm:p-8">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_20%,rgba(45,212,191,0.45),transparent_40%),radial-gradient(circle_at_10%_80%,rgba(56,189,248,0.25),transparent_35%)]" />
            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-teal-200/90 text-xs font-sora uppercase tracking-[0.2em] mb-2">
                  Live menu control
                </p>
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
                  Shape today’s menu
                </h2>
                <p className="mt-2 text-slate-300 font-sora text-sm max-w-xl">
                  Update prices, photos, and categories — changes appear on the public menu as soon as they save.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                {[
                  { label: 'Categories', value: categories.length, icon: LayoutDashboard },
                  { label: 'Products', value: products.length, icon: Package },
                  { label: 'Discounts', value: discounts.length, icon: Percent },
                  { label: 'Specials', value: specials.length, icon: Sparkles },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 backdrop-blur-sm min-w-[7.5rem]"
                  >
                    <stat.icon className="h-4 w-4 text-teal-200 mb-2" />
                    <p className="text-2xl font-sora font-bold tabular-nums">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-wider text-slate-300 font-sora">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mb-8 p-1.5 rounded-[1.5rem] border border-white/80 bg-white/80 shadow-sm backdrop-blur flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSearchQuery('')
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl font-sora text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span
                className={`ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                  activeTab === tab.id ? 'bg-white/15' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">Categories</h2>
                  <p className="text-sm text-slate-500 mt-1 font-sora">
                    Visual map of how guests browse the menu
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCategoryForm(true)
                    setEditingCategory(null)
                    setCategoryForm({ name: '', description: '', order: 0 })
                  }}
                  className={primaryBtnClass}
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredCategories.map((category) => {
                  const meta = categoryStats.find((s) => s.category.id === category.id)
                  const accent = meta?.accent || CATEGORY_ACCENTS[0]
                  return (
                    <motion.article
                      key={category.id}
                      layout
                      whileHover={{ y: -4 }}
                      className="group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-lg shadow-slate-900/5 min-h-[240px]"
                    >
                      <div className="absolute inset-0">
                        {meta?.coverUrl ? (
                          <img
                            src={meta.coverUrl}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${accent}`} />
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-t ${accent} opacity-80 mix-blend-multiply`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                      </div>

                      <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                        <div className="mb-auto flex items-start justify-between gap-3 pt-1">
                          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-sora uppercase tracking-wider backdrop-blur-md border border-white/20">
                            Order {category.order}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-white text-slate-900 px-3 py-1 text-xs font-sora font-bold tabular-nums shadow-sm">
                            {meta?.count ?? 0} items
                          </span>
                        </div>

                        <h3 className="text-2xl font-display font-bold leading-tight drop-shadow-sm">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="mt-2 text-sm text-white/80 font-sora line-clamp-2">
                            {category.description}
                          </p>
                        )}

                        <div className="mt-5 flex gap-2">
                          <button
                            onClick={() => startEditCategory(category)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white hover:bg-white/25 text-sm font-sora backdrop-blur-md transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 border border-red-300/30 text-red-100 hover:bg-red-500/35 text-sm font-sora backdrop-blur-md transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('products')
                              setProductCategoryFilter(category.id)
                              setSearchQuery('')
                            }}
                            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-900 text-sm font-sora font-semibold shadow-sm"
                          >
                            View items
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </div>

              {filteredCategories.length === 0 && (
                <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/60 py-20 text-center text-slate-400 font-sora">
                  No categories match your search
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">Products</h2>
                  <p className="text-sm text-slate-500 mt-1 font-sora">
                    {filteredProducts.length} of {products.length} shown
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowProductForm(true)
                    setEditingProduct(null)
                    setProductForm({
                      name: '',
                      description: '',
                      price: 0,
                      image_url: '',
                      category_id: productCategoryFilter !== 'all' ? productCategoryFilter : '',
                    })
                  }}
                  className={primaryBtnClass}
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </div>

              <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setProductCategoryFilter('all')}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-sora font-medium border transition-all ${
                    productCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setProductCategoryFilter(category.id)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-sora font-medium border transition-all ${
                      productCategoryFilter === category.id
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const category = categories.find((cat) => cat.id === product.category_id)
                  const img = resolveProductImageUrl(product.image_url || product.image_urls?.[0])
                  return (
                    <motion.article
                      key={product.id}
                      layout
                      className="group rounded-[1.5rem] border border-white bg-white/90 p-4 shadow-md shadow-slate-900/5 hover:shadow-xl hover:shadow-teal-900/5 transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                          {img ? (
                            <img
                              src={img}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-7 w-7 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] uppercase tracking-wider text-teal-700/80 font-sora mb-1">
                            {category?.name || 'Uncategorized'}
                          </p>
                          <h3 className="font-sora font-semibold text-slate-900 leading-snug line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="mt-2 text-xl font-display font-bold text-slate-900 tabular-nums">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                      {product.description && (
                        <p className="mt-3 text-sm text-slate-500 font-sora line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => startEditProduct(product)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-sora font-medium hover:bg-slate-800 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit price
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.article>
                  )
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/60 py-20 text-center text-slate-400 font-sora">
                  No products match your search
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'discounts' && (
            <motion.div
              key="discounts"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-[1.75rem] border border-white bg-white/90 p-6 sm:p-8 shadow-lg shadow-slate-900/5"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">Daily Discounts</h2>
                  <p className="text-sm text-slate-500 mt-1 font-sora">Limited-time price offers</p>
                </div>
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
                      is_active: true,
                    })
                    setDiscountType('percentage')
                  }}
                  className={primaryBtnClass}
                >
                  <Plus className="h-4 w-4" />
                  Add Discount
                </button>
              </div>

              <div className="space-y-3">
                {discounts
                  .filter((d) => {
                    if (!q) return true
                    const product = products.find((p) => p.id === d.product_id)
                    return (product?.name || '').toLowerCase().includes(q)
                  })
                  .map((discount) => {
                    const product = products.find((p) => p.id === discount.product_id)
                    const isActive =
                      discount.is_active &&
                      new Date(discount.start_date) <= new Date() &&
                      new Date(discount.end_date) >= new Date()
                    return (
                      <div
                        key={discount.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-sora font-semibold text-slate-900 truncate">
                            {product?.name || 'Unknown Product'}
                          </p>
                          <p className="text-sm text-slate-500 font-sora mt-1">
                            {discount.start_date} → {discount.end_date}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-sm font-semibold w-fit">
                          {discount.discount_percentage
                            ? `${discount.discount_percentage}% OFF`
                            : `${discount.discount_amount} ETB OFF`}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditDiscount(discount)}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDiscount(discount.id)}
                            className="p-2 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                {discounts.length === 0 && (
                  <div className="text-center py-16 text-slate-400 font-sora">
                    <Percent className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>No discounts yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'specials' && (
            <motion.div
              key="specials"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">Daily Specials</h2>
                  <p className="text-sm text-slate-500 mt-1 font-sora">Featured picks of the day</p>
                </div>
                <button
                  onClick={() => {
                    setShowSpecialForm(true)
                    setEditingSpecial(null)
                    setSpecialForm({
                      product_id: '',
                      special_label: "Today's Special",
                      featured_date: new Date().toISOString().split('T')[0],
                      is_active: true,
                    })
                  }}
                  className={primaryBtnClass}
                >
                  <Plus className="h-4 w-4" />
                  Add Special
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specials
                  .filter((s) => {
                    if (!q) return true
                    const product = products.find((p) => p.id === s.product_id)
                    return (
                      (product?.name || '').toLowerCase().includes(q) ||
                      s.special_label.toLowerCase().includes(q)
                    )
                  })
                  .map((special) => {
                    const product = products.find((p) => p.id === special.product_id)
                    const isToday =
                      special.featured_date === new Date().toISOString().split('T')[0]
                    const img = resolveProductImageUrl(
                      product?.image_url || product?.image_urls?.[0]
                    )
                    return (
                      <div
                        key={special.id}
                        className={`overflow-hidden rounded-[1.5rem] border shadow-md ${
                          isToday && special.is_active
                            ? 'border-teal-200 bg-gradient-to-br from-teal-50 to-white'
                            : 'border-white bg-white'
                        }`}
                      >
                        <div className="h-36 bg-slate-100 relative">
                          {img ? (
                            <img src={img} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Sparkles className="h-8 w-8 text-slate-300" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-sora font-semibold text-slate-800 backdrop-blur">
                            <Star className={`h-3.5 w-3.5 ${isToday ? 'text-amber-500' : 'text-slate-400'}`} />
                            {special.special_label}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-sora font-semibold text-slate-900">
                            {product?.name || 'Unknown Product'}
                          </h3>
                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 font-sora">
                            <Calendar className="h-4 w-4" />
                            {special.featured_date}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => startEditSpecial(special)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-sora"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSpecial(special.id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 text-sm font-sora"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showCategoryForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${modalPanelClass} max-w-md`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-display font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowCategoryForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={categoryForm.description || ''}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className={inputClass}
                  rows={3}
                />
              </div>
              <div>
                <label className={labelClass}>Order</label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className={`flex-1 ${primaryBtnClass}`}>
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showProductForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${modalPanelClass} max-w-lg`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-display font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className={inputClass}
                  rows={3}
                />
              </div>
              <div>
                <label className={labelClass}>Price (ETB)</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  className={inputClass}
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
                <label className={labelClass}>
                  Product Image
                  {editingProduct && (
                    <span className="ml-2 font-normal normal-case tracking-normal text-slate-400">
                      (optional — keep existing if unchanged)
                    </span>
                  )}
                </label>
                <ImageUpload
                  currentImageUrl={productForm.image_url || null}
                  onImageUploaded={(url) => setProductForm({ ...productForm, image_url: url })}
                  onImageRemoved={() => setProductForm({ ...productForm, image_url: '' })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className={`flex-1 ${primaryBtnClass}`}>
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showDiscountForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${modalPanelClass} max-w-md`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-display font-bold text-slate-900">
                {editingDiscount ? 'Edit Discount' : 'Add Discount'}
              </h3>
              <button onClick={() => setShowDiscountForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleDiscountSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Product</label>
                <select
                  value={discountForm.product_id}
                  onChange={(e) => setDiscountForm({ ...discountForm, product_id: e.target.value })}
                  className={inputClass}
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
                <label className={labelClass}>Discount Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDiscountType('percentage')}
                    className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                      discountType === 'percentage'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('amount')}
                    className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                      discountType === 'amount'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Fixed Amount (ETB)
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (ETB)'}
                </label>
                <input
                  type="number"
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  min="0"
                  max={discountType === 'percentage' ? '100' : undefined}
                  value={
                    discountType === 'percentage'
                      ? discountForm.discount_percentage || ''
                      : discountForm.discount_amount || ''
                  }
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || null
                    if (discountType === 'percentage') {
                      setDiscountForm({
                        ...discountForm,
                        discount_percentage: value,
                        discount_amount: null,
                      })
                    } else {
                      setDiscountForm({
                        ...discountForm,
                        discount_amount: value,
                        discount_percentage: null,
                      })
                    }
                  }}
                  className={inputClass}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input
                    type="date"
                    value={discountForm.start_date}
                    onChange={(e) => setDiscountForm({ ...discountForm, start_date: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input
                    type="date"
                    value={discountForm.end_date}
                    onChange={(e) => setDiscountForm({ ...discountForm, end_date: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="discount-active"
                  checked={discountForm.is_active}
                  onChange={(e) => setDiscountForm({ ...discountForm, is_active: e.target.checked })}
                  className="w-5 h-5 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="discount-active" className="text-sm font-medium text-slate-700">
                  Active
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className={`flex-1 ${primaryBtnClass}`}>
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDiscountForm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showSpecialForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${modalPanelClass} max-w-md`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-display font-bold text-slate-900">
                {editingSpecial ? 'Edit Special' : 'Add Special'}
              </h3>
              <button onClick={() => setShowSpecialForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSpecialSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Product</label>
                <select
                  value={specialForm.product_id}
                  onChange={(e) => setSpecialForm({ ...specialForm, product_id: e.target.value })}
                  className={inputClass}
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
                <label className={labelClass}>Special Label</label>
                <input
                  type="text"
                  value={specialForm.special_label}
                  onChange={(e) => setSpecialForm({ ...specialForm, special_label: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Featured Date</label>
                <input
                  type="date"
                  value={specialForm.featured_date}
                  onChange={(e) => setSpecialForm({ ...specialForm, featured_date: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="special-active"
                  checked={specialForm.is_active}
                  onChange={(e) => setSpecialForm({ ...specialForm, is_active: e.target.checked })}
                  className="w-5 h-5 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="special-active" className="text-sm font-medium text-slate-700">
                  Active
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className={`flex-1 ${primaryBtnClass}`}>
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSpecialForm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50"
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
