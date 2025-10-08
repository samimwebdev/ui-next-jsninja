'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Users, Clock, Calendar, BookOpen } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseItem } from '@/types/courses-page-types'
import { formatDuration } from '@/lib/utils'
import { formatDate } from '@/lib/bootcamp-utils'

interface CourseCardProps {
  course: CourseItem
  viewMode: 'grid' | 'list'
  showType?: boolean
}

// Helper function to format price
const formatPrice = (price: number): string => {
  if (!price || price <= 0) return 'Free'
  return `${price.toLocaleString()} Tk`
}

// Helper function to get course type styling - Updated for dark mode
const getCourseTypeStyle = (courseType: string) => {
  switch (courseType) {
    case 'course':
      return 'bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:text-white dark:border-blue-600'
    case 'bootcamp':
      return 'bg-purple-500 text-white border-purple-500 dark:bg-purple-600 dark:text-white dark:border-purple-600'
    case 'workshop':
      return 'bg-green-500 text-white border-green-500 dark:bg-green-600 dark:text-white dark:border-green-600'
    default:
      return 'bg-gray-500 text-white border-gray-500 dark:bg-gray-600 dark:text-white dark:border-gray-600'
  }
}

// Helper function to get difficulty styling - Updated for dark mode
const getDifficultyStyle = (level: string) => {
  const normalizedLevel = level?.toLowerCase()
  switch (normalizedLevel) {
    case 'beginner':
      return 'bg-emerald-500 text-white border-emerald-500 dark:bg-emerald-600 dark:text-white dark:border-emerald-600'
    case 'intermediate':
      return 'bg-amber-500 text-white border-amber-500 dark:bg-amber-600 dark:text-white dark:border-amber-600'
    case 'advanced':
      return 'bg-red-500 text-white border-red-500 dark:bg-red-600 dark:text-white dark:border-red-600'
    default:
      return 'bg-gray-500 text-white border-gray-500 dark:bg-gray-600 dark:text-white dark:border-gray-600'
  }
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  viewMode,
  showType = false,
}) => {
  // Safety checks
  if (!course) {
    return null
  }

  const hasDiscount = course.actualPrice && course.actualPrice > course.price

  const safeCategories = course.categories || []
  const courseLink =
    course.courseType === 'bootcamp'
      ? `/bootcamps/${course.slug}`
      : `/courses/${course.slug}`

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/3 relative h-48 md:h-auto">
            <Image
              src={
                course.featureImage?.formats?.medium?.url ||
                course.featureImage?.url ||
                '/images/placeholder.svg'
              }
              alt={course.title || 'Course'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Price Badge */}
            <div className="absolute top-3 left-3">
              <div className="flex items-baseline gap-2">
                <Badge className="bg-primary text-primary-foreground text-base font-bold px-3 py-1">
                  {course.price.toLocaleString()} Tk
                </Badge>
                {hasDiscount && (
                  <span className="text-base font-semibold text-gray-300 bg-ninja-navy line-through ml-1 px-2 py-1 rounded-full">
                    {course.actualPrice?.toLocaleString()} Tk
                  </span>
                )}
              </div>
            </div>
            {showType && course.courseType && (
              <div className="absolute top-3 right-3">
                <Badge
                  className={`font-semibold shadow-lg ${getCourseTypeStyle(
                    course.courseType
                  )}`}
                >
                  {course.courseType.charAt(0).toUpperCase() +
                    course.courseType.slice(1)}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {safeCategories.map((category, index) => (
                  <Badge
                    key={category.id || index}
                    variant="secondary"
                    className="text-xs"
                  >
                    {category.name}
                  </Badge>
                ))}
                {course.level && (
                  <Badge
                    className={`text-xs ${getDifficultyStyle(course.level)}`}
                  >
                    {course.level}
                  </Badge>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {course.title || 'Untitled Course'}
              </h3>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {course.shortDescription || 'No description available'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{(course.averageRating || 0).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{(course.totalStudents || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.duration || '')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.totalLessons || 0} lessons</span>
                </div>
              </div>

              {course.startingFrom && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>Starts: {formatDate(course.startingFrom)}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" asChild>
                <Link href={courseLink}>Enroll Now</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={courseLink}>View Details</Link>
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
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="p-0 relative">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={
                course.featureImage?.formats?.small?.url ||
                course.featureImage?.url ||
                '/images/placeholder.svg'
              }
              alt={course.title || 'Course'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="flex gap-2">
                <Badge className="text-base bg-primary font-semibold text-primary-foreground shadow-lg px-2 py-1 rounded-full">
                  {formatPrice(course.price || 0)}
                </Badge>

                {hasDiscount && (
                  <span className="text-base font-semibold text-gray-300 bg-ninja-navy line-through ml-1 px-2 py-1 rounded-full">
                    {formatPrice(course.actualPrice || 0)}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {showType && course.courseType && (
                  <Badge
                    className={`font-semibold shadow-lg ${getCourseTypeStyle(
                      course.courseType
                    )}`}
                  >
                    {course.courseType.charAt(0).toUpperCase() +
                      course.courseType.slice(1)}
                  </Badge>
                )}
                {course.level && (
                  <Badge
                    className={`font-semibold shadow-lg ${getDifficultyStyle(
                      course.level
                    )}`}
                  >
                    {course.level}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {safeCategories.map((category, index) => (
              <Badge
                key={category.id || index}
                variant="secondary"
                className="text-xs"
              >
                {category.name}
              </Badge>
            ))}
          </div>

          <CardTitle className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title || 'Untitled Course'}
          </CardTitle>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {course.shortDescription || 'No description available'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>{(course.averageRating || 0).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{(course.totalStudents || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(course.duration || '')}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{course.totalLessons || 0} lessons</span>
            </div>
          </div>

          {course.startingFrom && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Calendar className="h-3 w-3" />
              <span>Starts: {formatDate(course.startingFrom)}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant="outline"
            asChild
          >
            <Link href={courseLink}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
