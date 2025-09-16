'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StepSection } from '@/types/bootcamp-page-types'

// Lazy load the StepsClient component
const StepsClient = dynamic(
  () => import('./steps-client').then((mod) => ({ default: mod.StepsClient })),
  {
    ssr: false, // Disable SSR since it has interactive state
    loading: () => <StepsClientSkeleton />,
  }
)

// Loading skeleton component that matches the StepsClient layout
const StepsClientSkeleton = () => (
  <Card className="w-full mx-auto">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Progress bar skeleton */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-8" />
        <div className="flex-1 h-1 bg-muted rounded-full">
          <Skeleton className="h-full w-1/3 rounded-full" />
        </div>
      </div>

      {/* Steps skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

interface StepsLazyProps {
  secondaryHeading: string
  secondaryDescription: string
  steps: StepSection[]
}

export const StepsLazy: React.FC<StepsLazyProps> = (props) => {
  return <StepsClient {...props} />
}

// Export the skeleton separately for use in other components
export { StepsClientSkeleton }
