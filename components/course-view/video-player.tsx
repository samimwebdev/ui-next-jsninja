'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useVideoProgress } from '@/hooks/useVideoProgress'
import { CurrentContent } from '@/types/course-view-types'
import { useCourse } from '@/components/context/course-view-provider'
import { CheckCircle } from 'lucide-react'

// Define a proper type for video content
interface VideoContent {
  type: 'direct' | 'iframe'
  src: string
  title?: string
  allow?: string
  style?: string
}

// Detect video source type from iframe HTML or URL
const getVideoSourceType = (
  videoUrl: string
):
  | 'youtube'
  | 'vimeo'
  | 'bunny'
  | 'gumlet'
  | 'direct'
  | 'iframe'
  | 'unknown' => {
  if (!videoUrl) return 'unknown'

  // Check if it's an iframe HTML
  if (videoUrl.includes('<iframe')) {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))
      return 'youtube'
    if (videoUrl.includes('vimeo.com')) return 'vimeo'
    if (
      videoUrl.includes('mediadelivery.net') ||
      videoUrl.includes('bunnycdn.com')
    )
      return 'bunny'
    if (videoUrl.includes('gumlet.io')) return 'gumlet'
    return 'iframe' // Generic iframe
  }

  // Check if it's a direct URL
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))
    return 'youtube'
  if (videoUrl.includes('vimeo.com')) return 'vimeo'
  if (
    videoUrl.includes('mediadelivery.net') ||
    videoUrl.includes('bunnycdn.com')
  )
    return 'bunny'
  if (videoUrl.includes('gumlet.io')) return 'gumlet'
  if (
    videoUrl.includes('.mp4') ||
    videoUrl.includes('.webm') ||
    videoUrl.includes('.ogg')
  )
    return 'direct'

  return 'unknown'
}

const extractIframeProps = (iframeHtml: string) => {
  const srcMatch = iframeHtml.match(/src\s*=\s*["']([^"']+)["']/i)
  const titleMatch = iframeHtml.match(/title\s*=\s*["']([^"']+)["']/i)
  const allowMatch = iframeHtml.match(/allow\s*=\s*["']([^"']+)["']/i)
  const styleMatch = iframeHtml.match(/style\s*=\s*["']([^"']+)["']/i)

  return {
    src: srcMatch?.[1],
    title: titleMatch?.[1] || 'Video Player',
    allow:
      allowMatch?.[1] ||
      'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;',
    style: styleMatch?.[1],
  }
}

export const VideoPlayer = ({
  currentContent,
}: {
  currentContent: CurrentContent
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { courseData, modules, markLessonCompleted } = useCourse()
  const [isVideoCompleted, setIsVideoCompleted] = useState(false)

  // Find current module and lesson for progress tracking
  const currentModule = modules.find((m) => m.id === currentContent.moduleId)
  const currentLesson = currentModule?.lessons.find(
    (l) => l.documentId === currentContent.lessonId
  )
  console.log({ currentLesson })

  // Check if lesson is already completed
  const isLessonAlreadyCompleted = currentLesson?.completed || false

  // Count completed lessons in current module (excluding current lesson)
  const completedLessonsInModule =
    currentModule?.lessons.filter(
      (l) => l.completed && l.documentId !== currentContent.lessonId
    ).length || 0

  const videoContent = useMemo((): VideoContent => {
    const url = currentContent?.videoUrl || ''
    const type = getVideoSourceType(url)

    if (type === 'direct') {
      return {
        type: 'direct',
        src: url,
        title: 'Video Player',
        allow:
          'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;',
        style: undefined,
      }
    }

    if (url.includes('<iframe')) {
      const props = extractIframeProps(url)
      return {
        type: 'iframe',
        src: props.src || '',
        title: props.title,
        allow: props.allow,
        style: props.style,
      }
    }

    return {
      type: 'iframe',
      src: url,
      title: 'Video Player',
      allow:
        'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;',
      style: undefined,
    }
  }, [currentContent])

  // Custom completion handler for video progress hook
  const handleVideoCompletion = (lessonDocumentId: string) => {
    console.log('🎥 Video lesson completed via progress tracking')
    setIsVideoCompleted(true)

    // Call the original markLessonCompleted function
    markLessonCompleted(lessonDocumentId)
  }

  // Use video progress hook
  useVideoProgress(iframeRef, {
    lectureId: String(currentContent.lessonId ?? ''),
    courseDocumentId: courseData?.documentId || '',
    moduleDocumentId: currentModule?.documentId || '',
    lessonDocumentId: currentLesson?.documentId || '',
    updateInterval: 15000,
    completionThreshold: 95,
    totalModuleLessons: currentModule?.lessons.length || 0,
    completedModuleLessons: completedLessonsInModule,
    onLessonCompleted: handleVideoCompletion,
    isLessonComplete: isLessonAlreadyCompleted,
    lastPosition: currentLesson?.lastPosition || 0,
  })

  // Update local completion state when lesson completion changes from external source
  useEffect(() => {
    if (isLessonAlreadyCompleted && !isVideoCompleted) {
      setIsVideoCompleted(true)
    }
  }, [isLessonAlreadyCompleted, isVideoCompleted])

  // Final completion status
  const isFinallyCompleted = isLessonAlreadyCompleted || isVideoCompleted

  if (!videoContent.src) {
    return (
      <div className="flex items-center justify-center aspect-video bg-muted rounded-lg mb-6">
        <div className="text-center">
          <p className="text-muted-foreground">No video source available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      {videoContent.type === 'direct' ? (
        <video
          className="w-full aspect-video rounded-lg bg-black"
          controls
          playsInline
        >
          <source src={videoContent.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div style={{ position: 'relative', aspectRatio: '16/9' }}>
          <iframe
            ref={iframeRef}
            loading="lazy"
            src={videoContent.src}
            title={videoContent.title}
            style={{
              border: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              ...(videoContent.style
                ? parseInlineStyle(videoContent.style)
                : {}),
            }}
            allow={videoContent.allow}
            allowFullScreen
          />
        </div>
      )}

      {/* Show completion indicator for completed video lessons */}
      {isFinallyCompleted && (
        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Video Lesson Completed
              {isVideoCompleted && !isLessonAlreadyCompleted && (
                <span className="ml-2 text-xs opacity-75">
                  (Just completed!)
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper to parse inline CSS string to object with proper typing
function parseInlineStyle(
  styleString: string
): Record<string, string | number> {
  const styles: Record<string, string | number> = {}

  styleString.split(';').forEach((rule) => {
    const [property, value] = rule.split(':').map((s) => s.trim())
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      )

      // Handle numeric values
      const numericValue = parseFloat(value)
      if (!isNaN(numericValue) && value.match(/^\d+(\.\d+)?(px|em|rem|%)?$/)) {
        styles[camelCaseProperty] = value
      } else {
        styles[camelCaseProperty] = value
      }
    }
  })

  return styles
}
