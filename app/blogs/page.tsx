import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { getAllBlogs, getBlogCategories } from '@/lib/blog'
import { BlogsListClient } from '@/components/blog/blogs-list-client'
import { BlogsListSkeleton } from '@/components/blog/blogs-list-skeleton'
import { notFound } from 'next/navigation'
import { SimpleBlogPost } from '@/types/blog-types'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Blog | Javascript Ninja - Web Development Insights',
  description:
    'Explore the latest articles, tutorials, and insights on web development, React, Next.js, TypeScript, and modern frontend technologies.',
  keywords:
    'web development blog, react tutorials, nextjs guides, typescript tips, frontend development, programming articles',
  openGraph: {
    title: 'Blog | Javascript Ninja',
    description:
      'Explore the latest articles, tutorials, and insights on web development technologies.',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png',
        width: 1200,
        height: 630,
        alt: 'Frontend Ninja Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Javascript Ninja',
    description:
      'Explore the latest articles, tutorials, and insights on web development technologies.',
    images: [
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png',
    ],
  },
  alternates: {
    canonical: '/blogs',
  },
}

// Server Component
export default async function BlogsPage() {
  try {
    // Fetch blogs and categories concurrently
    const [blogsResponse, categories] = await Promise.all([
      getAllBlogs(1, 25), // Get first 25 blogs
      getBlogCategories(),
    ])

    if (!blogsResponse.data || blogsResponse.data.length === 0) {
      return (
        <div className="max-w-screen-xl mx-auto py-16 px-6 xl:px-0 text-center">
          <h1 className="text-3xl font-bold mb-4">No Blogs Found</h1>
          <p className="text-muted-foreground">
            We could not find any blog posts at the moment. Please check back
            later.
          </p>
        </div>
      )
    }

    return (
      <div className="min-h-screen">
        <Suspense fallback={<BlogsListSkeleton />}>
          <BlogsContent blogs={blogsResponse.data} categories={categories} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch blogs data:', error)
    notFound()
  }
}

// Client component wrapper
interface BlogsContentProps {
  blogs: SimpleBlogPost[]
  categories: Array<{ name: string; totalPosts: number; slug: string }>
}

function BlogsContent({ blogs, categories }: BlogsContentProps) {
  return <BlogsListClient initialBlogs={blogs} categories={categories} />
}

// Generate static params for SSG (optional)
export async function generateStaticParams() {
  // You can implement pagination here if needed
  return []
}
