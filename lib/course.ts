import { strapiFetch } from '@/lib/strapi'
import { CoursePageData } from '@/types/course-page-types'

export async function getCourseData(slug: string): Promise<CoursePageData> {
  try {
    const response = await strapiFetch<{ data: CoursePageData }>(
      `/api/courses/${slug}`,
      {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ['courses-page', `course-${slug}`],
        },
        headers: {
          'Content-Type': 'application/json',
        },
        allowNotFound: true, // Handle 404s gracefully
      }
    )

    return response.data
  } catch (error) {
    console.error(`Error fetching course data for ${slug}:`, error)
    throw error
  }
}
