'use client'

import { CircleCheckBig } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatPrice } from '@/lib/course-utils'

interface CourseSidebarProps {
  courseInfo: {
    title: string
    price: number
    features: string[]
    slug: string
  }
  slug: string
}

export function CourseSidebar({ courseInfo, slug }: CourseSidebarProps) {
  console.log({ courseInfo, slug }, 'Course Sidebar Data')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleEnrollClick = async () => {
    setIsLoading(true)
    try {
      router.push(`/checkout?courseId=${slug}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Course Features</h2>
      <ul className="space-y-3">
        {courseInfo.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CircleCheckBig className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <div className="text-3xl font-bold mb-4">
          {formatPrice(courseInfo.price)}
        </div>

        <motion.button
          className="w-full bg-[#E91E63] text-white py-3 px-6 rounded-lg hover:bg-[#D81B60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleEnrollClick}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Loading...' : 'Enroll Now'}
        </motion.button>
      </div>
    </div>
  )
}
