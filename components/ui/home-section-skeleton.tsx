import { Skeleton } from '@/components/ui/skeleton'

export const SectionSkeleton = ({
  height = 'h-96',
  showTitle = true,
  showCards = true,
  cardsCount = 3,
}) => (
  <div className={`w-full ${height} px-4 py-8`}>
    <div className="max-w-screen-xl mx-auto space-y-8">
      {showTitle && (
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-1/3 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      )}

      {showCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: cardsCount }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)

export const HeroSkeleton = () => (
  <div className="w-full h-screen px-4 py-8">
    <div className="max-w-screen-xl mx-auto h-full flex items-center justify-center">
      <div className="text-center space-y-6 w-full">
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  </div>
)

export const CarouselSkeleton = () => (
  <div className="w-full h-96 px-4 py-8">
    <div className="max-w-screen-xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="h-10 w-1/3 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)
