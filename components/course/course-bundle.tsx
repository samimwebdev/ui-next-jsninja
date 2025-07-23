import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Clock,
  DollarSign,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CourseBase,
  CourseBundleContentSection,
} from '@/types/course-page-types'
import { formatDuration } from '@/lib/utils'
import { formatPrice } from '@/lib/course-utils'

export const CourseBundle: React.FC<{
  data: CourseBundleContentSection | undefined
}> = ({ data }) => {
  const bundle = data?.courseBundle
  const title = data?.title || 'Course Bundle to take a look'
  const description =
    data?.description ||
    'Enroll the course bundle to get access to all the courses at a affordable price'

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
      <div className="bg-background text-foreground">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>
          <p className="text-muted-foreground">
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
    <div className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Course Bundle Header */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {bundle.courseBases?.map((course) => (
            <Card
              key={course.id}
              className="group relative overflow-hidden border-2 border-primary/20 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {course.totalLessons + ''}{' '}
                    {course.totalLessons > 1 ? 'Lessons' : 'Lesson'}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(course.duration || '0')}</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={
                      course.featureImage?.url ||
                      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=2940'
                    }
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    width={600}
                    height={300}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {course.shortDescription || course.longDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {formatPrice(course.price)}
                    </span>
                    <Link href={`/courses/${course.slug}`}>
                      <Button
                        variant="outline"
                        className="gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <BookOpen className="w-4 h-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bundle Offer Section */}
        <Card className="border-2 border-primary bg-primary/5 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold">{bundle.title}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Bundle Includes:</h3>
                <ul className="space-y-2">
                  {bundle.courseBases?.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-center gap-2 transition-transform hover:translate-x-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{course.title}</span>
                    </li>
                  ))}
                  {bundle.features?.map((feature) => (
                    <li
                      key={feature.id}
                      className="flex items-center gap-2 transition-transform hover:translate-x-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{feature.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Price:</span>
                    <span className="text-xl line-through">
                      {formatPrice(totalCoursePrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bundle Price:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(bundle.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">You Save:</span>
                    <span className="text-xl font-semibold text-primary">
                      {formatPrice(savings)} ({savingsPercentage}%)
                    </span>
                  </div>
                </div>
                <Link href={`/checkout?bundle=${bundle.documentId}`}>
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-primary hover:bg-primary/90 transition-colors mt-4"
                  >
                    <DollarSign className="w-4 h-4" />
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
