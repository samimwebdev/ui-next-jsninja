'use client'

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import {
  Clapperboard,
  Palette,
  Bot,
  Briefcase,
  Wrench,
  GraduationCap,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BootcampOverviewContentSection } from '@/types/bootcamp-page-types'

// Utility function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Types
type Section = 'tools' | 'learn' | 'who'

// TabItem Component
const TabItem: React.FC<{
  section: Section
  isActive: boolean
  onClick: () => void
}> = ({ section, isActive, onClick }) => {
  const getIcon = () => {
    switch (section) {
      case 'tools':
        return <Wrench className="h-5 w-5" />
      case 'learn':
        return <GraduationCap className="h-5 w-5" />
      case 'who':
        return <Users className="h-5 w-5" />
    }
  }

  const getLabel = () => {
    switch (section) {
      case 'tools':
        return 'Software And Tools'
      case 'learn':
        return 'What You Will Learn'
      case 'who':
        return 'Who Is This Course For'
    }
  }

  return (
    <TabsTrigger
      value={section}
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
        {getIcon()}
        {getLabel()}
      </div>
    </TabsTrigger>
  )
}

// SidebarTabs Component
const SidebarTabs: React.FC<{
  activeSection: Section
  onSectionChange: (section: Section) => void
}> = ({ activeSection, onSectionChange }) => {
  const sections: Section[] = ['tools', 'learn', 'who']

  return (
    <Tabs
      value={activeSection}
      onValueChange={onSectionChange as (value: string) => void}
      className="w-full"
    >
      <TabsList className="flex flex-col h-auto bg-card dark:bg-card p-2 space-y-2">
        {sections.map((section) => (
          <TabItem
            key={section}
            section={section}
            isActive={activeSection === section}
            onClick={() => onSectionChange(section)}
          />
        ))}
      </TabsList>
    </Tabs>
  )
}

// ToolsSection Component
const ToolsSection: React.FC = () => (
  <>
    <h3 className="text-3xl font-bold mb-8">
      What You&apos;ll Master In This Course
    </h3>
    <div className="space-y-12">
      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clapperboard className="h-6 w-6 text-primary" />
          </div>
          <h4 className="text-xl font-semibold">Video Editing Mastery</h4>
        </div>
        <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
          <li>
            Dominate the fundamentals and advanced techniques of video editing
          </li>
          <li>
            Unlock the secrets of professional editors and their workflows
          </li>
          <li>
            Create captivating content across various formats: viral reels,
            documentaries, podcasts, and more
          </li>
          <li>Elevate your storytelling through powerful editing techniques</li>
        </ul>
      </div>

      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <h4 className="text-xl font-semibold">
            Graphic Design & Motion Graphics
          </h4>
        </div>
        <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
          <li>
            Transform from novice to expert in photo editing and graphic design
          </li>
          <li>
            Craft stunning visuals for ads, thumbnails, posters, and banners
          </li>
          <li>
            Bring your designs to life with dynamic animation and motion
            graphics
          </li>
          <li>Dive into 3D environments and create complex visual stories</li>
        </ul>
      </div>

      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <h4 className="text-xl font-semibold">Cutting-Edge AI Integration</h4>
        </div>
        <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
          <li>
            Harness the power of generative AI tools for next-level editing
          </li>
          <li>
            Master prompt writing for text-to-image, text-to-video, and
            text-to-audio transformations
          </li>
          <li>Explore voice cloning and other innovative AI technologies</li>
          <li>
            Stay ahead of the curve with the latest AI advancements in media
            creation
          </li>
        </ul>
      </div>

      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <h4 className="text-xl font-semibold">
            Launch Your Freelance Career
          </h4>
        </div>
        <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
          <li>Turn your newfound skills into a thriving freelance business</li>
          <li>
            Design an irresistible portfolio that attracts high-paying clients
          </li>
          <li>Navigate freelancing platforms like a pro</li>
          <li>
            Learn the roadmap to building your own successful service-based
            agency
          </li>
        </ul>
      </div>
    </div>

    <p className="mt-12 text-muted-foreground text-lg leading-relaxed">
      By the end of this course, you&apos;ll have the skills, knowledge, and
      confidence to create professional-grade videos, graphics, and animations.
      Whether you&apos;re looking to enhance your personal projects, boost your
      career, or start a lucrative freelance business, this comprehensive
      program will equip you with everything you need to succeed in the dynamic
      world of digital media creation.
    </p>
  </>
)

