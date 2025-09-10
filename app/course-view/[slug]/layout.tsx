import * as React from 'react'
import { strapiFetch } from '@/lib/strapi'
import { redirect } from 'next/navigation'
import type { CourseViewData } from '@/types/course-view-types'
import CourseViewLayoutWrapper from '@/components/context/course-view-provider'
import { SecurityTracker } from '@/components/course-view/security-tracker'
import { getAuthToken } from '@/lib/auth'
import { checkUserSecurity } from '@/lib/security-check'

interface CourseDataResponse {
  data: CourseViewData
}

interface CourseErrorResponse {
  data: null
  error: {
    status: number
    name: string
    message: string
    details: object
  }
}

// FIX: Type guard for Next.js redirect errors
function isNextRedirectError(
  error: unknown
): error is Error & { digest: string } {
  return (
    error instanceof Error &&
    'digest' in error &&
    typeof error.digest === 'string' &&
    error.digest.includes('NEXT_REDIRECT')
  )
}

// Course Layout Component (SSR)
async function CourseViewLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    // First check user security status
    const securityCheck = await checkUserSecurity(slug)

    if (!securityCheck.allowed) {
      redirect(
        `/dashboard?error=${encodeURIComponent(
          securityCheck.message || 'Access denied'
        )}`
      )
    }

    const token = await getAuthToken()

    if (!token) {
      console.log('No auth token, redirecting to dashboard')
      redirect(
        '/dashboard?error=' + encodeURIComponent('Authentication required')
      )
    }

    let courseData = null

    const response = await strapiFetch<
      CourseDataResponse | CourseErrorResponse
    >(`/api/course-view/${slug}`, {
      method: 'GET',
      token: token,
      returnErrorResponse: true,
    })

    // Check if response has error property using proper type checking
    if ('error' in response && response.error) {
      // Handle specific error statuses
      if (response.error.status === 404) {
        redirect(`/dashboard?error=${encodeURIComponent('Course not found.')}`)
      }

      if (response.error.status === 403) {
        redirect(
          `/dashboard?error=${encodeURIComponent(
            'You do not have access to this course. Please check your enrollment status.'
          )}`
        )
      }

      // Other error statuses
      redirect(
        `/dashboard?error=${encodeURIComponent(
          response.error.message || 'Failed to load course'
        )}`
      )
    }

    // Success case - extract course data
    if ('data' in response && response.data) {
      courseData = response.data
    } else {
      console.error('Unexpected course response format:', response)
      redirect(
        `/dashboard?error=${encodeURIComponent(
          'Invalid course data format received'
        )}`
      )
    }

    return (
      <div>
        <SecurityTracker courseSlug={slug} />

        <div className="min-h-screen bg-background text-foreground max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] lg:gap-6">
            <CourseViewLayoutWrapper courseData={courseData} error={null}>
              {children}
            </CourseViewLayoutWrapper>
          </div>
        </div>
      </div>
    )
  } catch (err) {
    // FIX: Use type guard for better TypeScript support
    if (isNextRedirectError(err)) {
      // This is a Next.js redirect, let it through
      console.log('Detected Next.js redirect, re-throwing:', err.digest)
      throw err
    }

    console.error('Failed to fetch course data:', err)

    // Extract error message for actual errors
    let errorMessage = 'Failed to load course data'

    if (err instanceof Error) {
      errorMessage = err.message
    }

    console.log('Course data fetch failed, redirecting:', errorMessage)

    redirect(`/dashboard?error=${encodeURIComponent(errorMessage)}`)
  }
}

export default CourseViewLayout
