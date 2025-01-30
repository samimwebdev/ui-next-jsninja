'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SectionData {
  title: string
  description: string
  image: string
}

const sections: SectionData[] = [
  {
    title: 'Innovative Design',
    description:
      'Combining aesthetics with functionality for intuitive interfaces.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
  },
  {
    title: 'Seamless Integration',
    description:
      'Flawless integration with existing systems for enhanced productivity.',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
  },
  {
    title: 'Scalable Solutions',
    description: 'Grow your applications without compromising performance.',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: 'Robust Security',
    description:
      'State-of-the-art measures to protect against threats and ensure compliance.',
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: '24/7 Support',
    description:
      'Round-the-clock assistance to ensure smooth system operation.',
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
  },
]

export function HowBootcampRuns() {
  const [activeSection, setActiveSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollPosition = container.scrollTop
      const containerHeight = container.clientHeight

      let newActiveSection = 0
      sectionRefs.current.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop
          const sectionHeight = section.clientHeight
          if (
            scrollPosition >=
            sectionTop - containerHeight / 2 + sectionHeight / 2
          ) {
            newActiveSection = index
          }
        }
      })

      setActiveSection(newActiveSection)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="h-[60vh] md:h-[400px] flex flex-col md:flex-row overflow-hidden bg-background text-foreground">
      <div
        ref={containerRef}
        className="w-full md:w-1/2 overflow-y-auto scrollbar-hide"
      >
        {sections.map((section, index) => (
          <div
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            className={cn(
              'h-[40vh] md:h-[300px] flex flex-col justify-center p-4 md:p-6 transition-opacity duration-500',
              activeSection === index ? 'opacity-100' : 'opacity-50'
            )}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
              {section.title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {section.description}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full md:w-1/2 h-[60vh] md:h-[400px] sticky top-0">
        <div className="relative h-full w-full flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {sections.map((section, index) => (
            <img
              key={index}
              src={section.image || '/placeholder.svg'}
              alt={section.title}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-all duration-500',
                activeSection === index
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
