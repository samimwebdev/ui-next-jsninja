'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the lecture page component with no SSR
const LecturePageClient = dynamic(() => import('./lecture-page-client'), {
  ssr: false,
  loading: () => (
    <div className="relative flex flex-col">
      <div className="h-64 bg-muted animate-pulse rounded-lg mb-4"></div>
      <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
    </div>
  ),
})

export default function LecturePage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string; lectureId: string }>
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-6 py-4 sm:py-6">
      <Suspense
        fallback={
          <div className="relative flex flex-col space-y-4 sm:space-y-6">
            {/* Video Skeleton */}
            <div className="w-full aspect-video bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded-lg"></div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-wrap gap-2 px-4 sm:px-0">
              <div className="h-10 w-full sm:w-32 bg-muted animate-pulse rounded-md"></div>
              <div className="h-10 w-full sm:w-32 bg-muted animate-pulse rounded-md"></div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-4 p-4 sm:p-6 bg-card rounded-lg border mx-4 sm:mx-0">
              <div className="h-8 w-3/4 bg-muted animate-pulse rounded"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        }
      >
        <LecturePageClient params={params} />
      </Suspense>
    </div>
  )
}
