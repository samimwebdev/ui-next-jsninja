'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
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
  BookOpen,
  Award,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function CourseOverview() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState('tools')
  const sections = useMemo(
    () => ['tools', 'learn', 'who', 'resources', 'certification'],
    []
  )

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const sectionElements = sections.map((id) => ({
        id,
        element: document.getElementById(id),
      }))

      const scrollPosition = window.scrollY + 100 // Add offset for header

      let newActiveSection = sections[0]

      for (const { id, element } of sectionElements) {
        if (!element) continue
        const elementTop = element.offsetTop
        if (scrollPosition >= elementTop) {
          newActiveSection = id
        }
      }

      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once to set initial active section
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections, activeSection])

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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Course <span className="text-primary">Overview</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Detailed information about the course
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 px-4 md:px-0">
          {/* Left Sidebar - Fixed on Desktop */}
          <div className="md:sticky md:top-8 h-fit">
            <Tabs
              value={activeSection}
              onValueChange={scrollToSection}
              orientation="vertical"
              className="w-full"
            >
              <TabsList className="flex flex-col h-auto bg-card dark:bg-card p-2 space-y-2">
                <TabsTrigger
                  value="tools"
                  className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
                  aria-label="Software and Tools"
                >
                  <Wrench className="h-5 w-5" />
                  Software And Tools
                </TabsTrigger>
                <TabsTrigger
                  value="learn"
                  className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
                  aria-label="What You Will Learn"
                >
                  <GraduationCap className="h-5 w-5" />
                  What You Will Learn
                </TabsTrigger>
                <TabsTrigger
                  value="who"
                  className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
                  aria-label="Who Is This Course For"
                >
                  <Users className="h-5 w-5" />
                  Who Is This Course For
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
                  aria-label="Additional Resources"
                >
                  <BookOpen className="h-5 w-5" />
                  Additional Resources
                </TabsTrigger>
                <TabsTrigger
                  value="certification"
                  className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
                  aria-label="Certification"
                >
                  <Award className="h-5 w-5" />
                  Certification
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Right Content - Full height scrollable */}
          <Card className="p-6 md:p-8 relative shadow-md">
            <div ref={contentRef} className="space-y-16">
              <div
                id="tools"
                className={cn(
                  'pt-4 pb-16 transition-opacity duration-300',
                  activeSection === 'tools' ? 'opacity-100' : 'opacity-70'
                )}
              >
                <h3 className="text-3xl font-bold mb-8">
                  What You&apos;ll Master In This Course
                </h3>

                <div className="space-y-12">
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10 shadow-sm">
                        <Clapperboard className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-lg md:text-xl font-semibold">
                        Video Editing Mastery
                      </h4>
                    </div>
                    <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
                      <li>
                        Dominate the fundamentals and advanced techniques of
                        video editing
                      </li>
                      <li>
                        Unlock the secrets of professional editors and their
                        workflows
                      </li>
                      <li>
                        Create captivating content across various formats: viral
                        reels, documentaries, podcasts, and more
                      </li>
                      <li>
                        Elevate your storytelling through powerful editing
                        techniques
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10 shadow-sm">
                        <Palette className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-lg md:text-xl font-semibold">
                        Graphic Design & Motion Graphics
                      </h4>
                    </div>
                    <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
                      <li>
                        Transform from novice to expert in photo editing and
                        graphic design
                      </li>
                      <li>
                        Craft stunning visuals for ads, thumbnails, posters, and
                        banners
                      </li>
                      <li>
                        Bring your designs to life with dynamic animation and
                        motion graphics
                      </li>
                      <li>
                        Dive into 3D environments and create complex visual
                        stories
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10 shadow-sm">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-lg md:text-xl font-semibold">
                        Cutting-Edge AI Integration
                      </h4>
                    </div>
                    <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
                      <li>
                        Harness the power of generative AI tools for next-level
                        editing
                      </li>
                      <li>
                        Master prompt writing for text-to-image, text-to-video,
                        and text-to-audio transformations
                      </li>
                      <li>
                        Explore voice cloning and other innovative AI
                        technologies
                      </li>
                      <li>
                        Stay ahead of the curve with the latest AI advancements
                        in media creation
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10 shadow-sm">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-lg md:text-xl font-semibold">
                        Launch Your Freelance Career
                      </h4>
                    </div>
                    <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
                      <li>
                        Turn your newfound skills into a thriving freelance
                        business
                      </li>
                      <li>
                        Design an irresistible portfolio that attracts
                        high-paying clients
                      </li>
                      <li>Navigate freelancing platforms like a pro</li>
                      <li>
                        Learn the roadmap to building your own successful
                        service-based agency
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div
                id="learn"
                className={cn(
                  'pt-16 pb-16 transition-opacity duration-300',
                  activeSection === 'learn' ? 'opacity-100' : 'opacity-70'
                )}
              >
                <h3 className="text-3xl font-bold mb-8">Learning Path</h3>
                <div className="space-y-8">
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
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
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
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
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
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
              </div>

              <div
                id="who"
                className={cn(
                  'pt-16 pb-16 transition-opacity duration-300',
                  activeSection === 'who' ? 'opacity-100' : 'opacity-70'
                )}
              >
                <h3 className="text-3xl font-bold mb-8">Target Audience</h3>
                <div className="space-y-8">
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
                      Aspiring Content Creators
                    </h4>
                    <p className="text-muted-foreground">
                      If you&apos;re looking to start a YouTube channel, create
                      engaging social media content, or dive into the world of
                      digital storytelling, this course will provide you with
                      the essential skills to bring your ideas to life.
                    </p>
                  </div>
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
                      Marketing Professionals
                    </h4>
                    <p className="text-muted-foreground">
                      For those in marketing roles looking to enhance their
                      digital media skills, this course will empower you to
                      create high-quality visual content that resonates with
                      your audience and drives engagement.
                    </p>
                  </div>
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
                      Freelancers and Entrepreneurs
                    </h4>
                    <p className="text-muted-foreground">
                      Whether you&apos;re starting a freelance career in digital
                      media or looking to create compelling content for your own
                      business, this course will equip you with the skills to
                      stand out in a competitive market.
                    </p>
                  </div>
                </div>
              </div>

              <div
                id="resources"
                className={cn(
                  'pt-16 pb-16 transition-opacity duration-300',
                  activeSection === 'resources' ? 'opacity-100' : 'opacity-70'
                )}
              >
                <h3 className="text-3xl font-bold mb-8">
                  Additional Resources
                </h3>
                <div className="space-y-8">
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
                      Online Community
                    </h4>
                    <p className="text-muted-foreground">
                      Join our vibrant online community of fellow learners and
                      industry professionals. Share your work, get feedback, and
                      collaborate on projects.
                    </p>
                  </div>
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
                      Exclusive Webinars
                    </h4>
                    <p className="text-muted-foreground">
                      Gain insights from industry experts through our exclusive
                      webinars. These live sessions cover cutting-edge topics
                      and provide opportunities for Q&A with professionals.
                    </p>
                  </div>
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
                      Resource Library
                    </h4>
                    <p className="text-muted-foreground">
                      Access our extensive library of tutorials, templates, and
                      assets to support your learning journey and accelerate
                      your project development.
                    </p>
                  </div>
                </div>
              </div>

              <div
                id="certification"
                className={cn(
                  'pt-16 pb-16 transition-opacity duration-300',
                  activeSection === 'certification'
                    ? 'opacity-100'
                    : 'opacity-70'
                )}
              >
                <h3 className="text-3xl font-bold mb-8">Certification</h3>
                <div className="space-y-8">
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
                      Course Completion Certificate
                    </h4>
                    <p className="text-muted-foreground">
                      Upon successful completion of the course, youll receive a
                      certificate recognizing your achievement and newly
                      acquired skills in digital media creation.
                    </p>
                  </div>
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
                      Industry Recognition
                    </h4>
                    <p className="text-muted-foreground">
                      Our certification is recognized by leading companies in
                      the digital media industry, giving you a competitive edge
                      in the job market or freelance world.
                    </p>
                  </div>
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                    <h4 className="text-lg md:text-xl font-semibold mb-4">
                      Continuing Education
                    </h4>
                    <p className="text-muted-foreground">
                      Stay up-to-date with the latest trends and technologies
                      through our ongoing education programs, exclusively
                      available to course graduates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
