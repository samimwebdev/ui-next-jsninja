'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { Play } from 'lucide-react'
import { DemoVideosLayoutContentSection } from '@/types/bootcamp-page-types'

// Lazy load the PromoVideos component
const PromoVideos = dynamic(
  () => import('./index').then((mod) => ({ default: mod.PromoVideos })),
  {
    ssr: false, // Disable SSR since it uses video provider context
    loading: () => <PromoVideosSkeleton />,
  }
)

// Loading skeleton component that matches the promo videos layout
const PromoVideosSkeleton = () => (
  <section className="relative flex flex-col items-center px-4 py-16 bg-background text-foreground overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 dark:opacity-10"></div>

    <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
      {/* Header skeleton */}
      <div className="mb-16 text-center">
        <Skeleton className="h-12 w-[500px] mx-auto mb-6" />
        <Skeleton className="h-5 w-[700px] mx-auto" />
      </div>

      {/* Larger video grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="group">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-2xl">
              {/* Video thumbnail skeleton */}
              <Skeleton className="w-full h-full" />

              {/* Play button overlay skeleton - larger */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Play className="w-12 h-12 text-white/60" />
                </div>
              </div>

              {/* Content overlay skeleton - larger padding */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <Skeleton className="h-7 w-4/5 mb-3 bg-white/20" />
                <Skeleton className="h-5 w-full bg-white/15" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

interface PromoVideosLazyProps {
  data: DemoVideosLayoutContentSection
}

export const PromoVideosLazy: React.FC<PromoVideosLazyProps> = (props) => {
  return <PromoVideos {...props} />
}

// Export the skeleton separately for use in other components
export { PromoVideosSkeleton }
