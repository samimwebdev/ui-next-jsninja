'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { StrapiIcon } from '@/types/shared-types'

// Lazy load the client component
const BootcampOverviewClient = dynamic(
  () =>
    import('./bootcamp-overview-client').then((mod) => ({
      default: mod.BootcampOverviewClient,
    })),
  {
    ssr: false, // Disable SSR for this component since it's purely interactive
    loading: () => <BootcampOverviewSkeleton />,
  }
)

// Loading skeleton component
const BootcampOverviewSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="flex flex-col h-auto bg-card dark:bg-card p-2 space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="w-full p-4 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  </Card>
)

interface ProcessedSection {
  id: number
  primaryLabel: string
  primaryLabelIcon?: StrapiIcon
  sectionKey: string
}

interface BootcampOverviewLazyProps {
  sections: ProcessedSection[]
  defaultActiveSection: string
}

export const BootcampOverviewLazy: React.FC<BootcampOverviewLazyProps> = (
  props
) => {
  return <BootcampOverviewClient {...props} />
}
