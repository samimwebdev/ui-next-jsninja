'use client'

import { useCourse } from '@/components/context/course-view-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CourseViewer({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { courseData, modules, isLoading } = useCourse()
  const router = useRouter()

  useEffect(() => {
    async function handleRedirect() {
      const resolvedParams = await params

      if (!isLoading && courseData && modules.length > 0) {
        // Navigate to the first lecture of the first module with moduleId
        const firstModule = modules[0]
        const firstLesson = firstModule?.lessons[0]

        if (firstLesson) {
          router.replace(
            `/course-view/${resolvedParams.slug}/modules/${firstModule.id}/lectures/${firstLesson.documentId}`
          )
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
