'use client'

import { useRef, useState, useMemo } from 'react'
import { CourseHeader } from './course-header'
import { CourseSidebar } from './course-sidebar'
import { CourseContent } from './course-content'
import { useActiveSection } from './user-active'

export function CourseOverview() {
  const contentRef = useRef<HTMLDivElement>(null)
  const sections = useMemo(
    () => ['tools', 'learn', 'who', 'resources', 'certification'],
    []
  )
  const [activeSection, setActiveSection] = useState('tools')

  useActiveSection(contentRef, sections, setActiveSection)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -100 // Adjust this value to fine-tune the scroll position
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  return (
    <section className="relative w-full bg-background py-16 dark:bg-background">
      <div className="container max-w-7xl">
        <CourseHeader />
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 px-4 md:px-0">
          <CourseSidebar
            activeSection={activeSection}
            onSectionChange={scrollToSection}
          />
          <CourseContent
            contentRef={contentRef}
            activeSection={activeSection}
          />
        </div>
      </div>
    </section>
  )
}
