// 'use client'

import * as React from 'react'
import { getPageData } from '@/lib/actions/get-generic-page-data'
import { HtmlContentRenderer } from '@/components/shared/html-content-renderer'
import { Card } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { PageData } from '@/types/page-types'
import { cleanHtmlForSeo } from '@/lib/utils/seo-utils'
import { Metadata } from 'next'
import Image from 'next/image'
import { generateSEOMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static paths for all pages
export async function generateStaticParams() {
  try {
    // Fetch all published pages from your API
    const pages = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages?fields[0]=slug&pagination[limit]=100`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!pages.ok) {
      console.error('Failed to fetch pages for static generation')
      return []
    }

    const data = await pages.json()

    // Return array of params for each page
    return data.data.map((page: { slug: string }) => ({
      slug: page.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate comprehensive metadata for SEO using the SEO utility
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const pageData = await getPageData(slug)
    const page = pageData.data

    return generateSEOMetadata(
      page.seo,
      {
        // Page-specific overrides
        title: page.seo?.metaTitle || page.title,
        description:
          page.seo?.metaDescription || cleanHtmlForSeo(page.description),
        other: {
          'article:published_time': page.publishedAt,
          'article:modified_time': page.updatedAt,
        },
      },
      {
        // Page configuration
        path: `/pages/${slug}`,
        type: 'article',
        publishedTime: page.publishedAt,
        modifiedTime: page.updatedAt,
        authors: ['Javascript Ninja Team'],
        section: 'General',
      }
    )
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generateSEOMetadata(undefined, {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
      robots: 'noindex, nofollow',
    })
  }
}

export default async function GenericPage({ params }: PageProps) {
  let pageData: PageData | null = null

  try {
    const { slug } = await params
    const response = await getPageData(slug)
    pageData = response.data
  } catch (error) {
    console.error('Error loading page:', error)
    notFound()
  }

  if (!pageData) {
    notFound()
  }

  // Generate structured data JSON-LD with enhanced data
  const structuredData = pageData.seo?.structuredData || {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageData.title,
    url: `https://www.javascriptninja.com/pages/${pageData.slug}`,
    description: cleanHtmlForSeo(pageData.description),
    datePublished: pageData.publishedAt,
    dateModified: pageData.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Javascript Ninja',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Javascript Ninja',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.javascriptninja.com/logo.png',
      },
    },
    ...(pageData.seo?.metaImage && {
      image: {
        '@type': 'ImageObject',
        url: pageData.seo.metaImage.url,
        width: pageData.seo.metaImage.width,
        height: pageData.seo.metaImage.height,
        caption:
          pageData.seo.metaImage.caption ||
          pageData.seo.metaImage.alternativeText,
      },
    }),
  }

  return (
    <>
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Page Header */}
            <header className="text-center space-y-4 pb-8 border-b border-border">
              {/* Featured Image */}
              {pageData.seo?.metaImage && (
                <div className="mb-6">
                  <Image
                    src={
                      pageData.seo.metaImage.formats?.large?.url ||
                      pageData.seo.metaImage.url
                    }
                    width={pageData.seo.metaImage.width}
                    height={pageData.seo.metaImage.height}
                    alt={
                      pageData.seo.metaImage.alternativeText || pageData.title
                    }
                    className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {pageData.title}
              </h1>
              <div className="text-sm text-muted-foreground">
                Last updated:{' '}
                {new Date(pageData.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              {/* SEO Keywords Display (optional, for debugging) */}
              {pageData.seo?.keywords &&
                process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    Keywords: {pageData.seo.keywords}
                  </div>
                )}
            </header>

            {/* Main Content */}
            <main>
              <Card className="p-8 border-border bg-card">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  <HtmlContentRenderer
                    content={pageData.description}
                    className="text-foreground"
                  />
                </article>
              </Card>
            </main>

            {/* Social Media Preview (Development Only) */}
            {process.env.NODE_ENV === 'development' &&
              pageData.seo?.metaSocial && (
                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Social Media Previews
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {pageData.seo.metaSocial.map((social) => (
                      <div key={social.id} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-sm text-primary mb-2">
                          {social.socialNetwork}
                        </h4>
                        {social.image && (
                          <Image
                            src={
                              social.image.formats?.small?.url ||
                              social.image.url
                            }
                            width={
                              social.image.formats?.small?.width ||
                              social.image.width
                            }
                            height={
                              social.image.formats?.small?.height ||
                              social.image.height
                            }
                            alt={social.title}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                        )}
                        <h5 className="font-medium text-sm">{social.title}</h5>
                        <p className="text-xs text-muted-foreground">
                          {social.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Page Footer */}
            <footer className="pt-8 border-t border-border">
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Published on{' '}
                  {new Date(pageData.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  )
}
