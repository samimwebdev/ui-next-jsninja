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
      const targetModule = modules.find(
        (module) => module.id.toString() === resolvedParams.moduleId
      )

      if (!targetModule) {
        const firstModule = modules[0]
        const firstLesson = firstModule?.lessons[0]
        if (firstLesson) {
          router.replace(
            `/course-view/${resolvedParams.slug}/modules/${firstModule.id}/lectures/${firstLesson.documentId}`
          )
        }
        return
      }

      const targetLesson = targetModule.lessons.find(
        (lesson) => lesson.documentId === resolvedParams.lectureId
      )

      if (targetLesson) {
        if (
          currentContent?.lessonId !== targetLesson.documentId ||
          currentContent?.moduleId !== targetModule.id
        ) {
          handleContentSelect(targetModule.id, targetLesson)
        }
      } else {
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

  const currentModule = modules.find(
    (module) => module.id === currentContent?.moduleId
  )

  // Loading state
  if (!resolvedParams || isLoading || !currentContent) {
    return (
      <div className="relative flex flex-col space-y-4 sm:space-y-6">
        {/* Video/Content Skeleton */}
        <div className="w-full aspect-video bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded-lg"></div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-wrap gap-2 px-4 sm:px-0">
          <div className="h-10 w-full sm:w-32 bg-muted animate-pulse rounded-md"></div>
          <div className="h-10 w-full sm:w-32 bg-muted animate-pulse rounded-md"></div>
          <div className="h-10 w-full sm:w-40 bg-muted animate-pulse rounded-md"></div>
        </div>

        {/* Content Area Skeleton */}
        <div className="space-y-4 p-4 sm:p-6 bg-card rounded-lg border mx-4 sm:mx-0">
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="space-y-2 pt-4">
            <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-12 bg-muted animate-pulse rounded-md"></div>
            <div className="h-12 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 px-4 sm:px-0">
          <div className="h-10 w-full sm:w-32 bg-muted animate-pulse rounded-md"></div>
          <div className="h-10 w-full sm:w-32 bg-muted animate-pulse rounded-md"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex flex-col p-4 sm:p-6">
        <div className="text-center text-red-500 p-6 sm:p-8 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="font-semibold mb-2 text-sm sm:text-base">
            Error Loading Course Content
          </p>
          <p className="text-xs sm:text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // No data state
  if (!courseData) {
    return (
      <div className="relative flex flex-col p-4 sm:p-6">
        <div className="text-center p-6 sm:p-8 bg-muted/50 rounded-lg border">
          <p className="text-sm sm:text-base text-muted-foreground">
            No course content available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col space-y-4 sm:space-y-6">
      {/* Render appropriate content based on type */}
      {currentContent.type === 'video' ? (
        <VideoPlayer currentContent={currentContent} />
      ) : (
        <TextContent currentContent={currentContent} />
      )}

      {/* Action buttons for video lessons only */}
      {currentContent.type === 'video' && currentContent?.videoLink && (
        <div className="px-4 sm:px-0">
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
        </div>
      )}

      {/* Lesson Content */}
      <LessonContent
        currentContent={currentContent}
        resources={currentContent?.resources || []}
        courseSlug={resolvedParams.slug}
        quiz={currentContent?.quiz || null}
        assignment={currentContent?.assignment}
        moduleDocumentId={currentModule?.documentId || ''}
      />

      {/* Navigation Buttons */}
      <div className="px-4 sm:px-0">
        <LessonNavigation
          modules={modules}
          currentModuleId={currentContent.moduleId}
          currentLessonId={currentContent.lessonId}
          onLessonSelect={handleContentSelect}
          slug={resolvedParams.slug}
        />
      </div>
    </div>
  )
}
