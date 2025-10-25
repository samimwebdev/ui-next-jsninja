import { MetadataRoute } from 'next'

interface StrapiEntity {
  id: number
  slug: string
  title: string
  updatedAt: string | null
  publishedAt: string | null
  createdAt: string | null
}

interface CoursesResponse {
  data: {
    course: StrapiEntity[]
    bootcamp: StrapiEntity[]
    courseBundle: StrapiEntity[]
  }
}

interface BlogsResponse {
  data: StrapiEntity[]
}

// Helper function to safely get date
function getSafeDate(
  updatedAt: string | null,
  publishedAt: string | null,
  createdAt: string | null
): Date {
  const dateString = updatedAt || publishedAt || createdAt
  return dateString ? new Date(dateString) : new Date()
}

//Fetch dynamic page Data
async function fetchDynamicPageData(): Promise<StrapiEntity[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    )
    if (!response.ok) {
      console.error('Failed to fetch dynamic page data:', response.status)
      return []
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching dynamic page data:', error)
    return []
  }
}

// Fetch courses, bootcamps, and bundles from Strapi
async function getCoursesData(): Promise<{
  courses: StrapiEntity[]
  bootcamps: StrapiEntity[]
  bundles: StrapiEntity[]
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch courses:', response.status)
      return { courses: [], bootcamps: [], bundles: [] }
    }

    const data: CoursesResponse = await response.json()

    return {
      courses: data.data.course || [],
      bootcamps: data.data.bootcamp || [],
      bundles: data.data.courseBundle || [],
    }
  } catch (error) {
    console.error('Error fetching courses for sitemap:', error)
    return { courses: [], bootcamps: [], bundles: [] }
  }
}

// Fetch blog posts from Strapi
async function getBlogPosts(): Promise<StrapiEntity[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?populate=*&pagination[pageSize]=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch blogs:', response.status)
      return []
    }

    const data: BlogsResponse = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://javascriptninja.com'

  // Fetch dynamic content
  const [coursesData, blogs, dynamicPagesData] = await Promise.all([
    getCoursesData(),
    getBlogPosts(),
    fetchDynamicPageData(),
  ])

  const { courses, bootcamps, bundles } = coursesData

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Helper to create dynamic pages
  const createDynamicPages = (
    items: StrapiEntity[],
    basePath: string,
    changeFrequency: 'weekly' | 'monthly',
    priority: number
  ): MetadataRoute.Sitemap => {
    return items.map((item) => ({
      url: `${baseUrl}/${basePath}/${item.slug}`,
      lastModified: getSafeDate(
        item.updatedAt,
        item.publishedAt,
        item.createdAt
      ),
      changeFrequency,
      priority,
    }))
  }

  // Generate dynamic pages
  const coursePages = createDynamicPages(courses, '/courses', 'weekly', 0.8)
  const bootcampPages = createDynamicPages(
    bootcamps,
    '/bootcamps',
    'weekly',
    0.8
  )
  const bundlePages = createDynamicPages(bundles, '/bundles', 'weekly', 0.85)
  const blogPages = createDynamicPages(blogs, '/blog', 'monthly', 0.7)
  const dynamicPages = createDynamicPages(
    dynamicPagesData,
    '/pages',
    'monthly',
    0.6
  )

  return [
    ...staticPages,
    ...dynamicPages,
    ...coursePages,
    ...bootcampPages,
    ...bundlePages,
    ...blogPages,
  ]
}
