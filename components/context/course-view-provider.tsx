'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
} from 'react'
import type {
  CourseViewData,
  CurrentContent,
  Lesson,
  Module,
} from '@/types/course-view-types'
import { Sidebar } from '@/components/course-view/sidebar'

interface CourseViewContextType {
  courseData: CourseViewData | null
  currentContent: CurrentContent | null
  isLoading: boolean
  error: string | null
  handleContentSelect: (moduleId: number, lesson: Lesson) => void
  modules: Module[]
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

  // Transform Strapi data to component format
  const modules = useMemo(() => {
    if (!courseData) return []

    return courseData.curriculum.modules.map(
      (module): Module => ({
        id: module.id,
        documentId: module.documentId,
        order: module.order,
        duration: module.duration,
        title: module.title,
        completed: false, // Calculate based on userProgress
        lessons: module.lessons.map((lesson): Lesson => {
          const isCompleted = courseData.userProgress.completedLessons.some(
            (completedLesson) =>
              completedLesson.documentId === lesson.documentId
          )

          return {
            id: lesson.id,
            documentId: lesson.documentId,
            order: lesson.order,
            icon: lesson.icon || null,
            videoUrl: lesson.videoUrl || '',
            title: lesson.title,
            content: lesson.content || '',
            // Now lesson.duration is guaranteed to be a number
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
        }),
      })
    )
  }, [courseData])

  // Set initial current content - use useEffect instead of useState
  useEffect(() => {
    if (courseData && !currentContent) {
      const firstModule = courseData.curriculum.modules[0]
      const firstLesson = firstModule?.lessons[0] // This is a StrapiLesson

      if (firstLesson) {
        setCurrentContent({
          courseId: courseData.documentId,
          moduleId: firstModule.id,
          lessonId: firstLesson.id,
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

  // Update the handleContentSelect function to NOT navigate automatically:
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
        lessonId: lesson.id,
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

  // Loading state
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
