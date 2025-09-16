export const BlogsListSkeleton = () => {
  return (
    <div className="max-w-screen-xl mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-start gap-12 animate-pulse">
      <div className="w-full lg:w-2/3">
        <div className="flex justify-between items-center mb-8">
          <div className="h-9 bg-muted rounded w-32"></div>
        </div>

        <div className="mt-4 space-y-12">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center">
              <div className="sm:w-56 mb-4 sm:mb-0">
                <div className="aspect-video sm:aspect-square bg-muted rounded-lg"></div>
              </div>
              <div className="sm:px-6 flex-1">
                <div className="flex gap-2 mb-2">
                  <div className="h-6 bg-muted rounded-full w-20"></div>
                  <div className="h-6 bg-muted rounded-full w-16"></div>
                </div>
                <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                </div>
                <div className="flex gap-6">
                  <div className="h-5 bg-muted rounded w-20"></div>
                  <div className="h-5 bg-muted rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="lg:max-w-sm w-full lg:w-1/3">
        <div className="h-9 bg-muted rounded w-32 mb-4"></div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-md"
            >
              <div className="h-5 bg-muted-foreground/20 rounded w-20"></div>
              <div className="h-6 bg-muted-foreground/20 rounded-full w-8"></div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}