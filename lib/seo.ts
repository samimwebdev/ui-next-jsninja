import type { Metadata } from 'next'
import { SEOData, StrapiImage } from '@/types/home-page-types'
import { SeoData } from '@/types/page-types'

interface SEOConfig {
  defaultTitle: string
  defaultDescription: string
  defaultImage: string
  siteName: string
  siteUrl: string
  twitterHandle: string
  keywords: string[]
}

interface PageConfig {
  path?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
}

const DEFAULT_SEO_CONFIG: SEOConfig = {
  defaultTitle: 'JavaScript Ninja - Learn Web Development',
  defaultDescription:
    'Master modern web development with expert-led courses and tutorials.',
  defaultImage: '/images/og-default.jpg',
  siteName: 'JavaScript Ninja',
  siteUrl: 'https://javascriptninja.com',
  twitterHandle: '@JavaScriptNinja',
  keywords: [
    'JavaScript',
    'Web Development',
    'React',
    'Node.js',
    'Programming Courses',
  ],
}

function getImageUrl(image?: StrapiImage): string | null {
  if (!image) return null
  return (
    image.formats?.large?.url || image.formats?.medium?.url || image.url || null
  )
}

function getAbsoluteUrl(path: string, baseUrl: string): string {
  if (path.startsWith('http')) return path
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
}

export function generateSEOMetadata(
  seoData?: SeoData | SEOData,
  overrides: Partial<Metadata> = {},
  pageConfig: PageConfig = {}
): Metadata {
  const config = DEFAULT_SEO_CONFIG

  if (!seoData) {
    const canonicalUrl = pageConfig.path
      ? getAbsoluteUrl(pageConfig.path, config.siteUrl)
      : config.siteUrl

    return {
      title: config.defaultTitle,
      description: config.defaultDescription,
      keywords: config.keywords,
      robots: 'index, follow',
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: pageConfig.type || 'website',
        title: config.defaultTitle,
        description: config.defaultDescription,
        url: canonicalUrl,
        siteName: config.siteName,
        images: [
          {
            url: getAbsoluteUrl(config.defaultImage, config.siteUrl),
            width: 1200,
            height: 630,
            alt: config.defaultTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: config.twitterHandle,
        title: config.defaultTitle,
        description: config.defaultDescription,
        images: [getAbsoluteUrl(config.defaultImage, config.siteUrl)],
      },
      ...overrides,
    }
  }

  // Get social media data
  const facebookData = seoData.metaSocial?.find(
    (s) => s.socialNetwork === 'Facebook'
  )
  const twitterData = seoData.metaSocial?.find(
    (s) => s.socialNetwork === 'Twitter'
  )

  // Get images
  const ogImage = getImageUrl(facebookData?.image || seoData.metaImage)
  const twitterImage = getImageUrl(twitterData?.image || seoData.metaImage)

  // Build canonical URL
  let canonicalUrl = pageConfig.path
    ? getAbsoluteUrl(pageConfig.path, config.siteUrl)
    : config.siteUrl

  if (seoData.canonicalURL) {
    if (
      typeof seoData.canonicalURL === 'string' &&
      seoData.canonicalURL.includes('href=')
    ) {
      // Extract from HTML string
      const match = seoData.canonicalURL.match(/href="([^"]*)"/)
      if (match) canonicalUrl = match[1]
    } else if (typeof seoData.canonicalURL === 'string') {
      canonicalUrl = seoData.canonicalURL
    }
  }

  const metadata: Metadata = {
    title: seoData.metaTitle || config.defaultTitle,
    description: seoData.metaDescription || config.defaultDescription,
    keywords:
      seoData.keywords?.split(',').map((k: string) => k.trim()) ||
      config.keywords,
    robots: seoData.metaRobots || 'index, follow',
    alternates: { canonical: canonicalUrl },

    openGraph: {
      type: pageConfig.type || 'website',
      url: canonicalUrl,
      title: facebookData?.title || seoData.metaTitle || config.defaultTitle,
      description:
        facebookData?.description ||
        seoData.metaDescription ||
        config.defaultDescription,
      siteName: config.siteName,
      ...(pageConfig.publishedTime && {
        publishedTime: pageConfig.publishedTime,
      }),
      ...(pageConfig.modifiedTime && { modifiedTime: pageConfig.modifiedTime }),
      ...(ogImage && {
        images: [
          {
            url: getAbsoluteUrl(ogImage, config.siteUrl),
            width: seoData.metaImage?.width || 1200,
            height: seoData.metaImage?.height || 630,
            alt:
              facebookData?.title || seoData.metaTitle || config.defaultTitle,
          },
        ],
      }),
    },

    twitter: {
      card: 'summary_large_image',
      site: config.twitterHandle,
      title: twitterData?.title || seoData.metaTitle || config.defaultTitle,
      description:
        twitterData?.description ||
        seoData.metaDescription ||
        config.defaultDescription,
      ...(twitterImage && {
        images: [
          {
            url: getAbsoluteUrl(twitterImage, config.siteUrl),
            alt: twitterData?.title || seoData.metaTitle || config.defaultTitle,
          },
        ],
      }),
    },

    ...overrides,
  }

  return metadata
}

export type { PageConfig, SEOConfig }
