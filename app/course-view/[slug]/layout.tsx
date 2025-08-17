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

// Course Layout Component (SSR)
async function CourseViewLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // First check user security status
  const securityCheck = await checkUserSecurity(slug)

  if (!securityCheck.allowed) {
    console.log('Security check failed, redirecting:', securityCheck.message)
    // Force redirect and stop execution
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

  try {
    const response = await strapiFetch<
      CourseDataResponse | CourseErrorResponse
    >(`/api/course-view/${slug}`, {
      method: 'GET',
      token: token,
      returnErrorResponse: true, // Ensure we get structured error responses
    })

    // Check if response has error property using proper type checking
    if ('error' in response && response.error) {
      console.log('Course API returned error:', response.error)

      // Now TypeScript knows response.error exists and has the right structure
      if (response.error.status === 404 || response.error.status === 403) {
        console.log('Course not found - redirecting')
        redirect(
          `/dashboard?error=${encodeURIComponent(
            'Course not found or you do not have access to this course.'
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
      // Unexpected response format
      console.error('Unexpected course response format:', response)
      redirect(
        `/dashboard?error=${encodeURIComponent(
          'Invalid course data format received'
        )}`
      )
    }
  } catch (err) {
    console.error('Failed to fetch course data:', err)

    // Extract error message
    let errorMessage = 'Failed to load course data'

    if (err instanceof Error) {
      errorMessage = err.message
    }

    console.log('Course data fetch failed, redirecting:', errorMessage)

    // Redirect to dashboard with error message
    redirect(`/dashboard?error=${encodeURIComponent(errorMessage)}`)
  }

  return (
    <div>
      {/* Only include SecurityTracker for POST tracking, not for blocking */}
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
}

export default CourseViewLayout
