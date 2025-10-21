'use client'
import Image from 'next/image'
// Import the Marquee component directly from the home directory to avoid compatibility issues
import { Marquee } from '@/components/home/marquee'
import { useEffect, useState } from 'react'

import { CourseBase } from '@/types/shared-types'

const CourseCard: React.FC<CourseBase> = ({ title, level, featureImage }) => {
  return (
    <div className="w-60 mx-auto rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800">
      <div className="relative h-40 w-full">
        <Image
          src={
            featureImage?.formats?.thumbnail?.url ||
            featureImage?.url ||
            '/images/placeholder.png'
          }
          alt={title}
          fill
          className="object-cover transition-all duration-300 hover:opacity-90"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">{level}</p>
      </div>
    </div>
  )
}

export const HeroMarquee: React.FC<{ data: CourseBase[] }> = ({
  data: courses,
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const firstRow = courses.slice(0, courses.length / 2)
  const secondRow = courses.slice(courses.length / 2)

  return (
    <section className="overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800">
      <div className=" flex h-[30rem] flex-row items-center justify-center overflow-hidden rounded-lg bg-secondary gap-6 md:shadow-xl w-full">
        <Marquee pauseOnHover vertical className="[--duration:20s] ">
          {firstRow.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover vertical className="[--duration:20s]  ">
          {secondRow.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </Marquee>
        <Marquee pauseOnHover vertical className="[--duration:20s] ">
          {secondRow.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
