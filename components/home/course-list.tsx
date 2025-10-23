'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Course, CourseSectionData } from '@/types/home-page-types'
import { formatDuration } from '@/lib/utils'

const CourseCard = ({ course }: { course: Course }) => {
  if (!course?.baseContent) {
    return (
      <div className="w-full flex-shrink-0 px-2 sm:px-4">
        <Card className="overflow-hidden h-full flex flex-col opacity-50">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full overflow-hidden bg-muted">
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground">
                  No content available
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-xl mb-2">Course Unavailable</CardTitle>
            <CardDescription className="mb-4">
              This course content is currently unavailable.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  }

  const {
    title = 'Untitled Course',
    shortDescription = 'No description available',
    slug = '',
    price = 0,
    actualPrice = null,
    level = 'Unknown',
    duration = 0,
    featureImage = null,
    categories = [],
    browseCoursesBtn = null,
  } = course.baseContent

  const hasDiscount = actualPrice && actualPrice > price
  const discountPercentage = hasDiscount
    ? Math.round(((actualPrice - price) / actualPrice) * 100)
    : null

  const cardContent = (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={
              featureImage?.formats?.small?.url ||
              featureImage?.url ||
              '/images/placeholder.svg'
            }
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <Badge className="bg-primary text-primary-foreground text-sm sm:text-base font-bold px-2 sm:px-3 py-1">
                {price.toLocaleString()} Tk
              </Badge>
              {hasDiscount && (
                <span className="text-xs sm:text-base font-semibold text-gray-300 bg-ninja-navy line-through px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  {actualPrice?.toLocaleString()} Tk
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold border border-red-200">
                Save {discountPercentage}%
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg sm:text-xl mb-2 line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="mb-4 line-clamp-2 text-sm">
          {shortDescription}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {categories[0]?.name}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {formatDuration(duration)}
          </Badge>
          <Badge className="text-xs">{level}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-sm"
          variant="outline"
          disabled={!slug}
        >
          {browseCoursesBtn?.btnLabel || 'Enroll Now'}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <motion.div
      // ✅ Fixed: Responsive width classes
      className="w-full md:w-1/2 xl:w-1/3 flex-shrink-0 px-2 sm:px-4 group cursor-pointer"
      whileHover={{ scale: slug ? 1.03 : 1 }}
      key={course.documentId}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {slug ? (
        <Link href={`/courses/${slug}`} className="h-full">
          {cardContent}
        </Link>
      ) : (
        <div className="h-full cursor-not-allowed opacity-75">
          {cardContent}
        </div>
      )}
    </motion.div>
  )
}

export const CourseList: React.FC<{ data: CourseSectionData }> = ({
  data: courseSectionData,
}) => {
  const courseList = courseSectionData.courses || []
  const [currentIndex, setCurrentIndex] = useState(0)

  // Responsive courses per page
  const [coursesPerPage, setCoursesPerPage] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCoursesPerPage(1) // Mobile: 1 course
      } else if (window.innerWidth < 1280) {
        setCoursesPerPage(2) // Tablet: 2 courses
      } else {
        setCoursesPerPage(3) // Desktop: 3 courses
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalPages = Math.ceil(courseList.length / coursesPerPage)

  useEffect(() => {
    if (totalPages > 1) {
      const timer = setInterval(() => {
        nextSlide()
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [totalPages]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!courseSectionData) {
    return (
      <div className="w-full max-w-screen-xl py-8 sm:py-12 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Course section data unavailable.
          </p>
        </div>
      </div>
    )
  }

  if (courseList.length === 0) {
    return (
      <div className="w-full max-w-screen-xl py-8 sm:py-12 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4">
            {courseSectionData.title || 'Courses'}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto px-4">
            {courseSectionData.description || 'Explore our courses'}
          </p>
          <div className="text-center">
            <p className="text-muted-foreground">
              No courses available at the moment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages)
  }

  const startIndex = currentIndex * coursesPerPage
  const visibleCourses = courseList.slice(
    startIndex,
    startIndex + coursesPerPage
  )

  if (
    visibleCourses.length < coursesPerPage &&
    courseList.length > coursesPerPage
  ) {
    const remaining = coursesPerPage - visibleCourses.length
    visibleCourses.push(...courseList.slice(0, remaining))
  }

  return (
    <div className="w-full max-w-screen-xl py-8 sm:py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4">
          {courseSectionData.title || 'Courses'}
        </h2>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
          {courseSectionData.description || 'Explore our courses'}
        </p>

        <div className="relative">
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10"
                onClick={nextSlide}
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Next slide</span>
              </Button>
            </>
          )}

          <div
            className={`overflow-hidden ${
              totalPages > 1 ? 'mx-8 sm:mx-10' : ''
            }`}
          >
            <motion.div
              className="flex justify-center flex-wrap"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {visibleCourses.map((course) => (
                <CourseCard
                  key={course.documentId || Math.random()}
                  course={course}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 sm:mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={index === currentIndex ? 'default' : 'outline'}
                size="sm"
                className="mx-1 h-2 w-2 rounded-full p-0"
                onClick={() => setCurrentIndex(index)}
              >
                <span className="sr-only">Page {index + 1}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
