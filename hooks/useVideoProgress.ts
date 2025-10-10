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
  updateInterval?: number
  completionThreshold?: number
  totalModuleLessons?: number
  completedModuleLessons?: number
  onLessonCompleted?: (lessonDocumentId: string) => void
  isLessonComplete?: boolean
  lastPosition?: number // Last watched position in seconds
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
    lastPosition = 0,
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
  const isPlaying = useRef<boolean>(false)
  const totalWatchTime = useRef<number>(0)
  const lastPlayTime = useRef<number | null>(null)

  // FIX: Track current lesson to detect changes - move this to the top
  const currentLessonRef = useRef<string>(lessonDocumentId)
  const hasSeekToLastPosition = useRef<boolean>(false)
  const seekAttempted = useRef<boolean>(false)

  // FIX: Reset seek state IMMEDIATELY when lesson or position changes
  useEffect(() => {
    const lessonChanged = currentLessonRef.current !== lessonDocumentId

    if (lessonChanged) {
      currentLessonRef.current = lessonDocumentId
    }

    // FIX: Reset seek state for new lesson OR new position
    if (lessonChanged || lastPosition > 0) {
      // console.log(
      //   `🔄 Resetting seek state - lesson changed: ${lessonChanged}, lastPosition: ${lastPosition}`
      // )
      hasSeekToLastPosition.current = false
      seekAttempted.current = false // ← This is the key fix!
    }
  }, [lessonDocumentId, lastPosition]) // Run when either changes

  // FIX: Simplified seek function without redundant checks
  const seekToLastPosition = useCallback(() => {
    // console.log('🔍 Seek attempt:', {
    //   lessonId: lessonDocumentId,
    //   lastPosition,
    //   hasPlayer: !!playerRef.current,
    //   isInitialized: isInitialized.current,
    //   hasSeekToLastPosition: hasSeekToLastPosition.current,
    //   seekAttempted: seekAttempted.current,
    //   isLessonComplete,
    // })

    if (
      !playerRef.current ||
      !isInitialized.current ||
      hasSeekToLastPosition.current || // Only check if already successfully seeked
      !lastPosition ||
      lastPosition <= 0 ||
      isLessonComplete
    ) {
      console.log('🚫 Skipping seek - conditions not met')
      return
    }

    // FIX: Don't check seekAttempted here - just try to seek
    // console.log(
    //   `🎯 Seeking to last position: ${lastPosition} seconds for lesson: ${lessonDocumentId}`
    // )

    try {
      playerRef.current.setCurrentTime(lastPosition, (error) => {
        if (error) {
          console.error('❌ Error seeking to last position:', error)
        } else {
          // console.log(
          //   `✅ Successfully seeked to ${lastPosition} seconds for lesson: ${lessonDocumentId}`
          // )
          hasSeekToLastPosition.current = true // Only set on success
          lastReportedTime.current = lastPosition
        }
      })
    } catch (error) {
      console.error('❌ Failed to seek to last position:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPosition, isLessonComplete, lessonDocumentId])

  const sendProgressToStrapi = useCallback(
    async (
      time: number,
      duration: number,
      isFinal = false,
      isVideoEnd = false
    ) => {
      if (isLessonComplete) return

      try {
        if (isPlaying.current && lastPlayTime.current !== null) {
          const now = Date.now()
          const delta = (now - lastPlayTime.current) / 1000
          totalWatchTime.current += delta
          lastPlayTime.current = now
        }

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
          startedAt: new Date().toISOString(),
          lastPosition: Math.floor(time),
          timeSpent: Math.floor(totalWatchTime.current),
          lessonStatus,
          isModuleCompleted: willCompleteModule,
        }

        await updateLessonProgress(
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

        console.info('✅ Video progress sent successfully')
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
          playerRef.current.off('play')
          playerRef.current.off('pause')
        }
      } catch (error) {
        console.error('Error cleaning up player events:', error)
      }

      playerRef.current = null
      isInitialized.current = false
      isPlaying.current = false
      lastPlayTime.current = 0
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (iframeRef.current) {
      iframeRef.current.onload = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initializePlayer = useCallback(() => {
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

              // FIX: Always try to seek if we have a valid position
              if (lastPosition > 0 && lastPosition < d) {
                console.log(
                  `📍 Valid position found: ${lastPosition}s, seeking...`
                )
                setTimeout(() => {
                  seekToLastPosition()
                }, 1500)
              } else if (lastPosition >= d) {
                console.log(
                  `⚠️ Position ${lastPosition}s exceeds duration ${d}s, starting from beginning`
                )
              } else {
                console.log(
                  `🆕 No previous position (${lastPosition}), starting from beginning`
                )
              }
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

          player.on('play', () => {
            isPlaying.current = true
            lastPlayTime.current = Date.now()
          })

          player.on('pause', () => {
            if (lastPlayTime.current !== null) {
              const now = Date.now()
              totalWatchTime.current += (now - lastPlayTime.current) / 1000
            }
            isPlaying.current = false
            lastPlayTime.current = null
          })

          player.on('ended', () => {
            console.log('🏁 Video ended')
            isPlaying.current = false
            lastPlayTime.current = null
            if (
              !videoEnded.current &&
              !finalProgressSent.current &&
              !isLessonComplete &&
              videoDuration.current > 0
            ) {
              videoEnded.current = true
              console.log(
                '📹 Sending final video completion with full duration:',
                videoDuration.current
              )

              sendProgressToStrapi(
                videoDuration.current,
                videoDuration.current,
                true,
                true
              )
            }
          })

          player.on('error', (error) => {
            console.error('🚨 Player error:', error)
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
    // exhaustive deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLessonComplete, seekToLastPosition, lessonDocumentId, lastPosition])

  // FIX: Main effect - simplified state reset
  useEffect(() => {
    if (isLessonComplete) {
      console.log(
        '🎥 Video lesson already completed - skipping progress tracking'
      )
      return
    }

    // console.log(`📍 Starting with last position: ${lastPosition} seconds`)

    // Reset ALL progress tracking state
    initializationAttempts.current = 0
    isComplete.current = false
    completionSent.current = false
    thresholdReached.current = false
    videoEnded.current = false
    finalProgressSent.current = false
    lastReportedTime.current = 0
    videoDuration.current = 0
    totalWatchTime.current = 0
    isPlaying.current = false
    lastPlayTime.current = null

    // FIX: Seek state is already reset in the earlier useEffect

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    lastPosition, // FIX: Add lastPosition as dependency
    sendProgressToStrapi,
    initializePlayer,
    cleanupPlayer,
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
  }, [pathname, isLessonComplete, sendProgressToStrapi])
}
