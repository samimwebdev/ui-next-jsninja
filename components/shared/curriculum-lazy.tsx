'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
// import { Module } from '@/types/shared-types'
import { Lesson } from '@/types/course-page-types'

// Lazy load the CurriculumClient component
const CurriculumClient = dynamic(
  () =>
    import('./curriculum-client').then((mod) => ({
      default: mod.CurriculumClient,
    })),
  {
    ssr: false, // Disable SSR since it has complex client-side interactions
    loading: () => <CurriculumSkeleton />,
  }
)

// Loading skeleton component that matches the curriculum layout
const CurriculumSkeleton = () => (
  <div className="mt-3 space-y-4">
    {/* Header stats skeleton */}
    <div className="mb-6">
      <Skeleton className="h-4 w-48" />
    </div>

    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, moduleIndex) => (
        <div
          key={moduleIndex}
          className="border border-border rounded-lg overflow-hidden bg-card shadow-sm"
        >
          {/* Module header skeleton */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 text-left flex-1">
              {/* Module number */}
              <Skeleton className="w-8 h-8 rounded-full" />

              <div className="flex-1">
                {/* Module title */}
                <Skeleton className="h-5 w-4/5 mb-2" />

                {/* Module stats */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>

            {/* Chevron icon */}
            <Skeleton className="h-4 w-4" />
          </div>

          {/* Lessons skeleton (show for first module to simulate expanded state) */}
          {moduleIndex === 0 && (
            <div className="bg-muted/20 border-t">
              {Array.from({ length: 4 }).map((_, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="flex items-center justify-between px-6 py-4 border-b border-border/50 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    {/* Lesson number */}
                    <Skeleton className="w-6 h-6 rounded-full" />

                    <div className="flex items-center gap-3">
                      {/* Video icon */}
                      <Skeleton className="h-5 w-5 rounded" />

                      <div>
                        {/* Lesson title */}
                        <Skeleton className="h-4 w-56 mb-1" />
                        {/* Lesson type */}
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Duration */}
                    <Skeleton className="h-3 w-8" />

                    {/* Badge */}
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show partial content for other modules */}
          {moduleIndex > 0 && moduleIndex < 3 && (
            <div className="bg-muted/10 border-t px-6 py-3">
              <Skeleton className="h-3 w-32" />
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Loading indicator */}
    <div className="text-center py-4">
      <Skeleton className="h-4 w-40 mx-auto" />
    </div>
  </div>
)

interface CurriculumLazyProps {
  modules: Array<{
    id: number
    documentId: string
    order: number
    duration: number
    title: string
    lessons: Lesson[]
  }>
}

export const CurriculumLazy: React.FC<CurriculumLazyProps> = (props) => {
  return <CurriculumClient {...props} />
}

// Export the skeleton separately for use in other components
export { CurriculumSkeleton }
