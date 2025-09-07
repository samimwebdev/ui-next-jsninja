import { BlogApiResponse, BlogsListApiResponse } from '@/types/blog-types'
import { strapiFetch } from './strapi'

export async function getBlogData(
  slug: string
): Promise<BlogApiResponse['data']> {
  try {
    const response = await strapiFetch<BlogApiResponse>(`/api/blogs/${slug}`, {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['blog', `blog-${slug}`],
      },
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    })

    if (!response.data) {
      throw new Error('No blog data found')
    }

    return response.data
  } catch (error) {
    console.error('Error fetching blog data:', error)
    throw error
  }
}

export async function getAllBlogs(
  page: number = 1,
  pageSize: number = 25,
  category?: string
): Promise<BlogsListApiResponse> {
  try {
    let url = `/api/blogs?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedDate:desc`

    // Add category filter if provided
    if (category) {
      url += `&filters[categories][name][$eq]=${encodeURIComponent(category)}`
    }

    const response = await strapiFetch<BlogsListApiResponse>(url, {
      next: {
        revalidate: 1800, // Revalidate every 30 minutes
        tags: ['blogs', 'blogs-list', category ? `category-${category}` : ''],
      },
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    })

    return response
  } catch (error) {
    console.error('Error fetching blogs list:', error)
    throw error
  }
}

export async function getBlogCategories(): Promise<
  { name: string; totalPosts: number; slug: string }[]
> {
  try {
    const response = await strapiFetch<{
      data: Array<{
        id: number
        documentId: string
        name: string
        slug: string
        description: string
        blogs?: Array<{ id: number }>
      }>
    }>(`/api/categories?populate=blogs`, {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['categories', 'blog-categories'],
      },
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    })

    return response.data.map((category) => ({
      name: category.name,
      slug: category.slug,
      totalPosts: category.blogs?.length || 0,
    }))
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return []
  }
}

export async function getRelatedBlogs(
  currentSlug: string,
  limit: number = 3
): Promise<BlogApiResponse['data'][]> {
  try {
    const response = await strapiFetch<BlogsListApiResponse>(
      `/api/blogs?populate=*&filters[slug][$ne]=${currentSlug}&pagination[limit]=${limit}`,
      {
        next: {
          revalidate: 3600,
          tags: ['blogs', 'related-blogs'],
        },
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
      }
    )

    if (!response.data) {
      throw new Error('No related blogs found')
    }

    return response.data || []
  } catch (error) {
    console.error('Error fetching related blogs:', error)
    return []
  }
}
