import { strapiFetch } from '@/lib/strapi'
import { BootcampPageData } from '@/types/bootcamp-page-types'

export async function getBootcampData(slug: string): Promise<BootcampPageData> {
  try {
    const response = await strapiFetch<{ data: BootcampPageData }>(
      `/api/bootcamps/${slug}`,
      {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ['course-page', `course-${slug}`],
        },
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
      }
    )

    if (!response?.data) {
      throw new Error(`No Bootcamp data found for slug: ${slug}`)
    }

    return response.data
  } catch (error) {
    console.error(`Error fetching bootcamp data for ${slug}:`, error)
    throw error
  }
}
