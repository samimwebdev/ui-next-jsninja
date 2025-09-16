import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header Skeleton */}
          <header className="text-center space-y-4 pb-8 border-b border-border">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </header>

          {/* Main Content Skeleton */}
          <main>
            <Card className="p-8 border-border bg-card">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4">
                  <Skeleton className="h-6 w-1/2" />
                  <div className="mt-2 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </Card>
          </main>

          {/* Footer Skeleton */}
          <footer className="pt-8 border-t border-border">
            <div className="text-center">
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
