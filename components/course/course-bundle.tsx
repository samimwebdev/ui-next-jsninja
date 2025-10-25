import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CourseBase,
  CourseBundleContentSection,
} from '@/types/course-page-types'
import { formatDuration } from '@/lib/utils'
import { formatPrice } from '@/lib/course-utils'
import { CourseType } from '@/types/checkout-types'

// Helper function to get course URL based on course type
function getCourseUrl(courseType: CourseType, slug: string): string {
  switch (courseType) {
    case 'bootcamp':
      return `/bootcamps/${slug}`
    case 'workshop':
      return `/workshops/${slug}`
    case 'course-bundle':
      return `/course-bundles/${slug}`
    case 'course':
    default:
      return `/courses/${slug}`
  }
}

export const CourseBundle: React.FC<{
  data: CourseBundleContentSection | undefined
  courseInfo: {
    title: string
    price: number
    features: string[]
    courseType: CourseType
    slug: string
  }
}> = ({ data, courseInfo }) => {
  const bundle = data?.courseBundle
  const title = data?.title || 'Course Bundle to take a look'
  const description =
    data?.description ||
    'Enroll the course bundle to get access to all the courses at an affordable price'

  // Calculate bundle savings
  const calculateSavings = (bundlePrice: number, courses: CourseBase[]) => {
    const totalCoursePrice = courses.reduce(
      (total, course) => total + (course.price || 0),
      0
    )
    const savings = totalCoursePrice - bundlePrice
    const savingsPercentage = Math.round((savings / totalCoursePrice) * 100)
    return { savings, savingsPercentage, totalCoursePrice }
  }

  if (!bundle?.courseBases.length) {
    return (
      <div className="bg-background text-foreground px-4 sm:px-0 my-8 sm:my-12">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              {description}
            </p>
          </div>
          <p className="text-muted-foreground text-center lg:text-left">
            No course bundles available at the moment.
          </p>
        </div>
      </div>
    )
  }

  const { savings, savingsPercentage, totalCoursePrice } = calculateSavings(
    bundle.price,
    bundle.courseBases || []
  )

  return (
    <div className="bg-background text-foreground px-4 sm:px-0 my-8 sm:my-12">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto lg:mx-0">
            {description}
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {bundle.courseBases?.map((course) => (
            <Link
              key={course.id}
              href={getCourseUrl(course.courseType, course.slug)}
              className="group block"
            >
              <Card className="group relative overflow-hidden border-2 border-primary/20 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg cursor-pointer h-full">
                <CardHeader className="space-y-1 p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-xs sm:text-sm"
                    >
                      {course.totalLessons + ''}{' '}
                      {course.totalLessons > 1 ? 'Lessons' : 'Lesson'}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{formatDuration(course.duration || '0')}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={
                        course.featureImage?.formats?.medium?.url ||
                        'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=2940'
                      }
                      alt={course.title}
                      className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      width={600}
                      height={300}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-muted-foreground line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">
                      {course.shortDescription || course.longDescription}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors">
                        {formatPrice(course.price)}
                      </span>
                      <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                          View Details
                        </span>
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bundle Offer Section */}
        <Card className="border-2 border-primary bg-primary/5 p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-xl">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold">{bundle.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-center lg:text-left">
                  Bundle Includes:
                </h3>
                <ul className="space-y-2">
                  {bundle.courseBases?.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-center gap-2 transition-transform hover:translate-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                      <Link
                        href={getCourseUrl(course.courseType, course.slug)}
                        className="hover:text-primary hover:underline transition-colors text-sm sm:text-base"
                      >
                        {course.title}
                      </Link>
                    </li>
                  ))}
                  {bundle.features?.map((feature) => (
                    <li
                      key={feature.id}
                      className="flex items-center gap-2 transition-transform hover:translate-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                      <span className="text-sm sm:text-base">
                        {feature.feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-muted-foreground">
                      Total Price:
                    </span>
                    <span className="text-lg sm:text-xl line-through">
                      {formatPrice(totalCoursePrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-muted-foreground">
                      Bundle Price:
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      {formatPrice(bundle.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-muted-foreground">
                      You Save:
                    </span>
                    <span className="text-lg sm:text-xl font-semibold text-primary">
                      {formatPrice(savings)} ({savingsPercentage}%)
                    </span>
                  </div>
                </div>
                <Link
                  href={`/checkout?courseSlug=${courseInfo.slug}&courseType=${courseInfo.courseType}`}
                >
                  <Button
                    size="lg"
                    className="w-full gap-2 btn-ninja-primary text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-[#D81B60] transition-colors mt-4 text-sm sm:text-base"
                  >
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
