import * as React from 'react'
// import { Sidebar } from '@/components/course-view/sidebar'
import { strapiFetch } from '@/lib/strapi'
import type { CourseViewData } from '@/types/course-view-types'
import CourseViewLayoutWrapper from '@/components/context/course-view-provider'
import { getAuthToken } from '@/lib/auth'

// Course Layout Component (SSR)
async function CourseViewLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const token = await getAuthToken()
  let courseData = null
  let error = null
  try {
    // Fetch course data using strapiFetch
    const response = await strapiFetch<{ data: CourseViewData }>(
      `/api/course-view/${slug}`,
      {
        method: 'GET',
        token: token,
      }
    )

    console.log(response.data, 'fetched course data')
    courseData = response.data
  } catch (err) {
    console.error('Failed to fetch course data:', err)
    error = err instanceof Error ? err.message : 'Failed to load course data'
  }

  return (
    <div>
      <div className="min-h-screen bg-background text-foreground max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] lg:gap-6">
          <CourseViewLayoutWrapper courseData={courseData} error={error}>
            {children}
          </CourseViewLayoutWrapper>
        </div>
      </div>
    </div>
  )
}

export default CourseViewLayout
