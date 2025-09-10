import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { strapiFetch } from '@/lib/strapi'
import { generateSEOMetadata } from '@/lib/seo'
import { CourseBundleClient } from '@/components/course-bundle/course-bundle-client'
import { CourseBundleApiResponse } from '@/types/course-bundle-types'
import Link from 'next/link'

interface CourseBundlePageProps {
  params: {
    bundleSlug: Promise<string>
  }
}

// Server-side data fetching function
async function getCourseBundleData(
  bundleSlug: string
): Promise<CourseBundleApiResponse['data']> {
  try {
    const response = await strapiFetch<CourseBundleApiResponse>(
      `/api/course-bundles/${bundleSlug}`,
      {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ['course-bundle', `course-bundle-${bundleSlug}`],
        },
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
      }
    )

    if (!response?.data) {
      throw new Error('No course bundle data found')
    }

    return response.data
  } catch (error) {
    console.error('Error fetching course bundle data:', error)
    throw error
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CourseBundlePageProps): Promise<Metadata> {
  try {
    const bundleData = await getCourseBundleData(await params.bundleSlug)

    return generateSEOMetadata(
      bundleData?.seo,
      {
        title: `${bundleData?.title || 'Course Bundle'} - JavaScript Ninja`,
        description:
          bundleData?.shortDescription ||
          bundleData?.helperText ||
          `Explore the ${
            bundleData?.title || 'course bundle'
          } with comprehensive learning materials.`,
      },
      {
        path: `/bundles/${params.bundleSlug}`,
        type: 'article',
      }
    )
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generateSEOMetadata()
  }
}

// Loading component
function CourseBundleLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-10 bg-muted rounded w-2/3 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg"></div>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Error boundary component
function BundleError() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Bundle Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The course bundle you are looking for could not be found.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Browse All Courses
        </Link>
      </div>
    </div>
  )
}

// Main Server Component
export default async function CourseBundlePage({
  params,
}: CourseBundlePageProps) {
  let bundleData: CourseBundleApiResponse['data']

  try {
    bundleData = await getCourseBundleData(await params.bundleSlug)

    // Additional safety check
    if (!bundleData) {
      notFound()
    }
  } catch (error) {
    console.error('Failed to fetch course bundle data:', error)
    return <BundleError />
  }

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto bg-background">
      <Suspense fallback={<CourseBundleLoading />}>
        <CourseBundleClient bundleData={bundleData} />
      </Suspense>
    </div>
  )
}
