import { Skeleton } from '@/components/ui/skeleton'

export const CourseCurriculumSkeleton = () => {
  return (
    <section id="curriculum" className="my-12">
      {/* Title Skeleton */}
      <Skeleton className="h-9 w-80 mb-6" />

      {/* Accordion Skeleton */}
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((moduleIndex) => (
          <div
            key={moduleIndex}
            className="bg-accent py-1 px-4 rounded-xl border-none"
          >
            {/* Module Header Skeleton */}
            <div className="flex items-center justify-between py-4">
              <Skeleton className="h-7 w-60" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>

            {/* Module Content Skeleton */}
            <div className="pb-4">
              <div className="divide-y">
                {[1, 2, 3, 4].map((lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* Play Icon Skeleton */}
                      <Skeleton className="h-5 w-5 rounded-full" />
                      {/* Lesson Title Skeleton */}
                      <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Duration Skeleton */}
                      <Skeleton className="h-4 w-12" />
                      {/* Badge Skeleton */}
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
