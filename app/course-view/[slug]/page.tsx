'use client'

import * as React from 'react'
import { ActionButtons } from '@/components/course-view/action-buttons'
import { LessonContent } from '@/components/course-view/lesson-content'
import { LessonNavigation } from '@/components/course-view/lesson-navigation'
import { Sidebar } from '@/components/course-view/sidebar'
import { TextContent } from '@/components/course-view/text-content'
import { VideoPlayer } from '@/components/course-view/video-player'
import type {
  CurrentContent,
  Lesson,
  Module,
} from '@/components/course-view/types/course'

import {
  actionButtons,
  assignment,
  initialModules,
  quizQuestions,
  resources,
  videoDescription,
} from '@/data/course-data'

export default function CourseViewer() {
  const [currentContent, setCurrentContent] = React.useState<CurrentContent>({
    moduleId: 'm2',
    lessonId: '2.1',
    title: '2.1 Responding to Events - Adding Event Handlers',
    description: 'Learn how to handle events in React components effectively.',
    type: 'video',
  })
  const [modules, setModules] = React.useState<Module[]>(initialModules)

  const handleContentSelect = (moduleId: string, lesson: Lesson) => {
    setCurrentContent({
      moduleId,
      lessonId: lesson.id,
      title: lesson.title,
      description: `Duration: ${lesson.duration}`,
      type: lesson.type,
    })

    // Check if all lessons in the module are completed
    const currentModule = modules.find((m) => m.id === moduleId)
    if (currentModule && currentModule.lessons.every((l) => l.completed)) {
      // Update module completion status
      const updatedModules = modules.map((m) =>
        m.id === moduleId ? { ...m, completed: true } : m
      )
      // Update modules state
      setModules(updatedModules)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] lg:gap-6">
        {/* Content Section */}
        <div className="relative flex flex-col">
          {currentContent.type === 'video' ? (
            <VideoPlayer currentContent={currentContent} />
          ) : (
            <TextContent currentContent={currentContent} />
          )}

          {/* Action Buttons */}
          <ActionButtons actionButtons={actionButtons} />

          {/* Lesson Content */}
          <LessonContent
            currentContent={currentContent}
            videoDescription={videoDescription}
            resources={resources}
            quizQuestions={quizQuestions}
            assignment={assignment}
          />

          {/* Navigation Buttons */}
          <LessonNavigation
            modules={modules}
            currentModuleId={currentContent.moduleId}
            currentLessonId={currentContent.lessonId}
            onLessonSelect={handleContentSelect}
          />
        </div>

        {/* Sidebar */}
        <Sidebar
          modules={modules}
          currentLessonId={currentContent.lessonId}
          onLessonSelect={handleContentSelect}
        />
      </div>
    </div>
  )
}
