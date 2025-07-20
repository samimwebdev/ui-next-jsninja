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

interface Course {
  id: number
  title: string
  description: string
  category: string
  duration: string
  level: string
  image: string
  price: number
}

const courses: Course[] = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the basics of React and build your first app',
    category: 'Web Development',
    duration: '4 hr',
    level: 'Beginner',
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 2500,
  },
  {
    id: 2,
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into advanced JavaScript topics',
    category: 'Programming',
    duration: '6 hr',
    level: 'Intermediate',
    image:
      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 3500,
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    description:
      'Master the fundamentals of user interface and experience design',
    category: 'Design',
    duration: '5 hr',
    level: 'All Levels',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1464&q=80',
    price: 3000,
  },
  {
    id: 4,
    title: 'Data Structures and Algorithms',
    description: 'Enhance your problem-solving skills with DSA',
    category: 'Computer Science',
    duration: '8 hrs',
    level: 'Advanced',
    image:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
    price: 4500,
  },
  {
    id: 5,
    title: 'Machine Learning Fundamentals',
    description: 'Get started with machine learning and AI',
    category: 'Data Science',
    duration: '10 hrs',
    level: 'Intermediate',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 5000,
  },
]

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <motion.div
      className="w-full md:w-1/3 lg:w-1/3 flex-shrink-0 px-4"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/courses/${course.id}`}>
        <Card className="overflow-hidden h-full flex flex-col">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={course.image || '/placeholder.svg'}
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
              {course.description}
            </CardDescription>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline">{course.duration}</Badge>
              <Badge>{course.level}</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Enroll Now</Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}

export const CourseList: React.FC<{ data: Course[] }> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const coursesPerPage = 3
  const totalPages = Math.ceil(courses.length / coursesPerPage)

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
  const visibleCourses = courses.slice(startIndex, startIndex + coursesPerPage)

  // If we don't have enough courses to fill the page, add from the beginning
  if (visibleCourses.length < coursesPerPage) {
    const remaining = coursesPerPage - visibleCourses.length
    visibleCourses.push(...courses.slice(0, remaining))
  }

  return (
    <div className="w-full max-w-screen-xl py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-4">
          Featured Courses
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore our curated selection of high-quality courses designed to help
          you master new skills and advance your career
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
