import { motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
import { Product } from '../types/database'
import { formatPrice } from '../lib/utils'
import { Star, Heart, Eye } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-square overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 flex items-center justify-center">
            <span className="text-6xl opacity-60">☕</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200">
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200">
            <Eye className="h-4 w-4 text-gray-600 hover:text-blue-500" />
          </button>
        </div>

        {/* Premium Badge */}
        {/* <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-sora font-semibold shadow-lg">
            Premium
          </div>
        </div> */}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-xl font-sora font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-200">
          {product.name}
        </h3>
        
        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-sora font-light leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-500 font-sora font-medium ml-2">4.8</span>
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-sora font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-gray-500 font-sora font-light">per serving</span>
          </div>
          
          {/* <Link
            to={`/category/${categoryId}`}
            className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-sora font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="text-sm">Order Now</span>
            <motion.span
              className="ml-2"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </Link> */}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-yellow-200/20 to-amber-200/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>
    </motion.div>
  )
}

export default ProductCard