'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Package,
  Users,
  DollarSign,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseBundleItem } from '@/types/courses-page-types'
import { CourseBase } from '@/types/shared-types'

interface CourseBundleCardProps {
  bundle: CourseBundleItem
  viewMode: 'grid' | 'list'
}

// Helper function to format price
const formatPrice = (price: number): string => {
  if (!price || price <= 0) return 'Free'
  return `${price.toLocaleString()}  Tk`
}

// Calculate bundle savings
const calculateSavings = (bundle: CourseBundleItem): number => {
  const totalIndividualPrice =
    bundle.courseBases?.reduce((sum, course) => sum + (course.price || 0), 0) ||
    0
  return totalIndividualPrice - (bundle.price || 0)
}

// Helper function to get course link
const getCourseLink = (course: CourseBase): string => {
  return course.courseType === 'bootcamp'
    ? `/bootcamps/${course.slug}`
    : `/courses/${course.slug}`
}

export const CourseBundleCard: React.FC<CourseBundleCardProps> = ({
  bundle,
  viewMode,
}) => {
  const savings = calculateSavings(bundle)
  const totalStudents =
    bundle.courseBases?.reduce(
      (sum, course) => sum + (course.totalStudents || 0),
      0
    ) || 0
  const averageRating =
    bundle.courseBases && bundle.courseBases.length > 0
      ? bundle.courseBases.reduce(
          (sum, course) => sum + (course.averageRating || 0),
          0
        ) / bundle.courseBases.length
      : 0

  // Get bundle slug from documentId or fallback to id
  const bundleSlug = bundle.slug

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-primary/20">
        <div className="flex flex-col md:flex-row">
          {/* Image or Icon */}
          <div className="md:w-1/3 relative h-48 md:h-auto bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            {bundle.featureImage ? (
              <Image
                src={
                  bundle.featureImage.formats?.small?.url ||
                  bundle.featureImage.url ||
                  '/images/placeholder.svg'
                }
                alt={bundle.title || 'Course Bundle'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Package className="h-16 w-16 text-primary/60" />
            )}

            {/* Bundle Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary text-primary-foreground font-semibold shadow-lg">
                Bundle
              </Badge>
            </div>

            {savings > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-emerald-500 text-white font-semibold shadow-lg dark:bg-emerald-600 dark:text-white">
                  Save {formatPrice(savings)}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-4 w-4 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  {bundle.courseBases?.length || 0} Courses Included
                </Badge>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {bundle.title || 'Course Bundle'}
              </h3>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {bundle.shortDescription || 'Comprehensive course bundle'}
              </p>

              {bundle.helperText && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {bundle.helperText}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{totalStudents.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatPrice(bundle.price || 0)}</span>
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <span>★</span>
                    <span>{averageRating.toFixed(1)} avg rating</span>
                  </div>
                )}
              </div>

              {/* Included Courses Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-3">
                  Included Courses:
                </h4>
                <div className="space-y-2">
                  {(bundle.courseBases || []).slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={getCourseLink(course)}
                          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors block truncate"
                        >
                          {course.title}
                          <ExternalLink className="h-3 w-3 ml-1 inline" />
                        </Link>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(course.categories || [])
                            .slice(0, 2)
                            .map((category, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs px-1 py-0"
                              >
                                {category.name}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(bundle.courseBases?.length || 0) > 3 && (
                    <div className="text-xs text-muted-foreground pl-5">
                      +{(bundle.courseBases?.length || 0) - 3} more courses
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" asChild>
                <Link href={`/bundles/${bundleSlug}`}>Get Bundle</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/bundles/${bundleSlug}`}>View All Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 group border-primary/20">
        <CardHeader className="p-0 relative">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            {bundle.featureImage ? (
              <Image
                src={
                  bundle.featureImage.formats?.medium?.url ||
                  bundle.featureImage.url ||
                  '/images/placeholder.svg'
                }
                alt={bundle.title || 'Course Bundle'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Package className="h-16 w-16 text-primary/60" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <Badge className="bg-primary text-base text-primary-foreground font-semibold shadow-lg">
                Bundle
              </Badge>
              {savings > 0 && (
                <Badge className="bg-emerald-500 text-base text-white font-semibold shadow-lg dark:bg-emerald-600 dark:text-white">
                  Save {formatPrice(savings)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-primary" />
            <Badge variant="secondary" className="text-xs">
              {bundle.courseBases?.length || 0} Courses
            </Badge>
          </div>

          <CardTitle className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {bundle.title || 'Course Bundle'}
          </CardTitle>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {bundle.shortDescription || 'Comprehensive course bundle'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{totalStudents.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{formatPrice(bundle.price || 0)}</span>
            </div>
          </div>

          {/* Featured Courses Preview */}
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">
              Featured courses:
            </div>
            <div className="space-y-1">
              {(bundle.courseBases || []).slice(0, 2).map((course) => (
                <Link
                  key={course.id}
                  href={getCourseLink(course)}
                  className="block text-xs text-primary text-ninja-gold-light dark:text-ninja-gold-dark transition-colors truncate"
                >
                  • {course.title}
                </Link>
              ))}
              {(bundle.courseBases?.length || 0) > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{(bundle.courseBases?.length || 0) - 2} more
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant="outline"
            asChild
          >
            <Link href={`/bundles/${bundleSlug}`}>View Bundle</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
