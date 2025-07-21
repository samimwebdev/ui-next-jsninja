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
  return (
    <motion.div
      className="w-full md:w-1/3 lg:w-1/3 flex-shrink-0 px-4  group cursor-pointer"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/courses/${course.id}`}>
        <Card className="overflow-hidden h-full flex flex-col">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={
                  course.featureImage?.formats?.medium?.url ||
                  course.featureImage?.url ||
                  '/images/placeholder.svg' // Fallback placeholder image
                }
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-primary text-primary-foreground">
                  {course.price.toLocaleString()} BDT
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
            <CardDescription className="mb-4">
              {course.shortDescription}
            </CardDescription>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{course.categories[0]?.name}</Badge>
              <Badge variant="outline">{formatDuration(course.duration)}</Badge>
              <Badge>{course.level}</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              variant="outline"
            >
              {course?.browseCoursesBtn?.btnLabel || 'Enroll Now'}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}

export const CourseList: React.FC<{ data: CourseSectionData }> = ({
  data: courseSectionData,
}) => {
  const courseList = courseSectionData.courseBases || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const coursesPerPage = 3
  const totalPages = Math.ceil(courseList.length / coursesPerPage)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Get current courses to display
  const startIndex = currentIndex * coursesPerPage
  const visibleCourses = courseList.slice(
    startIndex,
    startIndex + coursesPerPage
  )

  // If we don't have enough courses to fill the page, add from the beginning
  if (visibleCourses.length < coursesPerPage) {
    const remaining = coursesPerPage - visibleCourses.length
    visibleCourses.push(...courseList.slice(0, remaining))
  }

  return (
    <div className="w-full max-w-screen-xl py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-4">
          {courseSectionData.title}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {courseSectionData.description}
        </p>

        <div className="relative">
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

          <div className="overflow-hidden mx-10">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {visibleCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </motion.div>
          </div>
        </div>

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
      </div>
    </div>
  )
}
