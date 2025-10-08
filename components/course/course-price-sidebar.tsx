import { CircleCheckBig } from 'lucide-react'
import { formatPrice } from '@/lib/course-utils'
import GenericButton from '../shared/generic-button'
import { CourseType } from '@/types/checkout-types'

interface CourseSidebarProps {
  courseInfo: {
    title: string
    price: number
    courseType: CourseType
    features: string[]
    slug: string
    isRegistrationOpen: boolean
    endDate: string | null
    actualPrice?: number | null
  }
}

export function CoursePriceSidebar({ courseInfo }: CourseSidebarProps) {
  const { price, actualPrice } = courseInfo

  // Calculate discount percentage if actualPrice exists
  const discountPercentage =
    actualPrice && actualPrice > price
      ? Math.round(((actualPrice - price) / actualPrice) * 100)
      : null

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg" id="course-pricing">
      <h2 className="text-2xl font-bold mb-4">Course Features</h2>
      <ul className="space-y-3">
        {courseInfo.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CircleCheckBig className="w-5 h-5 mr-1 text-ninja-gold-light dark:text-ninja-gold-dark flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {/* Price Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-3 mb-2">
            {/* Current Price (Discounted) */}
            <div className="text-3xl font-bold text-ninja-gold">
              {formatPrice(price)}
            </div>

            {/* Original Price (Crossed Out) */}
            {actualPrice && actualPrice > price && (
              <div className="text-lg text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(actualPrice)}
              </div>
            )}
          </div>

          {/* Discount Badge */}
          {discountPercentage && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 mb-3">
              <span className="animate-pulse">🔥</span>
              <span className="ml-1">Save {discountPercentage}%</span>
            </div>
          )}

          {/* Limited Time Notice */}
          {/* {discountPercentage && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Limited time discount - regular price applies after offer ends
            </p>
          )} */}
        </div>

        <GenericButton
          courseInfo={courseInfo}
          className="w-full"
          label="Enroll Now"
          checkOnMount={true}
        />
      </div>
    </div>
  )
}
