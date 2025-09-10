'use client'

import { useState, useCallback } from 'react'
import { checkEnrollmentStatus } from '@/lib/actions/check-enrollment'
import { isAuthenticated } from '@/lib/auth'

export function useEnrollmentCheck() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null)
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  const checkEnrollment = useCallback(async (courseSlug: string) => {
    setIsLoading(true)
    try {
      // First check if user is authenticated
      const authStatus = await isAuthenticated()
      setIsAuth(authStatus)

      if (!authStatus) {
        setIsEnrolled(false)
        return false
      }

      // If authenticated, check enrollment
      const enrolled = await checkEnrollmentStatus(courseSlug)
      setIsEnrolled(enrolled)
      return enrolled
    } catch (error) {
      console.error('Error checking enrollment:', error)
      setIsEnrolled(false)
      setIsAuth(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkAuthOnly = useCallback(async () => {
    try {
      const authStatus = await isAuthenticated()
      setIsAuth(authStatus)
      return authStatus
    } catch (error) {
      console.error('Error checking authentication:', error)
      setIsAuth(false)
      return false
    }
  }, [])

  return {
    isLoading,
    isEnrolled,
    isAuth,
    checkEnrollment,
    checkAuthOnly,
  }
}
