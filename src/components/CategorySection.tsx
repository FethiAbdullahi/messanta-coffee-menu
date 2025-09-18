import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Category, Product } from '../types/database'
import ProductCard from './ProductCard'
import { Coffee, ArrowRight, Star } from 'lucide-react'

interface CategorySectionProps {
  category: Category
  products: Product[]
  showAll?: boolean
}

const CategorySection = ({ category, products, showAll = false }: CategorySectionProps) => {
  const displayProducts = showAll ? products : products.slice(0, 4)

  // Category-specific styling and icons
  const getCategoryStyle = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'hot drinks':
        return {
          gradient: 'from-amber-50 via-orange-50 to-red-50',
          accent: 'from-amber-400 to-orange-500',
          icon: '☕',
          bgPattern: 'hot-drinks-pattern'
        }
      case 'cold drinks':
        return {
          gradient: 'from-blue-50 via-cyan-50 to-teal-50',
          accent: 'from-blue-400 to-cyan-500',
          icon: '🧊',
          bgPattern: 'cold-drinks-pattern'
        }
      case 'mojitos':
        return {
          gradient: 'from-green-50 via-emerald-50 to-lime-50',
          accent: 'from-green-400 to-emerald-500',
          icon: '🍃',
          bgPattern: 'mojitos-pattern'
        }
      case 'smoothies & juices':
        return {
          gradient: 'from-pink-50 via-rose-50 to-purple-50',
          accent: 'from-pink-400 to-purple-500',
          icon: '🥤',
          bgPattern: 'smoothies-pattern'
        }
      case 'cakes & pastries':
        return {
          gradient: 'from-yellow-50 via-amber-50 to-orange-50',
          accent: 'from-yellow-400 to-amber-500',
          icon: '🧁',
          bgPattern: 'cakes-pattern'
        }
      default:
        return {
          gradient: 'from-gray-50 via-slate-50 to-zinc-50',
          accent: 'from-gray-400 to-slate-500',
          icon: '☕',
          bgPattern: 'default-pattern'
        }
    }
  }

  const categoryStyle = getCategoryStyle(category.name)

  return (
    <section id={`category-${category.id}`} className={`py-20 relative overflow-hidden bg-gradient-to-br ${categoryStyle.gradient}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`w-full h-full ${categoryStyle.bgPattern}`}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 opacity-10">
        <div className={`w-full h-full bg-gradient-to-br ${categoryStyle.accent} rounded-full animate-pulse`}></div>
      </div>
      <div className="absolute bottom-10 left-10 w-24 h-24 opacity-10">
        <div className={`w-full h-full bg-gradient-to-br ${categoryStyle.accent} rounded-full animate-bounce`}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <span className="text-4xl">{categoryStyle.icon}</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-sora font-bold text-gray-900 mb-6 leading-tight">
            {category.name}
          </h2>
          
          {category.description && (
            <p className="text-xl md:text-2xl text-gray-600 font-sora font-light max-w-3xl mx-auto leading-relaxed">
              {category.description}
            </p>
          )}

          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-8">
            <div className={`w-24 h-1 bg-gradient-to-r ${categoryStyle.accent} rounded-full`}></div>
            <div className="mx-4 w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className={`w-24 h-1 bg-gradient-to-r ${categoryStyle.accent} rounded-full`}></div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <ProductCard product={product} categoryId={category.id} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {!showAll && products.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to={`/category/${category.id}`}
              className="group inline-flex items-center px-10 py-4 bg-white text-gray-900 font-sora font-semibold rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-gray-300"
            >
              <span className="text-lg">Explore All {category.name}</span>
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        )}

        {/* Category Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-8 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <Coffee className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-sora font-medium">
                {products.length} Items
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-700 font-sora font-medium">
                Premium Quality
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✨</span>
              <span className="text-gray-700 font-sora font-medium">
                Fresh Daily
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CategorySection