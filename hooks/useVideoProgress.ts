'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { Player } from 'player.js'
import {
  updateLessonProgress,
  type LessonProgressPayload,
} from '@/lib/actions/user-progress'

interface UseVideoProgressOptions {
  lectureId: string
  courseDocumentId: string
  moduleDocumentId: string
  lessonDocumentId: string
  updateInterval?: number // How often to save progress (default: 30s)
  completionThreshold?: number // Percentage to mark as complete (default: 90%)
  totalModuleLessons?: number
  completedModuleLessons?: number
  onLessonCompleted?: (lessonDocumentId: string) => void
  isLessonComplete?: boolean
  lastPosition?: number
}

/**
 * Video progress tracking hook
 * Sends watched time segments to backend for server-side deduplication
 */
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
    lastPosition = 0,
  }: UseVideoProgressOptions
) {
  const pathname = usePathname()

  // ==================== REFS ====================
  const playerRef = useRef<Player | null>(null)
  const isInitialized = useRef<boolean>(false)

  // Video metadata
  const videoDuration = useRef<number>(0)
  const lastReportedTime = useRef<number>(0)

  // Completion tracking
  const isComplete = useRef<boolean>(isLessonComplete)
  const hasReachedThreshold = useRef<boolean>(isLessonComplete)
  const hasVideoEnded = useRef<boolean>(false)
  const hasSentFinalProgress = useRef<boolean>(isLessonComplete)

  // Progress interval
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Watch time tracking - Store segments to send to backend
  const isCurrentlyPlaying = useRef<boolean>(false)
  const currentSegmentStart = useRef<number | null>(null)
  const pendingSegments = useRef<Array<{ start: number; end: number }>>([])

  // Seek state
  const currentLessonId = useRef<string>(lessonDocumentId)
  const hasSeekToStart = useRef<boolean>(false)

  // ==================== LESSON CHANGE DETECTION ====================
  /**
   * Reset all state when lesson changes
   */
  useEffect(() => {
    const lessonChanged = currentLessonId.current !== lessonDocumentId

    if (lessonChanged) {
      currentLessonId.current = lessonDocumentId

      // Reset all tracking state
      lastReportedTime.current = 0
      videoDuration.current = 0
      isComplete.current = isLessonComplete
      hasReachedThreshold.current = isLessonComplete
      hasVideoEnded.current = false
      hasSentFinalProgress.current = isLessonComplete
      isCurrentlyPlaying.current = false
      currentSegmentStart.current = null
      pendingSegments.current = []
      hasSeekToStart.current = false
    }

    // Reset seek flag when position changes
    if (lastPosition > 0) {
      hasSeekToStart.current = false
    }
  }, [lessonDocumentId, lastPosition, isLessonComplete])

  // ==================== SEGMENT TRACKING ====================
  /**
   * Record a watched segment (to be sent to backend)
   */
  const recordWatchSegment = useCallback((start: number, end: number) => {
    // Only record valid segments (forward progress, minimum 1 second)
    if (end > start && end - start >= 1) {
      console.log(
        `📊 Recording segment: ${start.toFixed(1)}s - ${end.toFixed(1)}s`
      )
      pendingSegments.current.push({ start, end })
    }
  }, [])

  /**
   * Handle play event - start tracking segment
   */
  const handlePlay = useCallback((currentTime: number) => {
    isCurrentlyPlaying.current = true
    currentSegmentStart.current = currentTime
  }, [])

  /**
   * Handle pause event - finish tracking segment
   */
  const handlePause = useCallback(
    (currentTime: number) => {
      // Record the segment if valid
      if (
        isCurrentlyPlaying.current &&
        currentSegmentStart.current !== null &&
        currentTime > currentSegmentStart.current
      ) {
        recordWatchSegment(currentSegmentStart.current, currentTime)
      }

      isCurrentlyPlaying.current = false
      currentSegmentStart.current = null
    },
    [recordWatchSegment]
  )

  /**
   * Handle seek event - finish previous segment and start new one
   */
  const handleSeek = useCallback(
    (oldTime: number, newTime: number) => {
      console.log(
        `⏩ Seeked from ${oldTime.toFixed(1)}s to ${newTime.toFixed(1)}s`
      )

      // If was playing, record the previous segment
      if (
        isCurrentlyPlaying.current &&
        currentSegmentStart.current !== null &&
        oldTime > currentSegmentStart.current
      ) {
        recordWatchSegment(currentSegmentStart.current, oldTime)
      }

      // If still playing after seek, start new segment
      if (isCurrentlyPlaying.current) {
        currentSegmentStart.current = newTime
      }
    },
    [recordWatchSegment]
  )

  // ==================== SEEK TO LAST POSITION ====================
  /**
   * Seek video to last watched position when lesson loads
   */
  const seekToLastPosition = useCallback(() => {
    if (
      !playerRef.current ||
      !isInitialized.current ||
      hasSeekToStart.current ||
      !lastPosition ||
      lastPosition <= 0 ||
      isLessonComplete
    ) {
      return
    }

    console.log(`🎯 Seeking to last position: ${lastPosition}s`)

    try {
      playerRef.current.setCurrentTime(lastPosition, (error) => {
        if (error) {
          console.error('❌ Seek error:', error)
        } else {
          console.log(`✅ Seeked to ${lastPosition}s`)
          hasSeekToStart.current = true
          lastReportedTime.current = lastPosition
        }
      })
    } catch (error) {
      console.error('❌ Seek failed:', error)
    }
  }, [lastPosition, isLessonComplete])

  // ==================== SEND PROGRESS TO BACKEND ====================
  /**
   * Save progress to Strapi backend
   * Backend will handle segment deduplication and calculate unique watch time
   */
  const sendProgressToStrapi = useCallback(
    async (
      currentTime: number,
      duration: number,
      isFinalUpdate = false,
      isVideoEndEvent = false
    ) => {
      // Don't send if already completed
      if (isLessonComplete) return

      try {
        const progressPercent = (currentTime / duration) * 100

        // Determine lesson status
        const lessonStatus =
          isVideoEndEvent || progressPercent >= completionThreshold
            ? 'completed'
            : 'inProgress'

        // Trigger completion callback
        if (
          lessonStatus === 'completed' &&
          !isComplete.current &&
          onLessonCompleted
        ) {
          console.log('🎉 Lesson completed!')
          onLessonCompleted(lessonDocumentId)
          isComplete.current = true
        }

        // Check if module will be completed
        const willCompleteModule =
          lessonStatus === 'completed' &&
          completedModuleLessons + 1 >= totalModuleLessons

        // Get pending segments to send
        const segmentsToSend = [...pendingSegments.current]

        // If currently playing, add the current segment
        if (
          isCurrentlyPlaying.current &&
          currentSegmentStart.current !== null &&
          currentTime > currentSegmentStart.current
        ) {
          segmentsToSend.push({
            start: currentSegmentStart.current,
            end: currentTime,
          })
        }

        // Prepare payload with watched segments
        const payload: LessonProgressPayload = {
          startedAt: new Date().toISOString(),
          lastPosition: Math.floor(currentTime),
          lessonStatus,
          isModuleCompleted: willCompleteModule,
          // Send watched segments to backend for processing
          watchedSegments:
            segmentsToSend.length > 0 ? segmentsToSend : undefined,
        }

        console.log(`📤 Sending ${segmentsToSend.length} segments to backend`)

        // Send to backend
        await updateLessonProgress(
          courseDocumentId,
          moduleDocumentId,
          lessonDocumentId,
          payload
        )

        console.log(`✅ Progress saved: ${Math.floor(progressPercent)}%`)

        // Clear sent segments (backend now has them)
        pendingSegments.current = []

        // Update current segment start time if still playing
        if (isCurrentlyPlaying.current) {
          currentSegmentStart.current = currentTime
        }

        // Update completion flags
        if (lessonStatus === 'completed') {
          hasReachedThreshold.current = true
        }
        if (isFinalUpdate || isVideoEndEvent) {
          hasSentFinalProgress.current = true
        }
      } catch (error) {
        console.error('❌ Failed to save progress:', error)
        // Don't clear segments on error - retry next time
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

  // ==================== PLAYER CLEANUP ====================
  /**
   * Clean up player instance and intervals
   */
  const cleanupPlayer = useCallback(() => {
    if (playerRef.current && isInitialized.current) {
      try {
        // Remove all event listeners
        playerRef.current.off('timeupdate')
        playerRef.current.off('ready')
        playerRef.current.off('error')
        playerRef.current.off('ended')
        playerRef.current.off('play')
        playerRef.current.off('pause')
      } catch (error) {
        console.error('❌ Cleanup error:', error)
      }

      playerRef.current = null
      isInitialized.current = false
    }

    // Clear interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    // Clear iframe onload
    if (iframeRef.current) {
      iframeRef.current.onload = null
    }
  }, [iframeRef])

  // ==================== PLAYER INITIALIZATION ====================
  /**
   * Initialize player.js and set up event listeners
   */
  const initializePlayer = useCallback(() => {
    if (
      !iframeRef?.current ||
      playerRef.current ||
      isInitialized.current ||
      isLessonComplete
    ) {
      return
    }

    console.log('🎬 Initializing video player...')

    try {
      const setupPlayer = () => {
        if (!iframeRef.current || isLessonComplete) return

        try {
          const player = new Player(iframeRef.current)
          playerRef.current = player
          isInitialized.current = true

          let lastTimeUpdateTime = 0

          // ===== READY EVENT =====
          player.on('ready', () => {
            console.log('✅ Player ready')

            player.getDuration((duration) => {
              videoDuration.current = duration
              console.log(`📹 Duration: ${duration}s`)

              if (lastPosition > 0 && lastPosition < duration) {
                setTimeout(() => seekToLastPosition(), 1500)
              }
            })
          })

          // ===== TIME UPDATE EVENT =====
          player.on('timeupdate', (data) => {
            if (!videoDuration.current || !isInitialized.current) return

            const { seconds = 0 } = data || {}
            const progressPercent = (seconds / videoDuration.current) * 100

            // Detect seeks (jump in time)
            const timeDiff = Math.abs(seconds - lastTimeUpdateTime)
            if (timeDiff > 2 && lastTimeUpdateTime > 0) {
              handleSeek(lastTimeUpdateTime, seconds)
            }
            lastTimeUpdateTime = seconds

            // Check completion threshold
            if (
              !hasReachedThreshold.current &&
              progressPercent >= completionThreshold
            ) {
              console.log(`🎯 Reached ${completionThreshold}% threshold`)
              hasReachedThreshold.current = true
              sendProgressToStrapi(seconds, videoDuration.current)
            }
          })

          // ===== PLAY EVENT =====
          player.on('play', () => {
            player.getCurrentTime((time) => {
              handlePlay(time)
            })
          })

          // ===== PAUSE EVENT =====
          player.on('pause', () => {
            player.getCurrentTime((time) => {
              handlePause(time)
            })
          })

          // ===== ENDED EVENT =====
          player.on('ended', () => {
            // Record final segment
            if (
              isCurrentlyPlaying.current &&
              currentSegmentStart.current !== null
            ) {
              recordWatchSegment(
                currentSegmentStart.current,
                videoDuration.current
              )
            }

            isCurrentlyPlaying.current = false
            currentSegmentStart.current = null

            // Send final progress
            if (!hasVideoEnded.current && !hasSentFinalProgress.current) {
              hasVideoEnded.current = true
              sendProgressToStrapi(
                videoDuration.current,
                videoDuration.current,
                true,
                true
              )
            }
          })

          // ===== ERROR EVENT =====
          player.on('error', (error) => {
            console.error('🚨 Player error:', error)
          })
        } catch (error) {
          console.error('❌ Player initialization failed:', error)
          isInitialized.current = false
        }
      }

      if (iframeRef.current.contentDocument?.readyState === 'complete') {
        setTimeout(setupPlayer, 1000)
      } else {
        iframeRef.current.onload = () => setTimeout(setupPlayer, 1000)
      }
    } catch (error) {
      console.error('❌ Setup failed:', error)
    }
  }, [
    iframeRef,
    isLessonComplete,
    lastPosition,
    completionThreshold,
    seekToLastPosition,
    sendProgressToStrapi,
    handlePlay,
    handlePause,
    handleSeek,
    recordWatchSegment,
  ])

  // ==================== MAIN EFFECT ====================
  useEffect(() => {
    if (isLessonComplete) {
      console.log('✅ Lesson already completed - skipping tracking')
      return
    }

    console.log(`📍 Starting lesson: ${lessonDocumentId}`)
    console.log(`⏱️ Last position: ${lastPosition}s`)

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

    // ===== PERIODIC PROGRESS SAVE =====
    progressIntervalRef.current = setInterval(() => {
      if (
        !playerRef.current ||
        !isInitialized.current ||
        hasVideoEnded.current ||
        !videoDuration.current
      ) {
        return
      }

      try {
        playerRef.current.getCurrentTime((currentTime) => {
          // Save progress periodically
          if (
            Math.abs(currentTime - lastReportedTime.current) >= 10 ||
            pendingSegments.current.length > 0
          ) {
            sendProgressToStrapi(currentTime, videoDuration.current)
            lastReportedTime.current = currentTime
          }
        })
      } catch (error) {
        console.error('❌ Progress check error:', error)
      }
    }, updateInterval)

    // ===== SAVE ON PAGE UNLOAD =====
    const handleBeforeUnload = () => {
      if (
        !playerRef.current ||
        !isInitialized.current ||
        !videoDuration.current ||
        hasSentFinalProgress.current
      ) {
        return
      }

      try {
        playerRef.current.getCurrentTime((time) => {
          sendProgressToStrapi(time, videoDuration.current, true)
        })
      } catch (error) {
        console.error('❌ Unload save error:', error)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      cleanupPlayer()
    }
  }, [
    lessonDocumentId,
    isLessonComplete,
    lastPosition,
    updateInterval,
    initializePlayer,
    cleanupPlayer,
    sendProgressToStrapi,
    iframeRef,
  ])

  // ===== ROUTE CHANGE CLEANUP =====
  useEffect(() => {
    return () => {
      if (
        playerRef.current &&
        isInitialized.current &&
        videoDuration.current &&
        !hasSentFinalProgress.current &&
        !isLessonComplete
      ) {
        try {
          playerRef.current.getCurrentTime((time) => {
            sendProgressToStrapi(time, videoDuration.current, true)
          })
        } catch (error) {
          console.error('❌ Route change save error:', error)
        }
      }
    }
  }, [pathname, isLessonComplete, sendProgressToStrapi])
}
