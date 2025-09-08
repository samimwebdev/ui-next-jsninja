import { Skeleton } from '@/components/ui/skeleton'

export function CheckoutPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-screen-xl">
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div className="text-center space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
