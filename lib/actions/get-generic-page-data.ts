import { PageResponse } from '@/types/page-types'
import { strapiFetch } from '../strapi'

export async function getPageData(slug: string): Promise<PageResponse> {
  try {
    const data = await strapiFetch<PageResponse>(`/api/pages/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['pages', `page-${slug}`], // Optional: cache tags for better cache management
      },
    })
    return data
  } catch (error) {
    console.error('Error fetching page data:', error)
    throw new Error(`Failed to fetch page data for slug: ${slug}`)
  }
}
