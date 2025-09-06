'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({
  children,
  redirectTo = '/login',
  fallback,
}: AuthGuardProps) {
  const { data: user, isLoading, error } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user && !error) {
      router.push(redirectTo)
    }
  }, [user, isLoading, error, router, redirectTo])

  if (isLoading) {
    return (
      fallback || (
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      )
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}
