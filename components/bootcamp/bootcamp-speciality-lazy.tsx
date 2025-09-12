'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { StrapiIcon } from '@/types/shared-types'

// Lazy load the SpecialityClientWrapper component
const SpecialityClientWrapper = dynamic(
  () =>
    import('./bootcamp-speciality-client').then((mod) => ({
      default: mod.SpecialityClientWrapper,
    })),
  {
    ssr: false, // Disable SSR since it uses framer-motion and lenis
    loading: () => <SpecialitySkeleton />,
  }
)

// Loading skeleton component that matches the speciality layout
const SpecialitySkeleton = () => (
  <div className="w-full">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="min-h-[600px] flex items-center justify-center sticky top-0"
        style={{ top: `calc(-5vh + ${index * 25}px)` }}
      >
        <div className="flex flex-col relative -top-[25%] h-[450px] w-[90%] md:w-[80%] lg:w-[70%] rounded-xl p-6 md:p-8 lg:p-10 origin-top shadow-lg bg-gradient-to-br from-gray-400 to-gray-600">
          {/* Title skeleton */}
          <div className="mb-6">
            <Skeleton className="h-8 w-3/4 bg-white/20" />
          </div>

          <div className="flex flex-col md:flex-row h-full gap-6 md:gap-10">
            {/* Description skeleton */}
            <div className="w-full md:w-[40%] relative">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-white/20" />
                <Skeleton className="h-4 w-5/6 bg-white/20" />
                <Skeleton className="h-4 w-4/5 bg-white/20" />
                <Skeleton className="h-4 w-3/4 bg-white/20" />
              </div>
            </div>

            {/* Icon area skeleton */}
            <div className="relative w-full md:w-[60%] h-[250px] md:h-full flex items-start justify-center">
              <div className="w-full h-[80%] flex items-center justify-center">
                <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                  {/* Animated background circles */}
                  <div className="absolute w-full h-full rounded-full bg-white/5" />
                  <div className="absolute w-[80%] h-[80%] rounded-full bg-white/10" />
                  <div className="absolute w-[60%] h-[60%] rounded-full bg-white/15" />

                  {/* Center icon skeleton */}
                  <Skeleton className="relative z-10 w-32 h-32 rounded-lg bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

interface ProcessedSection {
  id: number
  title: string
  description: string
  icon: StrapiIcon | null
  defaultIconName: string
  color: string
}

interface SpecialityLazyProps {
  sections: ProcessedSection[]
}

export const SpecialityLazy: React.FC<SpecialityLazyProps> = (props) => {
  return <SpecialityClientWrapper {...props} />
}

// Export the skeleton separately for use in other components
export { SpecialitySkeleton }
