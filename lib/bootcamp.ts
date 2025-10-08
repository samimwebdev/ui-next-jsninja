import { strapiFetch } from '@/lib/strapi'
import { BootcampPageData } from '@/types/bootcamp-page-types'

export async function getBootcampData(slug: string): Promise<BootcampPageData> {
  try {
    const response = await strapiFetch<{ data: BootcampPageData }>(
      `/api/bootcamps/${slug}`,
      {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ['bootcamp-page', `bootcamp-${slug}`],
        },
        headers: {
          'Content-Type': 'application/json',
        },
        allowNotFound: true, // Handle 404s gracefully
      }
    )

    return response.data
  } catch (error) {
    console.error(`Error fetching bootcamp data for ${slug}:`, error)
    throw error
  }
}
