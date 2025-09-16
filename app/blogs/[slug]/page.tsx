import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getBlogData, getRelatedBlogs } from '@/lib/blog'
import { BlogDetailClient } from '@/components/blog/blog-detail-client'
import { RelatedBlogsSection } from '@/components/blog/related-blogs-section'
import { BlogDetailSkeleton } from '@/components/blog/blog-detail-skeleton'
import { RelatedBlogsSkeleton } from '@/components/blog/related-blogs-skeleton'
import { BlogPost } from '@/types/blog-types'
import { strapiFetch } from '@/lib/strapi'

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const blog = await getBlogData(slug)

    const categoryNames =
      blog.categories?.map((cat) => cat.name).join(', ') || ''
    const authorName = blog.author
      ? `${blog.author.firstName} ${blog.author.lastName}`
      : 'Javascript Ninja'

    return {
      title: `${blog.title} | Javascript Ninja Blog`,
      description: blog.details
        ? blog.details.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
        : `Read about ${blog.title} on Javascript Ninja blog`,
      keywords: categoryNames,
      authors: [{ name: authorName }],
      openGraph: {
        title: blog.title,
        description: blog.details
          ? blog.details.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
          : `Read about ${blog.title} on Javascript Ninja blog`,
        type: 'article',
        publishedTime: blog.publishedDate,
        modifiedTime: blog.updatedAt,
        authors: [authorName],

        tags: blog.tags?.split(',').map((tag) => tag.trim()),
        images: blog.author?.image?.url
          ? [
              {
                url: blog.author.image.url,
                width: blog.author.image.width,
                height: blog.author.image.height,
                alt: blog.title,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.details
          ? blog.details.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
          : `Read about ${blog.title} on Javascript Ninja blog`,
        images: blog.author?.image?.url ? [blog.author.image.url] : [],
      },
      alternates: {
        canonical: `/blogs/${slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating blog metadata:', error)
    return {
      title: 'Blog Not Found | Javascript Ninja',
      description: 'The blog post you are looking for could not be found.',
    }
  }
}

// Main page component with streaming
export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params

  // Fetch main blog data first (critical content)
  let blog: BlogPost
  try {
    blog = await getBlogData(slug)
  } catch (error) {
    console.error('Failed to fetch blog data:', error)
    notFound()
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 xl:px-0">
      {/* Main blog content - SSR */}
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogDetailClient blog={blog} />
      </Suspense>

      {/* Related blogs - Streaming (non-critical content) */}
      <Suspense fallback={<RelatedBlogsSkeleton />}>
        <RelatedBlogsWrapper slug={slug} />
      </Suspense>
    </div>
  )
}

// Related blogs wrapper for streaming
async function RelatedBlogsWrapper({ slug }: { slug: string }) {
  const relatedBlogs = await getRelatedBlogs(slug, 3)
  return <RelatedBlogsSection blogs={relatedBlogs} />
}

// Generate static params for all blog pages
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    // Fetch all blog slugs for SSG
    const response = await strapiFetch<{
      data: Array<{
        slug: string
        title: string
        publishedDate?: string
      }>
    }>(
      '/api/blogs?fields[0]=slug&fields[1]=title&fields[2]=publishedDate&pagination[limit]=100&sort[0]=publishedDate:desc',
      {
        next: {
          revalidate: 3600, // Revalidate every hour
        },
      }
    )

    if (!response?.data) {
      console.warn('No blog data found for static generation')
      return []
    }

    // Filter and extract slugs
    const validBlogs = response.data.filter((blog) => {
      const hasSlug = blog.slug

      if (!hasSlug) {
        console.warn(`Blog "${blog.title || 'Unknown'}" missing slug`)
        return false
      }

      return hasSlug
    })

    return validBlogs.map((blog) => {
      console.log(`📄 Static page for: ${blog.slug} (${blog.title})`)
      return {
        slug: blog.slug,
      }
    })
  } catch (error) {
    console.error('❌ Error fetching blog slugs for static generation:', error)
    return []
  }
}
