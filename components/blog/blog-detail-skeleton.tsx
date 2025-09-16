export const BlogDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="py-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-muted rounded w-12"></div>
          <div className="h-4 bg-muted rounded w-1"></div>
          <div className="h-4 bg-muted rounded w-12"></div>
          <div className="h-4 bg-muted rounded w-1"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </div>
      </div>

      {/* Hero image skeleton */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="bg-muted h-[500px]"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mt-3 bg-card shadow-lg rounded-xl">
          <div className="relative top-0 -mt-32 p-5 sm:p-10 rounded-xl">
            {/* Title skeleton */}
            <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>

            {/* Meta info skeleton */}
            <div className="flex flex-wrap gap-4 mt-6 p-6 bg-muted/20 rounded-lg">
              <div className="h-5 bg-muted rounded w-24"></div>
              <div className="h-5 bg-muted rounded w-20"></div>
              <div className="h-5 bg-muted rounded w-32"></div>
            </div>

            {/* Content skeleton */}
            <div className="mt-8 space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/5"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>

            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2 mt-8">
              <div className="h-8 bg-muted rounded-full w-16"></div>
              <div className="h-8 bg-muted rounded-full w-20"></div>
              <div className="h-8 bg-muted rounded-full w-18"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
