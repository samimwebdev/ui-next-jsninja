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

  const discountPercentage =
    actualPrice && actualPrice > price
      ? Math.round(((actualPrice - price) / actualPrice) * 100)
      : null

  return (
    <div
      className="bg-card rounded-lg p-5 sm:p-6 lg:p-7 shadow-lg"
      id="course-pricing"
    >
      <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold mb-5 sm:mb-6 text-center lg:text-left">
        Course Features
      </h2>

      {/* Mobile: Center container, Desktop: Left align */}
      <div className="flex flex-col items-center lg:items-start mb-6">
        <ul className="space-y-3 sm:space-y-4 inline-flex flex-col">
          {courseInfo.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 sm:gap-3">
              <CircleCheckBig className="w-5 h-5 sm:w-6 sm:h-6 text-ninja-gold-light dark:text-ninja-gold-dark flex-shrink-0" />
              <span className="text-lg whitespace-nowrap">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 sm:mt-7">
        {/* Price Display */}
        <div className="mb-4 sm:mb-5 text-center lg:text-left">
          <div className="flex items-baseline justify-center lg:justify-start gap-2 sm:gap-3 mb-3">
            <div className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-bold text-ninja-gold">
              {formatPrice(price)}
            </div>

            {actualPrice && actualPrice > price && (
              <div className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(actualPrice)}
              </div>
            )}
          </div>

          {discountPercentage && (
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 mb-4">
              <span className="animate-pulse text-base sm:text-lg">🔥</span>
              <span className="ml-1.5">Save {discountPercentage}%</span>
            </div>
          )}
        </div>

        <GenericButton
          courseInfo={courseInfo}
          className="w-full text-base sm:text-lg lg:text-xl py-3 sm:py-3.5 lg:py-4 font-semibold"
          label="Enroll Now"
          checkOnMount={true}
        />
      </div>
    </div>
  )
}
