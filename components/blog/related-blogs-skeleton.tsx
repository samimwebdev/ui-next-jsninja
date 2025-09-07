export const RelatedBlogsSkeleton = () => {
  return (
    <div className="py-16 animate-pulse">
      <div className="h-8 bg-muted rounded w-48 mx-auto mb-10"></div>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border overflow-hidden"
          >
            <div className="h-48 bg-muted"></div>
            <div className="p-4 space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded-full w-16"></div>
                <div className="h-6 bg-muted rounded-full w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
