'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tabItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'instructor', label: 'Instructor' },
  { id: 'reviews', label: 'Reviews' },
]

export function CourseTabs() {
  const [activeTab, setActiveTab] = useState('overview')

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const element = document.getElementById(value)
    if (element) {
      const yOffset = -80 // Adjust this value based on your header height
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
      <TabsList className="w-full justify-start">
        {tabItems.map((item) => (
          <TabsTrigger key={item.id} value={item.id} className="flex-1">
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <motion.div
        className="h-1 bg-primary"
        initial={{ width: '25%' }}
        animate={{
          width: `${
            (tabItems.findIndex((item) => item.id === activeTab) + 1) * 25
          }%`,
        }}
        transition={{ duration: 0.3 }}
      />
    </Tabs>
  )
}
