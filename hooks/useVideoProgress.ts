'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Player } from 'player.js'

interface UseVideoProgressOptions {
  lectureId: string
  userId: string
  updateInterval?: number
  completionThreshold?: number
}

export function useVideoProgress(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  {
    lectureId,
    userId,
    updateInterval = 30000,
    completionThreshold = 90,
  }: UseVideoProgressOptions
) {
  const pathname = usePathname()
  const playerRef = useRef<Player | null>(null)
  const lastReportedTime = useRef<number>(0)
  const videoDuration = useRef<number>(0)
  const isComplete = useRef<boolean>(false)
  const initializationAttempts = useRef<number>(0)
  const isInitialized = useRef<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const sendProgressToStrapi = async (
    time: number,
    duration: number,
    isFinal = false
  ) => {
    const payload = {
      lecture: lectureId,
      user: userId,
      progress: Math.round((time / duration) * 100),
      timestamp: time,
      completed: isComplete.current,
    }

    console.log('Sending progress to Strapi:', payload)

    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/lecture-progress`

    if (isFinal && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
      navigator.sendBeacon(url, blob)
    } else {
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch (error) {
        console.error('Failed to send progress:', error)
      }
    }
  }

  const cleanupPlayer = () => {
    if (playerRef.current && isInitialized.current) {
      try {
        // Check if iframe still exists before calling off()
        if (iframeRef.current && iframeRef.current.contentWindow) {
          playerRef.current.off('timeupdate')
          playerRef.current.off('ready')
          playerRef.current.off('error')
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
  }

  const initializePlayer = () => {
    if (!iframeRef?.current || playerRef.current || isInitialized.current)
      return

    try {
      // Wait for iframe to load completely
      const checkIframeLoad = () => {
        if (!iframeRef.current) return

        try {
          const player = new Player(iframeRef.current)
          playerRef.current = player
          isInitialized.current = true

          player.on('ready', () => {
            console.log('Player ready')
            if (!playerRef.current) return

            player.getDuration((d) => {
              videoDuration.current = d
              console.log('Video duration:', d)
            })
          })

          player.on('timeupdate', (data) => {
            if (!videoDuration.current || !isInitialized.current) return
            const { seconds = 0 } = data || {}
            const progressPercent = (seconds / videoDuration.current) * 100

            if (!isComplete.current && progressPercent >= completionThreshold) {
              isComplete.current = true
              sendProgressToStrapi(seconds, videoDuration.current)
            }
          })

          player.on('error', (error) => {
            console.error('Player error:', error)
          })
        } catch (error) {
          console.error('Failed to initialize player:', error)
          isInitialized.current = false

          // Retry initialization up to 3 times
          if (initializationAttempts.current < 3) {
            initializationAttempts.current++
            setTimeout(() => {
              if (iframeRef.current) {
                checkIframeLoad()
              }
            }, 2000)
          }
        }
      }

      // Wait for iframe to be ready
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
  }

  // Main effect for player initialization and progress tracking
  useEffect(() => {
    // Reset state
    initializationAttempts.current = 0
    isComplete.current = false
    lastReportedTime.current = 0
    videoDuration.current = 0

    // Wait for iframe to be available
    if (!iframeRef?.current) {
      const checkIframe = setInterval(() => {
        if (iframeRef?.current) {
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

    // Set up progress reporting interval
    intervalRef.current = setInterval(() => {
      if (
        !playerRef.current ||
        !isInitialized.current ||
        isComplete.current ||
        !videoDuration.current
      )
        return

      try {
        playerRef.current.getCurrentTime((time) => {
          if (Math.abs(time - lastReportedTime.current) >= 10) {
            sendProgressToStrapi(time, videoDuration.current)
            lastReportedTime.current = time
          }
        })
      } catch (error) {
        console.error('Error getting current time:', error)
      }
    }, updateInterval)

    // Handle tab close / refresh
    const handleBeforeUnload = () => {
      if (
        !playerRef.current ||
        !isInitialized.current ||
        !videoDuration.current
      )
        return

      try {
        playerRef.current.getCurrentTime((time) => {
          sendProgressToStrapi(time, videoDuration.current, true)
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
  }, [iframeRef, lectureId, userId, updateInterval, completionThreshold])

  // Handle route changes
  useEffect(() => {
    return () => {
      if (playerRef.current && isInitialized.current && videoDuration.current) {
        try {
          playerRef.current.getCurrentTime((time) => {
            sendProgressToStrapi(time, videoDuration.current, true)
          })
        } catch (error) {
          console.error('Error in route change cleanup:', error)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
}
