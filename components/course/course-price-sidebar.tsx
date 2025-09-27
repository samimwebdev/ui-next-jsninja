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
  }
}

export function CoursePriceSidebar({ courseInfo }: CourseSidebarProps) {
  const { price } = courseInfo
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
        <div className="text-3xl font-bold mb-4">{formatPrice(price)}</div>
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
