import { BlogApiResponse, BlogsListApiResponse } from '@/types/blog-types'
import { strapiFetch } from './strapi'

export async function getBlogData(
  slug: string
): Promise<BlogApiResponse['data']> {
  try {
    const response = await strapiFetch<BlogApiResponse>(`/api/blogs/${slug}`, {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['blogs', `blog-${slug}`],
      },
      headers: {
        'Content-Type': 'application/json',
      },
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
    let url = `/api/blogs?populate=categories&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedDate:desc`

    //  Add category filter if provided
    if (category) {
      url += `&filters[categories][name][$eq]=${encodeURIComponent(category)}`
    }

    const response = await strapiFetch<BlogsListApiResponse>(url, {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['blogs'],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error) {
    console.error('Error fetching blogs list:', error)
    throw error
  }
}

// Extract categories from blog data instead of making separate API call
export function extractCategoriesFromBlogs(
  blogs: BlogsListApiResponse['data']
): Array<{ name: string; totalPosts: number; slug: string }> {
  try {
    if (!blogs || blogs.length === 0) {
      return []
    }

    const categoryMap = new Map<
      string,
      { name: string; slug: string; count: number }
    >()

    // Iterate through all blogs and collect categories
    blogs.forEach((blog) => {
      if (blog?.categories && Array.isArray(blog.categories)) {
        blog.categories.forEach((category) => {
          if (category?.name && category?.slug) {
            const key = category.slug
            if (categoryMap.has(key)) {
              const existing = categoryMap.get(key)!
              categoryMap.set(key, {
                ...existing,
                count: existing.count + 1,
              })
            } else {
              categoryMap.set(key, {
                name: category.name,
                slug: category.slug,
                count: 1,
              })
            }
          }
        })
      }
    })

    // Convert map to array and sort by count (descending)
    return Array.from(categoryMap.values())
      .map((category) => ({
        name: category.name,
        slug: category.slug,
        totalPosts: category.count,
      }))
      .sort((a, b) => b.totalPosts - a.totalPosts)
  } catch (error) {
    console.error('Error extracting categories from blogs:', error)
    return []
  }
}

export async function getRelatedBlogs(
  currentSlug: string,
  limit: number = 3
): Promise<BlogApiResponse['data'][]> {
  try {
    const response = await strapiFetch<BlogsListApiResponse>(
      `/api/blogs?populate=categories&filters[slug][$ne]=${currentSlug}&pagination[limit]=${limit}`,
      {
        next: {
          revalidate: 3600,
          tags: ['blogs', 'related-blogs'],
        },
        headers: {
          'Content-Type': 'application/json',
        },
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
