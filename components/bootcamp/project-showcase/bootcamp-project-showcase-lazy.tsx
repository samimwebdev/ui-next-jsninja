'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

import { Project } from '@/types/shared-types'

// Lazy load the ProjectShowcaseClient component
const ProjectShowcaseClient = dynamic(
  () =>
    import('./bootcamp-project-showcase-client').then((mod) => ({
      default: mod.ProjectShowcaseClient,
    })),
  {
    ssr: false, // Disable SSR since it uses Masonry and has mounted state
    loading: () => <ProjectShowcaseSkeleton />,
  }
)

// Loading skeleton component that matches the masonry layout
const ProjectShowcaseSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-card rounded-lg overflow-hidden border">
        {/* Image skeleton */}
        <Skeleton className="w-full h-[200px]" />

        {/* Content skeleton */}
        <div className="p-4 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Technology badges skeleton */}
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from({ length: 3 }).map((_, badgeIndex) => (
              <Skeleton key={badgeIndex} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
)

interface EnhancedProject extends Project {
  cleanDescription: string
  features: string[]
  technologies: string[]
}

interface ProjectShowcaseLazyProps {
  projectsData: EnhancedProject[]
}

export const ProjectShowcaseLazy: React.FC<ProjectShowcaseLazyProps> = (
  props
) => {
  return <ProjectShowcaseClient {...props} />
}

// Export the skeleton separately for use in other components
export { ProjectShowcaseSkeleton }
