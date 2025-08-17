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
import { UserProgressResponse, UserProgressService } from '@/lib/user-progress'
import { getAuthToken } from '@/lib/auth'

interface CourseViewContextType {
  courseData: CourseViewData | null
  currentContent: CurrentContent | null
  isLoading: boolean
  error: string | null
  handleContentSelect: (moduleId: number, lesson: Lesson) => void
  modules: Module[]
  userProgress: UserProgressResponse | null
  markLessonCompleted: (lessonDocumentId: string) => void // Add optimistic update function
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
  // Add state for optimistic updates
  const [optimisticCompletedLessons, setOptimisticCompletedLessons] = useState<
    Set<string>
  >(new Set())

  // Initialize course progress on mount
  useEffect(() => {
    if (courseData?.documentId && !userProgress) {
      const initializeProgress = async () => {
        try {
          const token = await getAuthToken()
          const progress = await UserProgressService.initializeCourseProgress(
            courseData.documentId,
            token ? token : undefined
          )
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

  // Transform Strapi data to component format - Don't depend on userProgress being available
  const modules = useMemo(() => {
    if (!courseData) return []

    // Get completed lessons from userProgress if available, otherwise empty array
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

        return {
          id: lesson.id,
          documentId: lesson.documentId,
          order: lesson.order,
          icon: lesson.icon || null,
          videoUrl: lesson.videoUrl || '',
          title: lesson.title,
          content: lesson.content || '',
          duration: `${Math.floor(+lesson.duration / 60)}:${(
            +lesson.duration % 60
          )
            .toString()
            .padStart(2, '0')}`,
          type: lesson.type.toLowerCase(),
          completed: isCompleted,
          isFree: lesson.isFree,
          resources: lesson.resources || [],
          assignment: lesson.assignment,
          quiz: lesson.quiz,
          videoLink: lesson.videoLink,
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
        lessons,
      }
    })
  }, [courseData, userProgress, optimisticCompletedLessons]) // Add optimisticCompletedLessons to dependencies

  // Set initial current content - use useEffect instead of useState
  useEffect(() => {
    if (courseData && !currentContent) {
      const firstModule = courseData.curriculum.modules[0]
      const firstLesson = firstModule?.lessons[0] // This is a StrapiLesson

      if (firstLesson) {
        setCurrentContent({
          courseId: courseData.documentId,
          moduleId: firstModule.id,
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
        })
      }
    }
  }, [courseData, currentContent])

  // Update the handleContentSelect function
  const handleContentSelect = (moduleId: number, lesson: Lesson) => {
    if (!courseData) {
      console.log('No course data available')
      return
    }

    const selectedModule = courseData.curriculum.modules.find(
      (m) => m.id === moduleId
    )
    const selectedLesson = selectedModule?.lessons.find(
      (l) => l.id === lesson.id
    )

    if (selectedLesson) {
      const newContent = {
        courseId: courseData.documentId,
        moduleId,
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
      }

      setCurrentContent(newContent)
    } else {
      console.log('Selected lesson not found in course data')
    }
  }

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
        isLoading: false,
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
      />
    </CourseViewContext.Provider>
  )
}
