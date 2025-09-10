import { Suspense } from 'react'
import { Metadata } from 'next'
import { CoursesClient } from '@/components/courses/courses-client'
import { strapiFetch } from '@/lib/strapi'
import { CoursesApiResponse } from '@/types/courses-page-types'
import { generateSEOMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'

// Server-side data fetching function
async function getCoursesData(): Promise<CoursesApiResponse['data']> {
  try {
    const response = await strapiFetch<CoursesApiResponse>('/api/courses', {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['courses-page'],
      },
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    })

    if (!response?.data) {
      throw new Error('No courses data found')
    }

    return response.data
  } catch (error) {
    console.error('Error fetching courses data:', error)
    throw error
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    return generateSEOMetadata(
      undefined,
      {
        title: 'All Courses - JavaScript Ninja',
        description:
          'Explore our comprehensive collection of JavaScript courses, bootcamps, workshops, and course bundles. Master web development with hands-on projects and expert instruction.',
      },
      {
        path: '/courses',
        type: 'website',
      }
    )
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generateSEOMetadata()
  }
}

// Loading component
function CoursesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main Server Component
export default async function CoursesPage() {
  let coursesData: CoursesApiResponse['data']

  try {
    coursesData = await getCoursesData()
  } catch (error) {
    console.error('Failed to fetch courses data:', error)
    notFound()
  }

  return (
    <div className="min-h-screen bg-background max-w-screen-xl mx-auto">
      <Suspense fallback={<CoursesLoading />}>
        <CoursesClient coursesData={coursesData} />
      </Suspense>
    </div>
  )
}
