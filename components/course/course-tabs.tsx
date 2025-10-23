'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CoursePageData } from '@/types/course-page-types'

const tabItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'instructor', label: 'Instructor' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'projects', label: 'Projects' },
]

export const CourseTabs: React.FC<{ data: CoursePageData }> = ({}) => {
  const [activeTab, setActiveTab] = useState('overview')

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const element = document.getElementById(value)
    if (element) {
      const yOffset = -80
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="sticky top-0 bg-background z-10"
    >
      <div className="relative -mx-4 sm:mx-0">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden flex-nowrap px-4 sm:px-0 rounded-none sm:rounded-lg">
          {tabItems.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="flex-shrink-0 flex md:flex-1 text-md md:text-lg px-3 sm:px-4 py-2 sm:py-2.5"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <motion.div
          className="h-1 bg-primary absolute bottom-0 left-0 hidden md:block"
          initial={{ width: '20%' }}
          animate={{
            width: `${
              (tabItems.findIndex((item) => item.id === activeTab) + 1) * 20
            }%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </Tabs>
  )
}
