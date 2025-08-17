'use client'

import { useEffect, useRef, useCallback } from 'react' // Add useCallback import
import { usePathname } from 'next/navigation'
import { Player } from 'player.js'
import {
  UserProgressService,
  type LessonProgressPayload,
} from '@/lib/user-progress'

interface UseVideoProgressOptions {
  lectureId: string
  courseDocumentId: string
  moduleDocumentId: string
  lessonDocumentId: string
  updateInterval?: number
  completionThreshold?: number
  totalModuleLessons?: number
  completedModuleLessons?: number
  onLessonCompleted?: (lessonDocumentId: string) => void
  isLessonComplete?: boolean
}

export function useVideoProgress(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  {
    courseDocumentId,
    moduleDocumentId,
    lessonDocumentId,
    updateInterval = 30000,
    completionThreshold = 90,
    totalModuleLessons = 0,
    completedModuleLessons = 0,
    onLessonCompleted,
    isLessonComplete = false,
  }: UseVideoProgressOptions
) {
  const pathname = usePathname()
  const playerRef = useRef<Player | null>(null)
  const lastReportedTime = useRef<number>(0)
  const videoDuration = useRef<number>(0)
  const isComplete = useRef<boolean>(isLessonComplete)
  const completionSent = useRef<boolean>(isLessonComplete)
  const thresholdReached = useRef<boolean>(isLessonComplete)
  const videoEnded = useRef<boolean>(false)
  const finalProgressSent = useRef<boolean>(isLessonComplete)
  const initializationAttempts = useRef<number>(0)
  const isInitialized = useRef<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const sessionStartTime = useRef<Date>(new Date())
  const totalTimeSpent = useRef<number>(0)

  // Wrap sendProgressToStrapi in useCallback
  const sendProgressToStrapi = useCallback(
    async (
      time: number,
      duration: number,
      isFinal = false,
      isVideoEnd = false
    ) => {
      // Skip if lesson is already completed
      if (isLessonComplete) return

      try {
        const now = new Date()
        const timeSpentInSession = Math.floor(
          (now.getTime() - sessionStartTime.current.getTime()) / 1000
        )
        totalTimeSpent.current += timeSpentInSession
        sessionStartTime.current = now

        const progressPercent = (time / duration) * 100

        const lessonStatus =
          isVideoEnd || progressPercent >= completionThreshold
            ? 'completed'
            : 'inProgress'

        if (
          lessonStatus === 'completed' &&
          !isComplete.current &&
          onLessonCompleted
        ) {
          onLessonCompleted(lessonDocumentId)
          isComplete.current = true
        }

        const willCompleteModule =
          lessonStatus === 'completed' &&
          completedModuleLessons + 1 >= totalModuleLessons

        const payload: LessonProgressPayload = {
          startedAt: sessionStartTime.current.toISOString(),
          lastPosition: Math.floor(time),
          timeSpent: totalTimeSpent.current,
          lessonStatus,
          isModuleCompleted: willCompleteModule,
        }
        console.log({ lessonDocumentId })

        await UserProgressService.updateLessonProgress(
          courseDocumentId,
          moduleDocumentId,
          lessonDocumentId,
          payload
        )

        if (lessonStatus === 'completed') {
          completionSent.current = true
          if (!isVideoEnd) {
            thresholdReached.current = true
          }
        }

        if (isFinal || isVideoEnd) {
          finalProgressSent.current = true
        }

        console.log('✅ Video progress sent successfully')
      } catch (error) {
        console.error('❌ Failed to send video progress:', error)
      }
    },
    [
      isLessonComplete,
      completionThreshold,
      onLessonCompleted,
      lessonDocumentId,
      completedModuleLessons,
      totalModuleLessons,
      courseDocumentId,
      moduleDocumentId,
    ]
  )

  const cleanupPlayer = useCallback(() => {
    if (playerRef.current && isInitialized.current) {
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          playerRef.current.off('timeupdate')
          playerRef.current.off('ready')
          playerRef.current.off('error')
          playerRef.current.off('ended')
        }
      } catch (error) {
        console.error('Error cleaning up player events:', error)
      }

      playerRef.current = null
      isInitialized.current = false
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initializePlayer = useCallback(() => {
    // Skip initialization if lesson is already completed
    if (
      !iframeRef?.current ||
      playerRef.current ||
      isInitialized.current ||
      isLessonComplete
    )
      return

    try {
      const checkIframeLoad = () => {
        if (!iframeRef.current || isLessonComplete) return

        try {
          const player = new Player(iframeRef.current)
          playerRef.current = player
          isInitialized.current = true

          player.on('ready', () => {
            if (!playerRef.current || isLessonComplete) return

            player.getDuration((d) => {
              videoDuration.current = d
              console.log('Video duration:', d)
            })
          })

          player.on('timeupdate', (data) => {
            if (
              !videoDuration.current ||
              !isInitialized.current ||
              isLessonComplete
            ) {
              return
            }
            const { seconds = 0 } = data || {}
            const progressPercent = (seconds / videoDuration.current) * 100

            if (
              !thresholdReached.current &&
              progressPercent >= completionThreshold
            ) {
              thresholdReached.current = true
              sendProgressToStrapi(seconds, videoDuration.current)
            }
          })

          // FIX: Update the ended event handler to ensure final update with full duration
          player.on('ended', () => {
            console.log('Video ended')
            if (
              !videoEnded.current &&
              !finalProgressSent.current &&
              !isLessonComplete &&
              videoDuration.current > 0
            ) {
              videoEnded.current = true
              // Send final progress with full video duration to ensure watched duration = video duration
              console.log(
                '📹 Sending final video completion with full duration:',
                videoDuration.current
              )
              sendProgressToStrapi(
                videoDuration.current, // Use full duration as watched time
                videoDuration.current,
                true, // isFinal = true
                true // isVideoEnd = true
              )
            }
          })

          player.on('error', (error) => {
            console.error('Player error:', error)
          })
        } catch (error) {
          console.error('Failed to initialize player:', error)
          isInitialized.current = false

          if (initializationAttempts.current < 3 && !isLessonComplete) {
            initializationAttempts.current++
            setTimeout(() => {
              if (iframeRef.current && !isLessonComplete) {
                checkIframeLoad()
              }
            }, 2000)
          }
        }
      }

      if (iframeRef.current.contentDocument?.readyState === 'complete') {
        setTimeout(checkIframeLoad, 1000)
      } else {
        iframeRef.current.onload = () => {
          setTimeout(checkIframeLoad, 1000)
        }
      }
    } catch (error) {
      console.error('Failed to set up player initialization:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLessonComplete, completionThreshold, sendProgressToStrapi])

  // Main effect for player initialization and progress tracking
  useEffect(() => {
    // Skip all tracking if lesson is already completed
    if (isLessonComplete) {
      console.log(
        '🎥 Video lesson already completed - skipping progress tracking'
      )
      return
    }

    console.log('🚀 Starting video progress tracking for incomplete lesson')

    // Reset state
    initializationAttempts.current = 0
    isComplete.current = false
    completionSent.current = false
    thresholdReached.current = false
    videoEnded.current = false
    finalProgressSent.current = false
    lastReportedTime.current = 0
    videoDuration.current = 0
    sessionStartTime.current = new Date()
    totalTimeSpent.current = 0

    if (!iframeRef?.current) {
      const checkIframe = setInterval(() => {
        if (iframeRef?.current && !isLessonComplete) {
          clearInterval(checkIframe)
          initializePlayer()
        }
      }, 500)

      return () => {
        clearInterval(checkIframe)
        cleanupPlayer()
      }
    } else {
      initializePlayer()
    }

    intervalRef.current = setInterval(() => {
      if (
        !playerRef.current ||
        !isInitialized.current ||
        videoEnded.current ||
        !videoDuration.current ||
        isLessonComplete
      )
        return

      try {
        playerRef.current.getCurrentTime((time) => {
          if (Math.abs(time - lastReportedTime.current) >= 10) {
            const progressPercent = (time / videoDuration.current) * 100

            if (
              !thresholdReached.current &&
              progressPercent < completionThreshold
            ) {
              sendProgressToStrapi(time, videoDuration.current)
              lastReportedTime.current = time
            } else if (thresholdReached.current && !videoEnded.current) {
              lastReportedTime.current = time

              if (progressPercent >= 99 && !finalProgressSent.current) {
                sendProgressToStrapi(time, videoDuration.current, true, false)
                finalProgressSent.current = true
              }
            }
          }
        })
      } catch (error) {
        console.error('Error getting current time:', error)
      }
    }, updateInterval)

    const handleBeforeUnload = () => {
      if (
        !playerRef.current ||
        !isInitialized.current ||
        !videoDuration.current ||
        finalProgressSent.current ||
        isLessonComplete
      )
        return

      try {
        playerRef.current.getCurrentTime((time) => {
          sendProgressToStrapi(time, videoDuration.current, true, false)
        })
      } catch (error) {
        console.error('Error in beforeunload:', error)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      cleanupPlayer()
    }
  }, [
    courseDocumentId,
    moduleDocumentId,
    lessonDocumentId,
    updateInterval,
    completionThreshold,
    totalModuleLessons,
    completedModuleLessons,
    onLessonCompleted,
    isLessonComplete,
    sendProgressToStrapi, // Add this dependency
    initializePlayer, // Add this dependency
    cleanupPlayer, // Add this dependency
  ])

  // Handle route changes
  useEffect(() => {
    return () => {
      if (
        playerRef.current &&
        isInitialized.current &&
        videoDuration.current &&
        !finalProgressSent.current &&
        !isLessonComplete
      ) {
        try {
          playerRef.current.getCurrentTime((time) => {
            sendProgressToStrapi(time, videoDuration.current, true, false)
          })
        } catch (error) {
          console.error('Error in route change cleanup:', error)
        }
      }
    }
  }, [pathname, isLessonComplete, sendProgressToStrapi]) // Add sendProgressToStrapi dependency
}
