'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CourseType } from '@/types/checkout-types'

interface EnrollButtonProps {
  courseSlug: string
  courseType: CourseType
  label?: string
  className?: string
}

export default function GenericButton({
  courseSlug,
  courseType,
  label = 'Enroll Now',
  className = '',
}: EnrollButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      router.push(`/checkout?courseSlug=${courseSlug}&courseType=${courseType}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.button
      className={`w-full bg-[#E91E63] text-white py-3 px-6 rounded-lg hover:bg-[#D81B60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={handleClick}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? 'Loading...' : label}
    </motion.button>
  )
}
