'use client'

import { useCourse } from '@/components/context/course-view-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ModulePage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string }>
}) {
  const { courseData, modules, isLoading } = useCourse()
  const router = useRouter()

  useEffect(() => {
    async function handleRedirect() {
      const resolvedParams = await params

      if (!isLoading && courseData && modules.length > 0) {
        console.log('ModulePage: Looking for module:', resolvedParams.moduleId)

        // Find the specific module
        const targetModule = modules.find(
          (module) => module.id.toString() === resolvedParams.moduleId
        )

        if (targetModule && targetModule.lessons.length > 0) {
          // Navigate to the first lecture of this specific module
          const firstLesson = targetModule.lessons[0]

          console.log('ModulePage: Redirecting to first lesson:', {
            module: targetModule.title,
            lesson: firstLesson.title,
            moduleId: targetModule.id,
            lectureId: firstLesson.documentId,
          })

          router.replace(
            `/course-view/${resolvedParams.slug}/modules/${resolvedParams.moduleId}/lectures/${firstLesson.documentId}`
          )
        } else {
          console.log(
            'ModulePage: Module not found or has no lessons, redirecting to course'
          )
          // If module not found or has no lessons, redirect to main course page
          router.replace(`/course-view/${resolvedParams.slug}`)
        }
      }
    }

    handleRedirect()
  }, [isLoading, courseData, modules, router, params])

  if (isLoading) {
    return (
      <div className="relative flex flex-col">
        <div className="h-64 bg-muted animate-pulse rounded-lg mb-4"></div>
        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
      </div>
    )
  }

  // Show loading state while redirecting
  return (
    <div className="relative flex flex-col">
      <div className="h-64 bg-muted animate-pulse rounded-lg mb-4"></div>
      <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
    </div>
  )
}
