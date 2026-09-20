import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, DailyDiscount, DailySpecial } from '../types/database'
import { formatPrice, resolveProductImageUrl } from '../lib/utils'
import { Star, ShoppingCart, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import DiscountBadge, { SpecialBadge } from './DiscountBadge'
import { calculateDiscountedPrice } from '../hooks/useSupabase'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  discount?: DailyDiscount | null
  special?: DailySpecial | null
}

function getGallery(product: Product): string[] {
  const fromArray = (product.image_urls || []).filter(Boolean)
  if (fromArray.length > 0) return fromArray
  if (product.image_url) return [product.image_url]
  return []
}

const ProductCard = ({ product, discount, special }: ProductCardProps) => {
  const discountedPrice = calculateDiscountedPrice(product.price, discount || null)
  const hasDiscount = discount && discountedPrice < product.price
  const effectivePrice = hasDiscount ? discountedPrice : product.price

  const { addItem } = useCart()
  const [slide, setSlide] = useState(0)

  const gallery = getGallery(product)
  const currentSrc = gallery[slide] || gallery[0]

  const cartItem = {
    productId: product.id,
    name: product.name,
    price: effectivePrice,
    imageUrl: product.image_url || gallery[0] || null,
  }

  const handleAddToCart = () => {
    addItem(cartItem)
    toast.success(`${product.name} added to cart`)
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSlide((s) => (s - 1 + gallery.length) % gallery.length)
  }

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSlide((s) => (s + 1) % gallery.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -10,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
        {currentSrc ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSrc}
              src={resolveProductImageUrl(currentSrc)}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-60">☕</span>
          </div>
        )}

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSlide(i)
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === slide ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
          {hasDiscount && <DiscountBadge discount={discount} size="sm" />}
          {special && <SpecialBadge label={special.special_label} size="sm" />}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-sora font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-200">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-sora font-light leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-500 font-sora font-medium ml-2">4.8</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-sora font-bold text-red-600">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-lg font-sora font-medium text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <span className="text-xs text-red-500 font-sora font-medium">Special Price!</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-sora font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-gray-500 font-sora font-light">per serving</span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border-2 border-amber-400 text-amber-700 font-sora font-semibold rounded-xl hover:bg-amber-50 transition-colors text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
          <button
            type="button"
            disabled
            title="Online ordering coming soon"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-200 text-slate-500 font-sora font-semibold rounded-xl cursor-not-allowed text-xs sm:text-sm"
          >
            <Clock className="h-4 w-4 shrink-0" />
            <span className="leading-tight text-center">Order Now — Coming Soon</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
