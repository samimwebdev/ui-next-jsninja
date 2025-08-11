'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Lesson, Module } from '@/types/course-view-types'
import { useRouter, useParams } from 'next/navigation'

interface LessonNavigationProps {
  modules: Module[]
  currentModuleId: number | null
  currentLessonId: number | null
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
        item.lesson.id === currentLessonId && item.moduleId === currentModuleId
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
    <div className="flex justify-between items-center px-8 py-6 border-t bg-card">
      <div className="flex-1 flex justify-start">
        {previousLesson && (
          <Button
            variant="outline"
            onClick={() =>
              handleNavigation(previousLesson.lesson, previousLesson.moduleId)
            }
            className="flex items-center gap-3 px-4 py-6 group hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 mb-1">
                Previous
              </div>
              <div className="font-medium text-sm truncate max-w-[200px]">
                {previousLesson.lesson.title}
              </div>
            </div>
          </Button>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {nextLesson && (
          <Button
            variant="outline"
            onClick={() =>
              handleNavigation(nextLesson.lesson, nextLesson.moduleId)
            }
            className="flex items-center gap-3 px-4 py-6 group hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 mb-1">
                Next
              </div>
              <div className="font-medium text-sm truncate max-w-[200px]">
                {nextLesson.lesson.title}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  )
}

