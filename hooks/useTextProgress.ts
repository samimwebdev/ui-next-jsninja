'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  UserProgressService,
  type LessonProgressPayload,
} from '@/lib/user-progress'

interface UseTextProgressOptions {
  courseDocumentId: string
  moduleDocumentId: string
  lessonDocumentId: string
  totalModuleLessons?: number
  completedModuleLessons?: number
  onLessonCompleted?: (lessonDocumentId: string) => void
  contentLength?: number
  isLessonComplete?: boolean
}

export function useTextProgress({
  courseDocumentId,
  moduleDocumentId,
  lessonDocumentId,
  totalModuleLessons = 0,
  completedModuleLessons = 0,
  onLessonCompleted,
  contentLength = 0,
  isLessonComplete = false,
}: UseTextProgressOptions) {
  const pathname = usePathname()
  const isComplete = useRef<boolean>(isLessonComplete)
  const completionSent = useRef<boolean>(isLessonComplete)
  const sessionStartTime = useRef<Date>(new Date())
  const startTime = useRef<Date>(new Date())
  const [timeSpent, setTimeSpent] = useState<number>(0)

  // Calculate expected reading time based on content length
  const expectedReadingTimeSeconds = Math.max(
    30,
    Math.floor(contentLength / ((200 * 5) / 60))
  )

  // Calculate lastPosition based on time spent vs expected reading time
  const calculateLastPosition = useCallback(
    (currentTimeSpent: number): number => {
      if (expectedReadingTimeSeconds === 0) return 0
      const progressPercent = Math.min(
        (currentTimeSpent / expectedReadingTimeSeconds) * 100,
        100
      )
      return progressPercent
    },
    [expectedReadingTimeSeconds]
  )

  // Send completion to server
  const sendCompletionToStrapi = useCallback(async () => {
    // Skip if lesson is already completed
    if (completionSent.current || isLessonComplete) return

    try {
      const currentTimeSpent = Math.floor(
        (new Date().getTime() - startTime.current.getTime()) / 1000
      )

      completionSent.current = true

      if (!isComplete.current && onLessonCompleted) {
        console.log('🔥 Marking text lesson as completed')
        onLessonCompleted(lessonDocumentId)
        isComplete.current = true
      }

      const willCompleteModule =
        completedModuleLessons + 1 >= totalModuleLessons

      const payload: LessonProgressPayload = {
        startedAt: sessionStartTime.current.toISOString(),
        lastPosition: 100,
        timeSpent: currentTimeSpent,
        lessonStatus: 'completed',
        isModuleCompleted: willCompleteModule,
      }

      await UserProgressService.updateLessonProgress(
        courseDocumentId,
        moduleDocumentId,
        lessonDocumentId,
        payload
      )

      console.log('✅ Text lesson completion sent successfully')
    } catch (error) {
      console.error('❌ Failed to send text completion:', error)
      completionSent.current = false
    }
  }, [
    courseDocumentId,
    moduleDocumentId,
    lessonDocumentId,
    totalModuleLessons,
    completedModuleLessons,
    onLessonCompleted,
    isLessonComplete,
  ])

  // Send progress update
  const sendProgressUpdate = useCallback(
    async (currentTimeSpent: number) => {
      // Skip if lesson is already completed
      if (completionSent.current || isComplete.current || isLessonComplete)
        return

      try {
        const lastPosition = calculateLastPosition(currentTimeSpent)

        const payload: LessonProgressPayload = {
          startedAt: sessionStartTime.current.toISOString(),
          lastPosition: Math.floor(lastPosition),
          timeSpent: currentTimeSpent,
          lessonStatus: 'inProgress',
          isModuleCompleted: false,
        }

        await UserProgressService.updateLessonProgress(
          courseDocumentId,
          moduleDocumentId,
          lessonDocumentId,
          payload
        )

        console.log('📊 Text progress update sent')
      } catch (error) {
        console.error('❌ Failed to send text progress update:', error)
      }
    },
    [
      courseDocumentId,
      moduleDocumentId,
      lessonDocumentId,
      calculateLastPosition,
      isLessonComplete,
    ]
  )

  // Check if lesson should be auto-completed based on reading time
  const checkAutoCompletion = useCallback(
    (currentTimeSpent: number) => {
      // Skip if lesson is already completed
      if (isComplete.current || completionSent.current || isLessonComplete)
        return
      if (currentTimeSpent >= expectedReadingTimeSeconds) {
        sendCompletionToStrapi()
      }
    },
    [expectedReadingTimeSeconds, sendCompletionToStrapi, isLessonComplete]
  )

  // Main tracking effect
  useEffect(() => {
    // Skip all tracking if lesson is already completed
    if (isLessonComplete) {
      console.log(
        '📚 Text lesson already completed - skipping progress tracking'
      )
      return
    }

    console.log('🚀 Starting text progress tracking for incomplete lesson')

    // Reset state for new lesson
    isComplete.current = false
    completionSent.current = false
    sessionStartTime.current = new Date()
    startTime.current = new Date()
    setTimeSpent(0)

    // Time tracking interval
    const timeTracker = setInterval(() => {
      if (completionSent.current || isComplete.current) return

      const currentTimeSpent = Math.floor(
        (new Date().getTime() - startTime.current.getTime()) / 1000
      )
      setTimeSpent(currentTimeSpent)
      checkAutoCompletion(currentTimeSpent)
    }, 1000)

    // Initial progress update after 10 seconds
    const progressTimer = setTimeout(() => {
      if (!completionSent.current && !isComplete.current) {
        const currentTimeSpent = Math.floor(
          (new Date().getTime() - startTime.current.getTime()) / 1000
        )
        sendProgressUpdate(currentTimeSpent)
      }
    }, 10000)

    // Periodic progress updates every 30 seconds
    const periodicTimer = setInterval(() => {
      if (!completionSent.current && !isComplete.current) {
        const currentTimeSpent = Math.floor(
          (new Date().getTime() - startTime.current.getTime()) / 1000
        )
        sendProgressUpdate(currentTimeSpent)
      }
    }, 30000)

    // Handle tab close / refresh
    const handleBeforeUnload = () => {
      if (!completionSent.current && !isComplete.current) {
        const currentTimeSpent = Math.floor(
          (new Date().getTime() - startTime.current.getTime()) / 1000
        )

        if (currentTimeSpent >= expectedReadingTimeSeconds) {
          sendCompletionToStrapi()
        } else if (currentTimeSpent > 10) {
          sendProgressUpdate(currentTimeSpent)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(timeTracker)
      clearTimeout(progressTimer)
      clearInterval(periodicTimer)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [
    lessonDocumentId,
    isLessonComplete,
    checkAutoCompletion,
    sendProgressUpdate,
    sendCompletionToStrapi,
    expectedReadingTimeSeconds,
  ])

  // Handle route changes
  useEffect(() => {
    return () => {
      if (!completionSent.current && !isComplete.current && !isLessonComplete) {
        const currentTimeSpent = Math.floor(
          (new Date().getTime() - startTime.current.getTime()) / 1000
        )

        if (currentTimeSpent >= expectedReadingTimeSeconds) {
          sendCompletionToStrapi()
        } else if (currentTimeSpent > 10) {
          sendProgressUpdate(currentTimeSpent)
        }
      }
    }
  }, [
    pathname,
    sendCompletionToStrapi,
    sendProgressUpdate,
    expectedReadingTimeSeconds,
    isLessonComplete,
  ])

  // Always return the same structure to avoid hook order issues
  return {
    markAsCompleted: isLessonComplete ? () => {} : sendCompletionToStrapi,
    isCompleted: isLessonComplete ? true : isComplete.current,
    timeSpent: isLessonComplete ? 0 : timeSpent,
    expectedReadingTime: expectedReadingTimeSeconds,
    progressPercent: isLessonComplete ? 100 : calculateLastPosition(timeSpent),
    canComplete: isLessonComplete
      ? true
      : timeSpent >= expectedReadingTimeSeconds,
  }
}
