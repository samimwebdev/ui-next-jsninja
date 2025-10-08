import * as React from 'react'
import { strapiFetch } from '@/lib/strapi'
import type { CourseViewData } from '@/types/course-view-types'
import CourseViewLayoutWrapper from '@/components/context/course-view-provider'
import { SecurityTracker } from '@/components/course-view/security-tracker'
import { getAuthToken } from '@/lib/auth'
import { checkUserSecurity } from '@/lib/security-check'
import { CourseAccessDenied } from '@/components/course-view/course-access-denied'

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

  // Get token
  const token = await getAuthToken()

  if (!token) {
    return (
      <CourseAccessDenied message="Authentication required. Please log in to access this course." />
    )
  }

  // Check security
  const securityCheck = await checkUserSecurity(slug)

  if (!securityCheck.allowed) {
    return (
      <CourseAccessDenied
        message={
          securityCheck.message ||
          'You do not have access to this course. Please check your enrollment status.'
        }
      />
    )
  }

  // Fetch course data
  let response: CourseDataResponse | CourseErrorResponse

  try {
    response = await strapiFetch<CourseDataResponse | CourseErrorResponse>(
      `/api/course-view/${slug}`,
      {
        method: 'GET',
        token: token,
        returnErrorResponse: true,
        allowNotFound: true,
      }
    )
  } catch (error) {
    console.error('Failed to fetch course data:', error)
    return (
      <CourseAccessDenied message="Failed to load course. Please try again later." />
    )
  }

  // Handle API errors
  if ('error' in response && response.error) {
    const errorMessages: Record<number, string> = {
      404: 'Course not found. It may have been removed or the link is incorrect.',
      403: 'You do not have access to this course. Please check your enrollment status.',
      401: 'Your session has expired. Please log in again.',
      500: 'Server error. Please try again later.',
    }

    const errorMessage =
      errorMessages[response.error.status] ||
      response.error.message ||
      'Failed to load course'

    return <CourseAccessDenied message={errorMessage} />
  }

  // Validate course data
  if (!('data' in response) || !response.data) {
    return (
      <CourseAccessDenied message="Invalid course data received. Please try again." />
    )
  }

  const courseData = response.data

  // Render course view
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
}

export default CourseViewLayout
