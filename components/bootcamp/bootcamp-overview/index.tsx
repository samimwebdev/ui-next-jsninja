'use client'

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { BootcampOverviewContentSection } from '@/types/bootcamp-page-types'
import DynamicIcon from '@/components/shared/DynamicIcon'

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

const TabItem: React.FC<{
  section: BootcampOverviewContentSection['sections'][0]
  sectionKey: string
  isActive: boolean
  onClick: () => void
}> = ({ section, sectionKey, isActive, onClick }) => {
  return (
    <TabsTrigger
      value={sectionKey}
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

// SidebarTabs Component - now dynamic
const SidebarTabs: React.FC<{
  sections: BootcampOverviewContentSection['sections']
  activeSection: string
  onSectionChange: (section: string) => void
}> = ({ sections, activeSection, onSectionChange }) => {
  return (
    <Tabs
      value={activeSection}
      onValueChange={onSectionChange}
      className="w-full"
    >
      <TabsList className="flex flex-col h-auto bg-card dark:bg-card p-2 space-y-2">
        {sections.map((section) => {
          // Create a unique section key from the primary label
          const sectionKey = section.primaryLabel
            .toLowerCase()
            .replace(/\s+/g, '-')

          return (
            <TabItem
              key={section.id}
              section={section}
              sectionKey={sectionKey}
              isActive={activeSection === sectionKey}
              onClick={() => onSectionChange(sectionKey)}
            />
          )
        })}
      </TabsList>
    </Tabs>
  )
}

// Dynamic Section Component
const DynamicSection: React.FC<{
  section: BootcampOverviewContentSection['sections'][0]
}> = ({ section }) => (
  <>
    <h3 className="text-3xl font-bold mb-8">{section.secondaryHeading}</h3>
    <div className="space-y-12">
      {section.sectionContent.map((content) => (
        <div
          key={content.id}
          className="bg-card/50 p-6 rounded-lg border border-border/50"
        >
          <div className="flex items-center gap-3 mb-6">
            {/* Content icon */}
            {content.icon && (
              <div className="p-2 rounded-lg bg-primary/10">
                <DynamicIcon
                  icon={content.icon}
                  width={content.icon.width}
                  height={content.icon.height}
                  className="h-6 w-6 text-primary"
                />
              </div>
            )}
            <h4 className="text-xl font-semibold">{content.title}</h4>
          </div>

          <div
            className="prose prose-sm max-w-none dark:prose-invert [&_ul]:ml-8 [&_ul]:space-y-3 [&_ul]:list-disc [&_ul]:text-muted-foreground [&_p]:ml-8 [&_p]:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: content.details }}
          />
        </div>
      ))}
    </div>
  </>
)

// Main BootcampOverview Component
export const BootcampOverview: React.FC<{
  data: BootcampOverviewContentSection
}> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const isScrollingToSection = useRef(false) // Add this ref to track manual scrolling

  // Create section keys from the dynamic data
  const sectionKeys = useMemo(
    () =>
      data.sections.map((section) =>
        section.primaryLabel.toLowerCase().replace(/\s+/g, '-')
      ),
    [data.sections]
  )

  const [activeSection, setActiveSection] = useState<string>(
    sectionKeys[0] || ''
  )

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Initialize section refs
  useEffect(() => {
    const refs: { [key: string]: HTMLDivElement | null } = {}
    sectionKeys.forEach((key) => {
      refs[key] = null
    })
    sectionRefs.current = refs
  }, [sectionKeys])

  const scrollToSection = useCallback((sectionId: string) => {
    // Immediately set the active section without any delays
    setActiveSection(sectionId)

    // Temporarily disable scroll handler
    isScrollingToSection.current = true

    const element = sectionRefs.current[sectionId]
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
      const element = sectionRefs.current[sectionKey]

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

  const setSectionRef = useCallback(
    (el: HTMLDivElement | null, sectionKey: string) => {
      if (el) {
        sectionRefs.current[sectionKey] = el
      }
    },
    []
  )

  return (
    <section className="max-w-screen-xl container mx-auto bg-background py-12 dark:bg-background">
      <div className="text-center mb-6">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {data.title}
        </h2>
        <p className="text-muted-foreground text-lg">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 mt-16">
        {/* Left Sidebar - Fixed on Desktop */}
        <div className="md:sticky md:top-24 h-fit">
          <Card className="overflow-hidden">
            <SidebarTabs
              sections={data.sections}
              activeSection={activeSection}
              onSectionChange={scrollToSection}
            />
          </Card>
        </div>

        {/* Right Content - Full height scrollable */}
        <Card className="p-8 relative">
          <div ref={contentRef} className="space-y-16">
            {data.sections.map((section) => {
              const sectionKey = section.primaryLabel
                .toLowerCase()
                .replace(/\s+/g, '-')

              return (
                <div
                  key={section.id}
                  id={sectionKey}
                  ref={(el) => setSectionRef(el, sectionKey)}
                  className={cn(
                    'scroll-mt-32 transition-opacity duration-300', // Added scroll-mt-32 for better scroll positioning
                    activeSection === sectionKey ? 'opacity-100' : 'opacity-70'
                  )}
                >
                  <DynamicSection section={section} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </section>
  )
}
