'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Maximize2, CheckCircle } from 'lucide-react'
import { CurrentContent } from '@/types/course-view-types'
import { useTextProgress } from '@/hooks/useTextProgress'
import { useCourse } from '@/components/context/course-view-provider'

interface TextContentProps {
  currentContent: CurrentContent
}

export function TextContent({ currentContent }: TextContentProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const { courseData, modules, markLessonCompleted } = useCourse()

  // Find current module and lesson
  const currentModule = modules.find((m) => m.id === currentContent.moduleId)
  const currentLesson = currentModule?.lessons.find(
    (l) => l.id === currentContent.lessonId
  )

  // Count completed lessons in current module (excluding current lesson)
  const completedLessonsInModule =
    currentModule?.lessons.filter(
      (l) => l.completed && l.id !== currentContent.lessonId
    ).length || 0

  // Calculate content length for reading progress
  const contentLength = React.useMemo(() => {
    const textContent = currentContent.content?.replace(/<[^>]*>/g, '') || ''
    return textContent.length
  }, [currentContent.content])

  // Use text progress hook - ADD isLessonComplete parameter
  const { markAsCompleted, isCompleted, expectedReadingTime, canComplete } =
    useTextProgress({
      courseDocumentId: courseData?.documentId || '',
      moduleDocumentId: currentModule?.documentId || '',
      lessonDocumentId: currentLesson?.documentId || '',
      totalModuleLessons: currentModule?.lessons.length || 0,
      completedModuleLessons: completedLessonsInModule,
      onLessonCompleted: markLessonCompleted,
      contentLength,
      isLessonComplete: currentLesson?.completed || false, // ADD THIS LINE
    })

  const handleMarkCompleted = () => {
    if (!isCompleted) {
      markAsCompleted()
    }
  }

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <div className="aspect-video bg-muted flex items-start p-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold mb-4">
                {currentContent.title}
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="line-clamp-6">
                  <p
                    className="whitespace-pre-line text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html:
                        currentContent.content?.substring(0, 400) +
                        (currentContent.content &&
                        currentContent.content.length > 400
                          ? '...'
                          : ''),
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Full View
              </Button>

              {/* Mark as Complete Button with proper dark mode colors */}
              <Button
                variant={isCompleted ? 'default' : 'secondary'}
                size="sm"
                onClick={handleMarkCompleted}
                disabled={isCompleted}
                className={
                  isCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white border-0'
                    : ''
                }
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">
              {currentContent.title}
            </DialogTitle>

            <Button
              variant={isCompleted ? 'default' : 'secondary'}
              size="sm"
              onClick={handleMarkCompleted}
              disabled={isCompleted}
              className={
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white border-0'
                  : ''
              }
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </Button>
          </DialogHeader>

          <DialogDescription className="sr-only">
            Full view of the lesson content: {currentContent.title}. Reading
            time: approximately {formatTime(expectedReadingTime)}.
            {isCompleted
              ? 'This lesson has been completed.'
              : canComplete
              ? 'Lesson is ready to be marked as complete.'
              : 'Continue reading to complete the lesson.'}
          </DialogDescription>

          <ScrollArea className="flex-1 -mt-2">
            <div className="pr-4">
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-line">
                  <p
                    className="whitespace-pre-line text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: currentContent.content }}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
