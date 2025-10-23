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
import { ReleasedBadge } from '../course/released-badge'
import { isModuleReleased } from '@/lib/course-utils'

export const CurriculumClient: React.FC<{
  courseType?: string
  modules: Array<{
    id: number
    documentId: string
    order: number
    duration: number
    title: string
    lessons: Lesson[]
    releaseDate: Date | null
  }>
}> = ({ modules, courseType }) => {
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
    <div className="mt-3 space-y-3 sm:space-y-4">
      {/* Header stats - Responsive */}
      <div className="mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-muted-foreground">
          {modules.length} modules •{' '}
          {modules.reduce(
            (total, module) => total + getTotalLessons(module),
            0
          )}{' '}
          lessons
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
        {modules.map((module, moduleIndex) => {
          const isReleased = isModuleReleased(
            module.releaseDate?.toString() || null
          )
          const freeLessons = getFreeLessonsCount(module)

          return (
            <AccordionItem
              key={module.id}
              value={`module-${moduleIndex}`}
              className="border border-border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hover:no-underline hover:bg-muted/50 transition-colors group [&[data-state=open]>div>div:first-child]:bg-primary [&[data-state=open]>div>div:first-child]:text-primary-foreground">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 text-left flex-1 min-w-0 pr-2">
                  {/* Module number - Smaller on mobile */}
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-ninja-gold text-ninja-navy flex items-center justify-center text-xs sm:text-sm font-bold transition-colors">
                    {moduleIndex + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Module title - Responsive sizing */}
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground group-hover:text-ninja-gold transition-colors line-clamp-2 sm:line-clamp-1">
                      {module.title}
                    </h3>

                    {/* Release badge - Only on desktop or if important */}
                    {courseType === 'course' && (
                      <div className="hidden sm:block mt-1">
                        <ReleasedBadge
                          isReleased={isReleased}
                          releaseDate={module.releaseDate}
                        />
                      </div>
                    )}

                    {/* Module stats - Compact on mobile */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {getTotalLessons(module)} lessons
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {getTotalDuration(module)}
                        </span>
                      </span>
                      {freeLessons > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {freeLessons} free
                          </span>
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
                      className={`flex items-start sm:items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-border/50 last:border-b-0 transition-all gap-2 ${
                        lesson.isFree &&
                        lesson.videoUrl &&
                        lesson.type === 'video'
                          ? 'cursor-pointer hover:bg-ninja-gold/10 hover:border-ninja-gold/20 group active:bg-ninja-gold/20'
                          : 'cursor-default'
                      }`}
                    >
                      {/* Left side - Lesson info */}
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                        {/* Lesson number */}
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground mt-0.5 sm:mt-0">
                          {lessonIndex + 1}
                        </div>

                        {/* Icon and title */}
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          {lesson.type === 'video' ? (
                            <PlayCircle
                              className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-0 ${
                                lesson.isFree
                                  ? 'text-ninja-gold group-hover:text-ninja-orange transition-colors'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ) : (
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                          )}

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-medium text-sm sm:text-base transition-colors line-clamp-2 sm:line-clamp-1 ${
                                lesson.isFree
                                  ? 'text-foreground group-hover:text-primary dark:group-hover:text-ninja-gold'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {lesson.title}
                            </h4>
                            {lesson.type === 'video' && (
                              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                                Video lesson
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Duration and badge */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                        {/* Duration */}
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{formatDuration(lesson.duration)}</span>
                        </div>

                        {/* Badge */}
                        {lesson.isFree ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 text-xs px-2 py-0.5 whitespace-nowrap"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">
                              Free Preview
                            </span>
                            <span className="sm:hidden">Free</span>
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <Badge
                              variant="outline"
                              className="text-muted-foreground text-xs px-2 py-0.5 hidden sm:inline-flex"
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
          )
        })}
      </Accordion>
    </div>
  )
}
