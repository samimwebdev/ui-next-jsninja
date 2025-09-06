'use client'

import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Lock, PlayCircle, FileText, Clock, Eye } from 'lucide-react'
import { Lesson } from '@/types/course-page-types'
import { useVideo } from '../context/video-provider'
import { formatDuration } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useUser } from '../context/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { Module } from '@/types/shared-types'

export const CurriculumClient: React.FC<{
  modules: Array<{
    id: number
    documentId: string
    order: number
    duration: number
    title: string
    lessons: Lesson[]
  }>
}> = ({ modules }) => {
  const { openVideo } = useVideo()
  const user = useUser()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Update the handleLessonClick function
  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isFree && lesson.videoUrl && lesson.type === 'video') {
      if (!user) {
        const currentPath = window.location.pathname
        toast.error('Please log in to watch free lectures', {
          description: 'You will be redirected back after login',
        })
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
        return
      }

      // Debug logging
      console.log('Opening video for lesson:', lesson.title)
      console.log('Video URL/HTML:', lesson.videoUrl)

      try {
        openVideo(lesson.videoUrl)
      } catch (error) {
        console.error('Error opening video:', error)
        toast.error('Failed to open video. Please try again.')
      }
    }
  }

  const getTotalLessons = (module: Module) => {
    return module.lessons?.length || 0
  }

  //Get total duration should do the following
  // 1. Check if module.lessons exists
  // 2. If not, return '0 min'
  // 3. If it does, reduce the lessons to get the total duration in Hours, minutes, second, Lesson duration is coming as seconds
  const getTotalDuration = (module: Module) => {
    if (!module.lessons) return '0 min'
    const totalSeconds = module.lessons.reduce(
      (total: number, lesson: Lesson) => {
        const duration = lesson.duration || '0'
        const seconds = parseInt(String(duration).replace(/\D/g, '')) || 0
        return total + seconds
      },
      0
    )

    if (totalSeconds >= 3600) {
      const hours = Math.floor(totalSeconds / 3600)
      const mins = Math.floor((totalSeconds % 3600) / 60)
      const secs = totalSeconds % 60
      return `${hours}h ${mins}m ${secs}s`
    }
    return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`
  }

  const getFreeLessonsCount = (module: Module) => {
    return module.lessons?.filter((lesson: Lesson) => lesson.isFree).length || 0
  }

  return (
    <div className="mt-3 space-y-4">
      <div className="mb-6">
        {/* <h2 className="text-3xl font-bold tracking-tight mb-6">
          Course Curriculum
        </h2> */}
        <p className="text-muted-foreground">
          {modules.length} modules •{' '}
          {modules.reduce(
            (total, module) => total + getTotalLessons(module),
            0
          )}{' '}
          lessons
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {modules.map((module, moduleIndex) => (
          <AccordionItem
            key={module.id}
            value={`module-${moduleIndex}`}
            className="border border-border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="flex items-center justify-between px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors group">
              <div className="flex items-center gap-4 text-left">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ninja-gold text-ninja-navy flex items-center justify-center text-sm font-bold">
                  {moduleIndex + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-ninja-gold transition-colors">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      {getTotalLessons(module)} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getTotalDuration(module)}
                    </span>
                    {getFreeLessonsCount(module) > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {getFreeLessonsCount(module)} free
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-0 pb-0">
              <div className="bg-muted/20 border-t">
                {module.lessons?.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`flex items-center justify-between px-6 py-4 border-b border-border/50 last:border-b-0 transition-all ${
                      lesson.isFree &&
                      lesson.videoUrl &&
                      lesson.type === 'video'
                        ? 'cursor-pointer hover:bg-ninja-gold/10 hover:border-ninja-gold/20 group'
                        : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        {lessonIndex + 1}
                      </div>

                      <div className="flex items-center gap-3">
                        {lesson.type === 'video' ? (
                          <PlayCircle
                            className={`h-5 w-5 ${
                              lesson.isFree
                                ? 'text-ninja-gold group-hover:text-ninja-orange transition-colors'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ) : (
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        )}

                        <div>
                          <h4
                            className={`font-medium transition-colors ${
                              lesson.isFree
                                ? 'text-foreground group-hover:text-primary dark:group-hover:text-ninja-gold'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {lesson.title}
                          </h4>
                          {lesson.type === 'video' && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Video lesson
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(lesson.duration)}</span>
                      </div>

                      {lesson.isFree ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Free Preview
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            Premium
                          </Badge>
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
    </div>
  )
}
