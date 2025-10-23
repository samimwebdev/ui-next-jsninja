'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
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
    <div className="mb-4 sm:mb-6">
      <Skeleton className="h-4 w-32 sm:w-48" />
    </div>

    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, moduleIndex) => (
        <div
          key={moduleIndex}
          className="border border-border rounded-lg overflow-hidden bg-card shadow-sm"
        >
          {/* Module header skeleton */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4 text-left flex-1 min-w-0">
              {/* Module number */}
              <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0" />

              <div className="flex-1 min-w-0">
                {/* Module title */}
                <Skeleton className="h-4 sm:h-5 w-4/5 mb-2" />

                {/* Module stats */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <Skeleton className="h-3 w-12 sm:w-16" />
                  <Skeleton className="h-3 w-10 sm:w-12" />
                  <Skeleton className="h-3 w-10 sm:w-12" />
                </div>
              </div>
            </div>

            {/* Chevron icon */}
            <Skeleton className="h-4 w-4 flex-shrink-0" />
          </div>

          {/* Lessons skeleton (show for first module) */}
          {moduleIndex === 0 && (
            <div className="bg-muted/20 border-t">
              {Array.from({ length: 4 }).map((_, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50 last:border-b-0"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {/* Lesson number */}
                    <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0" />

                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {/* Video icon */}
                      <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded flex-shrink-0" />

                      <div className="min-w-0 flex-1">
                        {/* Lesson title */}
                        <Skeleton className="h-3 sm:h-4 w-full max-w-[200px] sm:max-w-[300px] mb-1" />
                        {/* Lesson type */}
                        <Skeleton className="h-2 sm:h-3 w-16 sm:w-20" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {/* Duration */}
                    <Skeleton className="h-3 w-6 sm:w-8" />

                    {/* Badge */}
                    <Skeleton className="h-5 w-16 sm:h-6 sm:w-20 rounded-full hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show partial content for other modules */}
          {moduleIndex > 0 && moduleIndex < 3 && (
            <div className="bg-muted/10 border-t px-4 sm:px-6 py-2 sm:py-3">
              <Skeleton className="h-3 w-24 sm:w-32" />
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Loading indicator */}
    <div className="text-center py-4">
      <Skeleton className="h-4 w-32 sm:w-40 mx-auto" />
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
    releaseDate: Date | null
  }>
}

export const CurriculumLazy: React.FC<CurriculumLazyProps> = (props) => {
  return <CurriculumClient {...props} />
}

// Export the skeleton separately for use in other components
export { CurriculumSkeleton }
