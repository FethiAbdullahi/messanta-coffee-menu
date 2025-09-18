import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

interface CountingNumberProps {
  end: number
  duration?: number
  suffix?: string
  className?: string
}

const CountingNumber = ({ end, duration = 2, suffix = '', className = '' }: CountingNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.floor(easeOutQuart * end)
        
        setCount(currentCount)
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
      }
    }
  }, [end, duration, isInView])

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  )
}

export default CountingNumber
