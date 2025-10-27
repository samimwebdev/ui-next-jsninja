'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react'
import type {
  CourseViewData,
  CurrentContent,
  Lesson,
  Module,
} from '@/types/course-view-types'
import { Sidebar } from '@/components/course-view/sidebar'
import {
  initializeCourseProgress,
  UserProgressResponse,
} from '@/lib/actions/user-progress'
import { trackExistingWatchedLesson } from '@/lib/actions/track-existing-watched-lesson'

interface CourseViewContextType {
  courseData: CourseViewData | null
  currentContent: CurrentContent | null
  isLoading: boolean
  error: string | null
  handleContentSelect: (moduleId: number, lesson: Lesson) => void
  modules: Module[]
  userProgress: UserProgressResponse | null
  markLessonCompleted: (lessonDocumentId: string) => void
}

const CourseViewContext = createContext<CourseViewContextType | undefined>(
  undefined
)

export const useCourse = () => {
  const context = useContext(CourseViewContext)
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseViewLayoutWrapper')
  }
  return context
}

interface CourseViewLayoutWrapperProps {
  children: ReactNode
  courseData: CourseViewData | null
  error?: string | null
}

export default function CourseViewLayoutWrapper({
  children,
  courseData,
  error = null,
}: CourseViewLayoutWrapperProps) {
  const [currentContent, setCurrentContent] = useState<CurrentContent | null>(
    null
  )
  const [userProgress, setUserProgress] = useState<UserProgressResponse | null>(
    null
  )

  // FIX: Remove caching - just track loading state
  const [loadingPosition, setLoadingPosition] = useState<boolean>(false)

  const [optimisticCompletedLessons, setOptimisticCompletedLessons] = useState<
    Set<string>
  >(new Set())

  // Initialize course progress on mount
  useEffect(() => {
    if (courseData?.documentId && !userProgress) {
      const initializeProgress = async () => {
        try {
          const progress = await initializeCourseProgress(courseData.documentId)
          setUserProgress(progress)
        } catch (error) {
          console.error('Failed to initialize course progress:', error)
        }
      }

      initializeProgress()
    }
  }, [courseData?.documentId, userProgress])

  // Optimistic update function
  const markLessonCompleted = useCallback((lessonDocumentId: string) => {
    setOptimisticCompletedLessons(
      (prev) => new Set([...prev, lessonDocumentId])
    )
  }, [])

  // FIX: Simplified fetch position function (no caching)
  const fetchLessonPosition = useCallback(
    async (
      courseId: string,
      moduleDocumentId: string,
      lessonId: string
    ): Promise<number> => {
      if (!userProgress) {
        console.info('❌ No user progress available')
        return 0
      }

      try {
        // console.log(`🔍 Fetching fresh position for lesson ${lessonId}`)

        const foundLessonLastPosition = await trackExistingWatchedLesson(
          userProgress?.user?.documentId,
          courseId,
          moduleDocumentId,
          lessonId
        )

        const position = foundLessonLastPosition || 0
        console.log(`📍 Fetched position for lesson ${lessonId}:`, position)

        return position
      } catch (error) {
        console.error(
          `❌ Error fetching position for lesson ${lessonId}:`,
          error
        )
        return 0
      }
    },
    [userProgress]
  )

  // Transform Strapi data to component format
  const modules = useMemo(() => {
    if (!courseData) return []

    const completedLessons = userProgress?.completedLessons || []

    // Combine server data with optimistic updates
    const allCompletedLessonIds = new Set([
      ...completedLessons.map((lesson) => lesson.documentId),
      ...optimisticCompletedLessons,
    ])

    return courseData.curriculum.modules.map((module): Module => {
      // Map lessons first to get completion status
      const lessons = module.lessons.map((lesson): Lesson => {
        const isCompleted = allCompletedLessonIds.has(lesson.documentId)

        // FIX: Only show lastPosition for the current lesson from currentContent
        const lastPosition =
          currentContent?.lessonId === lesson.documentId
            ? currentContent.lastPosition || 0
            : 0

        return {
          id: lesson.id,
          documentId: lesson.documentId,
          order: lesson.order,
          icon: lesson.icon || null,
          videoUrl: lesson.videoUrl || '',
          title: lesson.title,
          content: lesson.content || '',
          duration: lesson.duration,
          type: lesson.type.toLowerCase(),
          completed: isCompleted,
          isFree: lesson.isFree,
          resources: lesson.resources || [],
          assignment: lesson.assignment,
          quiz: lesson.quiz,
          videoLink: lesson.videoLink,
          lastPosition,
        }
      })

      // Calculate module completion: all lessons must be completed
      const totalLessons = lessons.length
      const completedLessonsCount = lessons.filter(
        (lesson) => lesson.completed
      ).length
      const isModuleCompleted =
        totalLessons > 0 && completedLessonsCount === totalLessons

      return {
        id: module.id,
        documentId: module.documentId,
        order: module.order,
        duration: module.duration,
        title: module.title,
        completed: isModuleCompleted,
        releaseDate: module.releaseDate,
        lessons,
      }
    })
  }, [
    courseData,
    userProgress,
    optimisticCompletedLessons,
    currentContent, // Only depend on currentContent, not cached positions
  ])

  // Set initial current content - fetch position for first lesson
  useEffect(() => {
    if (courseData && !currentContent && userProgress) {
      const firstModule = courseData.curriculum.modules[0]
      const firstLesson = firstModule?.lessons[0]

      if (firstLesson) {
        const initializeFirstLesson = async () => {
          // Fetch fresh position for first lesson
          const initialPosition = await fetchLessonPosition(
            courseData.documentId,
            firstModule.documentId,
            firstLesson.documentId
          )

          setCurrentContent({
            courseId: courseData.documentId,
            moduleId: firstModule.id,
            moduleDocumentId: firstModule.documentId,
            lessonId: firstLesson.documentId,
            title: firstLesson.title,
            duration: `${Math.floor(+firstLesson.duration / 60)}:${(
              +firstLesson.duration % 60
            )
              .toString()
              .padStart(2, '0')}`,
            type: firstLesson.type.toLowerCase() as 'video' | 'text',
            icon: firstLesson?.icon || null,
            content: firstLesson?.content || '',
            videoUrl: firstLesson?.videoUrl || '',
            resources: firstLesson?.resources || [],
            assignment: firstLesson?.assignment,
            quiz: firstLesson?.quiz,
            videoLink: firstLesson?.videoLink,
            lastPosition: initialPosition, // Use fresh fetched position
          })
        }

        initializeFirstLesson()
      }
    }
  }, [courseData, currentContent, userProgress, fetchLessonPosition])

  // FIX: Updated handleContentSelect to fetch fresh position
  const handleContentSelect = useCallback(
    async (moduleId: number, lesson: Lesson) => {
      if (!courseData || !userProgress) {
        console.log('❌ No course data or user progress available')
        return
      }

      const selectedModule = courseData.curriculum.modules.find(
        (m) => m.id === moduleId
      )
      const selectedLesson = selectedModule?.lessons.find(
        (l) => l.id === lesson.id
      )

      if (selectedLesson) {
        // console.log(`🎯 Selecting lesson: ${lesson.documentId}`)
        // Set loading state
        setLoadingPosition(true)

        try {
          // FIX: Fetch fresh position for the selected lesson
          const freshPosition = await fetchLessonPosition(
            courseData.documentId,
            selectedModule?.documentId as string,
            lesson.documentId
          )

          console.log(
            `📍 Fetched fresh position: ${freshPosition} for lesson: ${lesson.documentId}`
          )

          // Set content with fresh position
          const newContent = {
            courseId: courseData.documentId,
            moduleId,
            moduleDocumentId: selectedModule?.documentId || '',
            lessonId: lesson.documentId,
            title: selectedLesson.title,
            duration: `${Math.floor(+selectedLesson.duration / 60)}:${(
              +selectedLesson.duration % 60
            )
              .toString()
              .padStart(2, '0')}`,
            icon: selectedLesson.icon || null,
            type: selectedLesson.type.toLowerCase() as 'video' | 'text',
            content: selectedLesson?.content || '',
            videoUrl: selectedLesson?.videoUrl || '',
            resources: selectedLesson?.resources || [],
            assignment: selectedLesson?.assignment,
            quiz: selectedLesson?.quiz,
            videoLink: selectedLesson?.videoLink,
            lastPosition: freshPosition, // FIX: Use fresh fetched position
          }

          setCurrentContent(newContent)
        } catch (error) {
          console.error(
            '❌ Error fetching position during content select:',
            error
          )

          // Fallback: set content with position 0
          const newContent = {
            courseId: courseData.documentId,
            moduleId,
            moduleDocumentId: selectedModule?.documentId || '',
            lessonId: lesson.documentId,
            title: selectedLesson.title,
            duration: `${Math.floor(+selectedLesson.duration / 60)}:${(
              +selectedLesson.duration % 60
            )
              .toString()
              .padStart(2, '0')}`,
            icon: selectedLesson.icon || null,
            type: selectedLesson.type.toLowerCase() as 'video' | 'text',
            content: selectedLesson?.content || '',
            videoUrl: selectedLesson?.videoUrl || '',
            resources: selectedLesson?.resources || [],
            assignment: selectedLesson?.assignment,
            quiz: selectedLesson?.quiz,
            videoLink: selectedLesson?.videoLink,
            lastPosition: 0, // Fallback to 0
          }

          setCurrentContent(newContent)
        } finally {
          setLoadingPosition(false)
        }
      } else {
        console.log('Selected lesson not found in course data')
      }
    },
    [courseData, userProgress, fetchLessonPosition]
  )

  // Loading state - only check for courseData
  if (!courseData && !error) {
    return (
      <CourseViewContext.Provider
        value={{
          courseData: null,
          currentContent: null,
          isLoading: true,
          error: null,
          handleContentSelect: () => {},
          modules: [],
          userProgress: null,
          markLessonCompleted: () => {},
        }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading course...</div>
        </div>
        <div className="lg:block">
          <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </CourseViewContext.Provider>
    )
  }

  // Error state
  if (error) {
    return (
      <CourseViewContext.Provider
        value={{
          courseData: null,
          currentContent: null,
          isLoading: false,
          error,
          handleContentSelect: () => {},
          modules: [],
          userProgress: null,
          markLessonCompleted: () => {},
        }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
        <div className="lg:block">
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </CourseViewContext.Provider>
    )
  }

  return (
    <CourseViewContext.Provider
      value={{
        courseData,
        currentContent,
        isLoading: loadingPosition, // Show loading when fetching position
        error,
        handleContentSelect,
        modules,
        userProgress,
        markLessonCompleted,
      }}
    >
      {children}

      <Sidebar
        modules={modules}
        currentLessonId={currentContent?.lessonId || null}
        currentModuleId={currentContent?.moduleId || null}
        onLessonSelect={handleContentSelect}
        courseType={courseData?.CourseType || 'course'}
      />
    </CourseViewContext.Provider>
  )
}
