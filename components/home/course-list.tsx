'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
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
      className="w-full px-2 md:w-1/3 lg:w-1/3 flex-shrink-0"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <Link href={`/courses/${course.id}`}>
        <Card className="overflow-hidden h-full flex flex-col">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={course.image || '/placeholder.svg'}
                alt={course.title}
                layout="fill"
                objectFit="cover"
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
export const CourseList = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const [direction, setDirection] = useState(0)

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + courses.length) % courses.length
    )
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const visibleCourses = [
    courses[(currentIndex - 1 + courses.length) % courses.length],
    courses[currentIndex],
    courses[(currentIndex + 1) % courses.length],
  ]

  return (
    <div className="w-full max-w-screen-xl py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold  tracking-tight text-center mb-4">
          Featured Courses
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore our comprehensive collection of courses designed to help you master new skills and advance your career
        </p>
        <div className="relative overflow-hidden">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/3 transform -translate-y-1/2 z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/3 transform -translate-y-1/2 z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </Button>
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? '100%' : '-100%',
                    opacity: 0,
                  }),
                  center: {
                    x: 0,
                    opacity: 1,
                  },
                  exit: (direction: number) => ({
                    x: direction < 0 ? '100%' : '-100%',
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="flex justify-center"
                style={{ width: '100%', position: 'absolute' }}
              >
                {visibleCourses.map((course, index) => (
                  <CourseCard key={`${course.id}-${index}`} course={course} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <div style={{ height: '400px' }} />{' '}
          {/* Placeholder to maintain height */}
        </div>
      </div>
    </div>
  )
}
