import { CircleCheckBig } from 'lucide-react'
import { formatPrice } from '@/lib/course-utils'
import GenericButton from '../shared/generic-button'

interface CourseSidebarProps {
  courseInfo: {
    title: string
    price: number
    features: string[]
    slug: string
  }
  slug: string
}

export function CoursePriceSidebar({ courseInfo, slug }: CourseSidebarProps) {
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

        <GenericButton
          courseSlug={slug}
          label="Enroll Now"
          className="w-full"
        />
      </div>
    </div>
  )
}
