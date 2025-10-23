'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { StrapiIcon } from '@/types/shared-types'
import dynamic from 'next/dynamic'

const StepsClient = dynamic(
  () => import('./steps-client').then((mod) => ({ default: mod.StepsClient })),
  {
    ssr: false,
    loading: () => <StepsClientSkeleton />,
  }
)

export const StepsClientSkeleton = () => (
  <div className="w-full max-w-lg lg:max-w-md bg-card rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 border">
    {/* Header */}
    <div className="mb-4 sm:mb-6">
      <Skeleton className="h-6 sm:h-7 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mt-1" />
    </div>

    {/* Progress */}
    <div className="mb-4 sm:mb-6">
      <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 mb-2" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>

    {/* Step cards */}
    <div className="space-y-3 sm:space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-muted/30 rounded-lg p-3 sm:p-4 border border-border/50"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 sm:h-5 w-full mb-2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5 mt-1" />
            </div>
            <Skeleton className="w-4 h-4 flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

interface StepsLazyProps {
  secondaryHeading: string
  secondaryDescription: string
  steps: Array<{
    id: number
    title: string
    isCompleted: boolean
    details: string
    icon: StrapiIcon | null
  }>
}

export const StepsLazy: React.FC<StepsLazyProps> = (props) => {
  return <StepsClient {...props} />
}
