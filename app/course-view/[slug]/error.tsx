'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function CourseViewError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Course view error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          {error.message || 'Failed to load course content'}
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
