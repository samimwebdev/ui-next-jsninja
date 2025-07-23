'use client'
import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { Lock, PlayCircle, FileText } from 'lucide-react'
import { Curriculum, Lesson } from '@/types/course-page-types'
import { useVideo } from '../context/video-provider'
import { formatDuration } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useUser } from '../context/AuthProvider'
import { CourseCurriculumSkeleton } from './course-curriculum-skeleton'

export const CourseCurriculum: React.FC<{
  data?: Curriculum
  isLoading?: boolean
}> = ({ data, isLoading = false }) => {
  const { openVideo } = useVideo()
  const user = useUser()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use data from API
  const modules = data?.modules || []
  const title = data?.title || 'Course Curriculum'

  // Show skeleton while loading or not mounted
  if (isLoading || !mounted) {
    return <CourseCurriculumSkeleton />
  }

  if (!modules.length) {
    return (
      <section id="curriculum" className="my-12">
        <h2 className="text-3xl font-bold tracking-tight mb-6">{title}</h2>
        <p className="text-muted-foreground">
          No curriculum available at the moment.
        </p>
      </section>
    )
  }

  const handleLessonClick = (lesson: Lesson) => {
    // Check if lesson is free and has video
    if (lesson.isFree && lesson.videoUrl && lesson.type === 'Video') {
      // Check if user is authenticated
      if (!user) {
        // Store current page and intended video for redirect after login
        const currentPath = window.location.pathname

        // Show toast message
        toast.error('Please log in to watch free lectures', {
          description: 'You will be redirected back after login',
        })

        // Redirect to login page
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
        return
      }

      // User is authenticated, play the video
      openVideo(lesson.videoUrl)
    }
  }

  return (
    <section id="curriculum" className="my-12">
      <h2 className="text-3xl font-bold tracking-tight mb-6">{title}</h2>
      <Accordion type="single" collapsible className="mt-8 space-y-4">
        {modules.map((module, moduleIndex) => (
          <AccordionItem
            key={module.id}
            value={`module-${moduleIndex}`}
            className="bg-accent py-1 px-4 rounded-xl border-none"
          >
            <AccordionTrigger className="flex items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline text-start text-lg">
              {module.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y">
                {module.lessons?.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`flex items-center justify-between p-4 transition-colors ${
                      lesson.isFree &&
                      lesson.videoUrl &&
                      lesson.type === 'Video'
                        ? 'cursor-pointer hover:bg-muted/50 hover:bg-blue-50/50'
                        : 'cursor-default opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {lesson.type === 'Video' ? (
                        <PlayCircle
                          className={`h-5 w-5 ${
                            lesson.isFree ? 'text-blue-500' : 'text-gray-400'
                          }`}
                        />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-500" />
                      )}
                      <span
                        className={
                          lesson.isFree
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }
                      >
                        {lesson.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(lesson.duration)}
                      </span>
                      {lesson.isFree ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Free
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
