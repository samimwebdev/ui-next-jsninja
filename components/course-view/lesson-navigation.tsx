'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Lesson, Module } from '@/types/course-view-types'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface LessonNavigationProps {
  modules: Module[]
  currentModuleId: number | null
  currentLessonId: string | null
  onLessonSelect: (moduleId: number, lesson: Lesson) => void
  slug: string
}

export function LessonNavigation({
  modules,
  currentModuleId,
  currentLessonId,
}: LessonNavigationProps) {
  const router = useRouter()
  const params = useParams()

  // Find current lesson and its position
  const findCurrentLessonPosition = () => {
    const allLessons: Array<{ lesson: Lesson; moduleId: number }> = []

    // Flatten all lessons with their module IDs
    modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        allLessons.push({ lesson, moduleId: module.id })
      })
    })

    // Find current lesson index
    const currentIndex = allLessons.findIndex(
      (item) =>
        item.lesson.documentId === currentLessonId &&
        item.moduleId === currentModuleId
    )

    return {
      allLessons,
      currentIndex,
      previousLesson: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      nextLesson:
        currentIndex < allLessons.length - 1
          ? allLessons[currentIndex + 1]
          : null,
    }
  }

  const { previousLesson, nextLesson } = findCurrentLessonPosition()

  const handleNavigation = (targetLesson: Lesson, targetModuleId: number) => {
    const slug = params?.slug
    if (slug) {
      const newUrl = `/course-view/${slug}/modules/${targetModuleId}/lectures/${targetLesson.documentId}`
      router.push(newUrl)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 py-6 sm:py-8 border-t bg-card">
      {/* Previous Button */}
      <div className="flex-1 flex justify-start">
        {previousLesson && (
          <Button
            variant="outline"
            onClick={() =>
              handleNavigation(previousLesson.lesson, previousLesson.moduleId)
            }
            className={cn(
              'flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-5 sm:py-6',
              'group hover:bg-primary hover:text-primary-foreground transition-colors',
              'w-full sm:w-auto justify-start min-h-[72px]'
            )}
          >
            <ChevronLeft className="h-5 w-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left min-w-0 flex-1">
              <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 mb-0.5">
                Previous
              </div>
              <div className="font-medium text-sm truncate max-w-[250px] sm:max-w-[200px]">
                {previousLesson.lesson.title}
              </div>
            </div>
          </Button>
        )}
      </div>

      {/* Next Button */}
      <div className="flex-1 flex justify-end">
        {nextLesson && (
          <Button
            variant="outline"
            onClick={() =>
              handleNavigation(nextLesson.lesson, nextLesson.moduleId)
            }
            className={cn(
              'flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-5 sm:py-6',
              'group hover:bg-primary hover:text-primary-foreground transition-colors',
              'w-full sm:w-auto justify-end min-h-[72px]'
            )}
          >
            <div className="text-right min-w-0 flex-1">
              <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 mb-0.5">
                Next
              </div>
              <div className="font-medium text-sm truncate sm:max-w-[200px]">
                {nextLesson.lesson.title}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  )
}
