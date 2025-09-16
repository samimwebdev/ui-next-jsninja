'use client'

import * as React from 'react'
import { ActionButtons } from '@/components/course-view/action-buttons'
import { LessonContent } from '@/components/course-view/lesson-content'
import { LessonNavigation } from '@/components/course-view/lesson-navigation'
import { TextContent } from '@/components/course-view/text-content'
import { VideoPlayer } from '@/components/course-view/video-player'
import { useCourse } from '@/components/context/course-view-provider'
import { CopyrightIcon, PersonStanding, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LecturePage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string; lectureId: string }>
}) {
  const {
    courseData,
    currentContent,
    isLoading,
    error,
    modules,
    handleContentSelect,
  } = useCourse()

  const router = useRouter()
  const [resolvedParams, setResolvedParams] = React.useState<{
    slug: string
    moduleId: string
    lectureId: string
  } | null>(null)

  // Resolve params first
  useEffect(() => {
    async function resolveParams() {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  // Set current content based on moduleId and lectureId from URL
  useEffect(() => {
    if (
      !isLoading &&
      courseData &&
      modules.length > 0 &&
      resolvedParams?.moduleId &&
      resolvedParams?.lectureId
    ) {
      // Find the specific module first
      const targetModule = modules.find(
        (module) => module.id.toString() === resolvedParams.moduleId
      )

      if (!targetModule) {
        console.log('LecturePage: Module not found, redirecting to first')
        const firstModule = modules[0]
        const firstLesson = firstModule?.lessons[0]
        if (firstLesson) {
          router.replace(
            `/course-view/${resolvedParams.slug}/modules/${firstModule.id}/lectures/${firstLesson.documentId}`
          )
        }
        return
      }

      // Find the lesson within the specific module
      const targetLesson = targetModule.lessons.find(
        (lesson) => lesson.documentId === resolvedParams.lectureId
      )

      if (targetLesson) {
        // Only update if it's different from current content
        if (
          currentContent?.lessonId !== targetLesson.documentId ||
          currentContent?.moduleId !== targetModule.id
        ) {
          handleContentSelect(targetModule.id, targetLesson)
        }
      } else {
        console.log(
          'LecturePage: Lesson not found in target module, redirecting'
        )
        // If lesson not found in the specific module, redirect to first lesson of that module
        const firstLesson = targetModule.lessons[0]
        if (firstLesson) {
          router.replace(
            `/course-view/${resolvedParams.slug}/modules/${targetModule.id}/lectures/${firstLesson.documentId}`
          )
        }
      }
    }
  }, [
    isLoading,
    courseData,
    modules,
    resolvedParams?.moduleId,
    resolvedParams?.lectureId,
    resolvedParams?.slug,
    handleContentSelect,
    router,
    currentContent?.lessonId,
    currentContent?.moduleId,
  ])

  // Get current module for document ID
  const currentModule = modules.find(
    (module) => module.id === currentContent?.moduleId
  )

  if (!resolvedParams) {
    return (
      <div className="relative flex flex-col">
        <div className="h-64 bg-muted animate-pulse rounded-lg mb-4"></div>
        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="relative flex flex-col">
        <div className="h-64 bg-muted animate-pulse rounded-lg mb-4"></div>
        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative flex flex-col">
        <div className="text-center text-red-500 p-8">
          <p>Error loading course content: {error}</p>
        </div>
      </div>
    )
  }

  if (!courseData || !currentContent) {
    return (
      <div className="relative flex flex-col">
        <div className="text-center p-8">
          <p>No course content available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col">
      {/* Render appropriate content based on type */}
      {currentContent.type === 'video' ? (
        <VideoPlayer currentContent={currentContent} />
      ) : (
        <TextContent currentContent={currentContent} />
      )}

      {/* Action buttons for video lessons only */}
      {currentContent.type === 'video' && currentContent?.videoLink && (
        <ActionButtons
          actionButtons={[
            {
              label: 'VideoPlay Issue',
              active: !!currentContent.videoLink.videoNotPlayed,
              content: currentContent.videoLink.videoNotPlayed,
              icon: Video,
            },
            {
              label: 'Piracy Notice',
              active: !!currentContent.videoLink?.piracyNotice,
              content: currentContent.videoLink?.piracyNotice || '',
              icon: CopyrightIcon,
            },
            {
              label: 'Community Support',
              active: !!currentContent.videoLink?.community,
              content: currentContent.videoLink?.community,
              icon: PersonStanding,
            },
          ]}
        />
      )}

      {/* Lesson Content - No token prop needed */}
      <LessonContent
        currentContent={currentContent}
        resources={currentContent?.resources || []}
        courseSlug={resolvedParams.slug}
        quiz={currentContent?.quiz || null}
        assignment={currentContent?.assignment}
        moduleDocumentId={currentModule?.documentId || ''}
      />

      {/* Navigation Buttons */}
      <LessonNavigation
        modules={modules}
        currentModuleId={currentContent.moduleId}
        currentLessonId={currentContent.lessonId}
        onLessonSelect={handleContentSelect}
        slug={resolvedParams.slug}
      />
    </div>
  )
}
