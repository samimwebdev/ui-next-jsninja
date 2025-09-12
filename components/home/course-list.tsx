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
  // Handle case when baseContent is null/undefined
  if (!course?.baseContent) {
    return (
      <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
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
    level = 'Unknown',
    duration = 0,
    featureImage = null,
    categories = [],
    browseCoursesBtn = null,
  } = course.baseContent

  // Don't render link if slug is empty
  const cardContent = (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={
              featureImage?.formats?.medium?.url ||
              featureImage?.url ||
              '/images/placeholder.svg'
            }
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground">
              {price.toLocaleString()} BDT
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="mb-4">{shortDescription}</CardDescription>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.length > 0 && (
            <Badge variant="secondary">{categories[0]?.name}</Badge>
          )}
          <Badge variant="outline">{formatDuration(duration)}</Badge>
          <Badge>{level}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
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
      className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4 group cursor-pointer"
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
  const coursesPerPage = 3
  const totalPages = Math.ceil(courseList.length / coursesPerPage)

  useEffect(() => {
    if (totalPages > 1) {
      const timer = setInterval(() => {
        nextSlide()
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [totalPages]) // eslint-disable-line react-hooks/exhaustive-deps
  // Handle case when courseSectionData is null/undefined
  if (!courseSectionData) {
    return (
      <div className="w-full max-w-screen-xl py-12 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Course section data unavailable.
          </p>
        </div>
      </div>
    )
  }

  // Handle case when no courses are available
  if (courseList.length === 0) {
    return (
      <div className="w-full max-w-screen-xl py-12 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold tracking-tight text-center mb-4">
            {courseSectionData.title || 'Courses'}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
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

  // Get current courses to display
  const startIndex = currentIndex * coursesPerPage
  const visibleCourses = courseList.slice(
    startIndex,
    startIndex + coursesPerPage
  )

  // If we don't have enough courses to fill the page, add from the beginning
  if (
    visibleCourses.length < coursesPerPage &&
    courseList.length > coursesPerPage
  ) {
    const remaining = coursesPerPage - visibleCourses.length
    visibleCourses.push(...courseList.slice(0, remaining))
  }

  return (
    <div className="w-full max-w-screen-xl py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-4">
          {courseSectionData.title || 'Courses'}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {courseSectionData.description || 'Explore our courses'}
        </p>

        <div className="relative">
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next slide</span>
              </Button>
            </>
          )}

          <div className={`overflow-hidden ${totalPages > 1 ? 'mx-10' : ''}`}>
            <motion.div
              className="flex justify-center"
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
          <div className="flex justify-center mt-8">
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
