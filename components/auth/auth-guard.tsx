'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const { data: user, isLoading } = useCurrentUser()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    console.log(
      user,
      isLoading,
      user,
      hasRedirected,
      'AuthGuard: User is authenticated'
    )
    if (!isLoading && !user && !hasRedirected) {
      setHasRedirected(true)
      // Preserve current URL for redirect after login
      const currentUrl = window.location.pathname + window.location.search
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(
        currentUrl
      )}`
      console.log(
        'AuthGuard: Redirecting to login with redirect URL:',
        loginUrl
      )
      router.push(loginUrl)
    }
  }, [user, isLoading, router, redirectTo, hasRedirected])

  // Show loading while checking authentication or during redirect
  if (isLoading || !user) {
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

  // Don't render children if user is not authenticated
  if (!user) {
    return null
  }

  return <>{children}</>
}
