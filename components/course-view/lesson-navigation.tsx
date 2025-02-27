'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Lesson, Module } from './types/course'

interface LessonNavigationProps {
  modules: Module[]
  currentModuleId: string
  currentLessonId: string
  onLessonSelect: (moduleId: string, lesson: Lesson) => void
}

export function LessonNavigation({
  modules,
  currentModuleId,
  currentLessonId,
  onLessonSelect,
}: LessonNavigationProps) {
  const findNextAndPreviousLessons = () => {
    const allLessons: { moduleId: string; lesson: Lesson }[] = []
    modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        allLessons.push({ moduleId: module.id, lesson: lesson as Lesson })
      })
    })

    const currentIndex = allLessons.findIndex(
      ({ moduleId, lesson }) =>
        moduleId === currentModuleId && lesson.id === currentLessonId
    )

    return {
      previous: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next:
        currentIndex < allLessons.length - 1
          ? allLessons[currentIndex + 1]
          : null,
    }
  }

  const { previous, next } = findNextAndPreviousLessons()

  return (
    <div className="flex justify-between items-center pt-6 mt-6 border-t">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() =>
          previous && onLessonSelect(previous.moduleId, previous.lesson)
        }
        disabled={!previous}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous Lesson
      </Button>
      <Button
        variant="default"
        className="flex items-center gap-2"
        onClick={() => next && onLessonSelect(next.moduleId, next.lesson)}
        disabled={!next}
      >
        Next Lesson
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
