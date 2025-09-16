'use client'

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { StrapiIcon } from '@/types/shared-types'

// Utility function for debouncing scroll events
const debounce = <T extends (...args: never[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

interface ProcessedSection {
  id: number
  primaryLabel: string
  primaryLabelIcon?: StrapiIcon
  sectionKey: string
}

interface BootcampOverviewClientProps {
  sections: ProcessedSection[]
  defaultActiveSection: string
}

const TabItem: React.FC<{
  section: ProcessedSection
  isActive: boolean
  onClick: () => void
}> = ({ section, isActive, onClick }) => {
  return (
    <TabsTrigger
      value={section.sectionKey}
      onClick={onClick}
      className={cn(
        'w-full justify-start gap-3 p-4 text-base relative',
        'transition-all duration-200 ease-in-out',
        'hover:bg-muted/50',
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground'
      )}
    >
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 bg-primary transition-all duration-200 ease-in-out',
          isActive ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div className="flex items-center gap-3 relative z-10">
        {/* Dynamic icon from Strapi data */}
        {section.primaryLabelIcon && (
          <DynamicIcon
            icon={section.primaryLabelIcon}
            width={section.primaryLabelIcon.width}
            height={section.primaryLabelIcon.height}
            className="h-5 w-5"
          />
        )}
        {section.primaryLabel}
      </div>
    </TabsTrigger>
  )
}

export const BootcampOverviewClient: React.FC<BootcampOverviewClientProps> = ({
  sections,
  defaultActiveSection,
}) => {
  const isScrollingToSection = useRef(false)
  const [activeSection, setActiveSection] =
    useState<string>(defaultActiveSection)

  const sectionKeys = useMemo(
    () => sections.map((section) => section.sectionKey),
    [sections]
  )

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Initialize section refs
  useEffect(() => {
    const refs: { [key: string]: HTMLDivElement | null } = {}
    sectionKeys.forEach((key) => {
      refs[key] = document.getElementById(key) as HTMLDivElement | null
    })
    sectionRefs.current = refs
  }, [sectionKeys])

  const scrollToSection = useCallback((sectionId: string) => {
    // Immediately set the active section without any delays
    setActiveSection(sectionId)

    // Temporarily disable scroll handler
    isScrollingToSection.current = true

    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -120
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })

      // Re-enable scroll handler after animation
      setTimeout(() => {
        isScrollingToSection.current = false
      }, 1000)
    }
  }, [])

  const handleScroll = useCallback(() => {
    // Skip all scroll handling during programmatic scrolling
    if (isScrollingToSection.current) {
      return
    }

    const scrollPosition = window.scrollY + 200

    let newActiveSection = sectionKeys[0] || ''

    // Find which section is currently most visible
    for (let i = sectionKeys.length - 1; i >= 0; i--) {
      const sectionKey = sectionKeys[i]
      const element = document.getElementById(sectionKey)

      if (element) {
        const { top } = element.getBoundingClientRect()
        const elementTop = top + window.scrollY

        if (elementTop <= scrollPosition) {
          newActiveSection = sectionKey
          break
        }
      }
    }

    // Only update if there's a change
    if (newActiveSection !== activeSection) {
      setActiveSection(newActiveSection)
    }
  }, [activeSection, sectionKeys])

  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, 50),
    [handleScroll]
  )

  useEffect(() => {
    handleScroll()
  }, [handleScroll])

  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll)
    return () => window.removeEventListener('scroll', debouncedHandleScroll)
  }, [debouncedHandleScroll])

  return (
    <Card className="overflow-hidden">
      <Tabs
        value={activeSection}
        onValueChange={scrollToSection}
        className="w-full"
      >
        <TabsList className="flex flex-col h-auto bg-card dark:bg-card p-2 space-y-2">
          {sections.map((section) => (
            <TabItem
              key={section.id}
              section={section}
              isActive={activeSection === section.sectionKey}
              onClick={() => scrollToSection(section.sectionKey)}
            />
          ))}
        </TabsList>
      </Tabs>
    </Card>
  )
}