// LearnSection Component
const LearnSection: React.FC = () => (
  <>
    <h3 className="text-3xl font-bold mb-8">Learning Path</h3>
    <div className="space-y-8">
      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <h4 className="text-xl font-semibold mb-4">
          1. Foundations of Digital Media
        </h4>
        <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
          <li>Understanding digital formats and compression</li>
          <li>Color theory and its application in digital media</li>
          <li>Basics of composition and framing</li>
          <li>Introduction to industry-standard software</li>
        </ul>
      </div>
      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <h4 className="text-xl font-semibold mb-4">
          2. Advanced Video Editing Techniques
        </h4>
        <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
          <li>Mastering timeline editing and keyframing</li>
          <li>Color grading and color correction</li>
          <li>Audio editing and sound design</li>
          <li>Creating compelling transitions and effects</li>
        </ul>
      </div>
      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <h4 className="text-xl font-semibold mb-4">
          3. Graphic Design for Digital Media
        </h4>
        <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
          <li>Typography and layout design</li>
          <li>Creating engaging thumbnails and posters</li>
          <li>Logo design and branding elements</li>
          <li>Infographic creation for data visualization</li>
        </ul>
      </div>
    </div>
  </>
)

// WhoSection Component
const WhoSection: React.FC = () => (
  <>
    <h3 className="text-3xl font-bold mb-8">Target Audience</h3>
    <div className="space-y-8">
      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <h4 className="text-xl font-semibold mb-4">
          Aspiring Content Creators
        </h4>
        <p className="text-muted-foreground">
          If you&apos;re looking to start a YouTube channel, create engaging
          social media content, or dive into the world of digital storytelling,
          this course will provide you with the essential skills to bring your
          ideas to life.
        </p>
      </div>
      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <h4 className="text-xl font-semibold mb-4">Marketing Professionals</h4>
        <p className="text-muted-foreground">
          For those in marketing roles looking to enhance their digital media
          skills, this course will empower you to create high-quality visual
          content that resonates with your audience and drives engagement.
        </p>
      </div>
      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <h4 className="text-xl font-semibold mb-4">
          Freelancers and Entrepreneurs
        </h4>
        <p className="text-muted-foreground">
          Whether you&apos;re starting a freelance career in digital media or
          looking to create compelling content for your own business, this
          course will equip you with the skills to stand out in a competitive
          market.
        </p>
      </div>
    </div>
  </>
)

// Main CourseOverview Component
export const BootcampOverview: React.FC<{
  data: BootcampOverviewContentSection
}> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState<Section>('tools')
  const sections: Section[] = useMemo(() => ['tools', 'learn', 'who'], [])
  const sectionRefs = useRef<{ [key in Section]: HTMLDivElement | null }>({
    tools: null,
    learn: null,
    who: null,
  })

  const scrollToSection = useCallback((sectionId: Section) => {
    setActiveSection(sectionId)
    const element = sectionRefs.current[sectionId]
    if (element) {
      const yOffset = -100
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight / 2

    let newActiveSection = activeSection
    for (const section of sections) {
      const element = sectionRefs.current[section]
      if (element) {
        const { top, bottom } = element.getBoundingClientRect()
        const elementTop = top + window.scrollY
        const elementBottom = bottom + window.scrollY
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          newActiveSection = section
          break
        }
      }
    }

    if (newActiveSection !== activeSection) {
      setActiveSection(newActiveSection)
    }
  }, [activeSection, sections])

  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, 10),
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
    (el: HTMLDivElement | null, section: Section) => {
      if (el) {
        sectionRefs.current[section] = el
      }
    },
    []
  )

  return (
    <section className="s max-w-screen-xl container mx-auto  bg-background py-12 dark:bg-background">
      <div className="text-center mb-6">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Course <span className="text-primary">Overview</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Detail information about course
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 mt-16">
        {/* Left Sidebar - Fixed on Desktop */}
        <div className="md:sticky md:top-24 h-fit">
          <Card className="overflow-hidden">
            <SidebarTabs
              activeSection={activeSection}
              onSectionChange={scrollToSection}
            />
          </Card>
        </div>

        {/* Right Content - Full height scrollable */}
        <Card className="p-8 relative">
          <div ref={contentRef} className="space-y-16">
            {sections.map((section) => (
              <div
                key={section}
                id={section}
                ref={(el) => setSectionRef(el, section)}
                className={cn(
                  'pt-16 pb-16 transition-opacity duration-300',
                  activeSection === section ? 'opacity-100' : 'opacity-70'
                )}
              >
                {section === 'tools' && <ToolsSection />}
                {section === 'learn' && <LearnSection />}
                {section === 'who' && <WhoSection />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
