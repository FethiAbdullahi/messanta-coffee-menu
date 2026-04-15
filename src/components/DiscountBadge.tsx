import { motion } from 'framer-motion'
import { Percent, Tag } from 'lucide-react'
import { DailyDiscount } from '../types/database'

interface DiscountBadgeProps {
  discount: DailyDiscount
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const DiscountBadge = ({ discount, size = 'md', className = '' }: DiscountBadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const getDiscountText = () => {
    if (discount.discount_percentage) {
      return `${discount.discount_percentage}% OFF`
    }
    if (discount.discount_amount) {
      return `${discount.discount_amount} ETB OFF`
    }
    return 'SALE'
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center space-x-1 font-sora font-semibold
        bg-gradient-to-r from-red-500 to-rose-500 text-white
        rounded-full shadow-lg
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {discount.discount_percentage ? (
        <Percent className={iconSizes[size]} />
      ) : (
        <Tag className={iconSizes[size]} />
      )}
      <span>{getDiscountText()}</span>
    </motion.div>
  )
}

interface SpecialBadgeProps {
  label: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const SpecialBadge = ({ label, size = 'md', className = '' }: SpecialBadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center space-x-1 font-sora font-semibold
        bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900
        rounded-full shadow-lg
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <span>⭐</span>
      <span>{label}</span>
    </motion.div>
  )
}

export default DiscountBadge

