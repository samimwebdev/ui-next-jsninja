import type { Metadata } from 'next'
import { SEOData, MetaSocial, MetaImage } from '@/types/home-page-types'

interface SEOConfig {
  defaultTitle?: string
  defaultDescription?: string
  defaultImage?: string
  siteName?: string
  siteUrl?: string
  twitterHandle?: string
  keywords?: string[]
}

interface PageConfig {
  path?: string
  type?:
    | 'website'
    | 'article'
    | 'book'
    | 'profile'
    | 'music.song'
    | 'music.album'
    | 'music.playlist'
    | 'music.radio_station'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
}

const DEFAULT_SEO_CONFIG: SEOConfig = {
  defaultTitle: 'JavaScript Ninja - Learn Web Development',
  defaultDescription:
    'Master modern web development with expert-led courses and tutorials.',
  defaultImage: '/images/og-default.jpg',
  siteName: 'JavaScript Ninja',
  siteUrl: 'https://javascriptninja.com', // Fixed URL consistency
  twitterHandle: '@JavaScriptNinja',
  keywords: [
    'JavaScript',
    'Web Development',
    'React',
    'Node.js',
    'Programming Courses',
  ],
}

export class SEOGenerator {
  private config: SEOConfig

  constructor(config: Partial<SEOConfig> = {}) {
    this.config = { ...DEFAULT_SEO_CONFIG, ...config }
  }

  // Helper function to get social data by network
  private getSocialData(
    seoData: SEOData,
    network: string
  ): MetaSocial | undefined {
    return seoData.metaSocial?.find(
      (social) => social.socialNetwork.toLowerCase() === network.toLowerCase()
    )
  }

  // Helper function to get best image URL
  private getImageUrl(
    image?: MetaImage | MetaSocial['image'],
    preferredSize: 'large' | 'medium' | 'small' = 'large'
  ): string | null {
    if (!image) return null

    // Try to get preferred size, fallback to original
    return image.formats?.[preferredSize]?.url || image.url || null
  }

  // Helper function to build absolute URL
  private getAbsoluteUrl(path: string): string {
    if (path.startsWith('http')) return path
    return `${this.config.siteUrl}${path.startsWith('/') ? '' : '/'}${path}`
  }

  // Main function to generate metadata
  generateMetadata(
    seoData?: SEOData,
    overrides: Partial<Metadata> = {},
    pageConfig: PageConfig = {}
  ): Metadata {
    if (!seoData) {
      return this.getDefaultMetadata(overrides, pageConfig)
    }

    const facebookData = this.getSocialData(seoData, 'Facebook')
    const twitterData = this.getSocialData(seoData, 'Twitter')

    // Get the best images for social sharing
    const ogImage = this.getImageUrl(
      facebookData?.image || seoData.metaImage,
      'large'
    )
    const twitterImage = this.getImageUrl(
      twitterData?.image || seoData.metaImage,
      'large'
    )

    // Process keywords
    const keywords =
      seoData.keywords?.split(',').map((k) => k.trim()) ||
      this.config.keywords ||
      []

    // Build canonical URL - prioritize pageConfig.path over seoData.canonicalURL
    const canonicalUrl = pageConfig.path
      ? this.getAbsoluteUrl(pageConfig.path)
      : seoData.canonicalURL || this.config.siteUrl!

    const metadata: Metadata = {
      title: seoData.metaTitle || this.config.defaultTitle!,
      description: seoData.metaDescription || this.config.defaultDescription!,
      keywords,
      robots: seoData.metaRobots || 'index, follow',
      authors: pageConfig.authors?.map((name) => ({ name })) || [
        { name: `${this.config.siteName} Team` },
      ],
      creator: this.config.siteName!,
      publisher: this.config.siteName!,

      // Canonical URL
      alternates: {
        canonical: canonicalUrl,
      },

      // Open Graph / Facebook
      openGraph: {
        type: pageConfig.type || 'website',
        url: canonicalUrl,
        title:
          facebookData?.title || seoData.metaTitle || this.config.defaultTitle!,
        description:
          facebookData?.description ||
          seoData.metaDescription ||
          this.config.defaultDescription!,
        siteName: this.config.siteName!,
        locale: 'en_BN',
        ...(pageConfig.publishedTime && {
          publishedTime: pageConfig.publishedTime,
        }),
        ...(pageConfig.modifiedTime && {
          modifiedTime: pageConfig.modifiedTime,
        }),
        ...(pageConfig.section && { section: pageConfig.section }),
        ...(pageConfig.tags && { tags: pageConfig.tags }),
        ...(ogImage && {
          images: [
            {
              url: this.getAbsoluteUrl(ogImage),
              width:
                facebookData?.image?.width || seoData.metaImage?.width || 1200,
              height:
                facebookData?.image?.height || seoData.metaImage?.height || 630,
              alt:
                facebookData?.image?.alternativeText ||
                facebookData?.title ||
                seoData.metaTitle ||
                this.config.defaultTitle!,
            },
          ],
        }),
      },

      // Twitter
      twitter: {
        card: 'summary_large_image',
        site: this.config.twitterHandle!,
        creator: this.config.twitterHandle!,
        title:
          twitterData?.title || seoData.metaTitle || this.config.defaultTitle!,
        description:
          twitterData?.description ||
          seoData.metaDescription ||
          this.config.defaultDescription!,
        ...(twitterImage && {
          images: [
            {
              url: this.getAbsoluteUrl(twitterImage),
              alt:
                twitterData?.image?.alternativeText ||
                twitterData?.title ||
                seoData.metaTitle ||
                this.config.defaultTitle!,
            },
          ],
        }),
      },

      // Additional meta tags
      other: {
        ...(seoData.metaViewport && {
          viewport: seoData.metaViewport,
        }),
      },

      // Merge with overrides
      ...overrides,
    }

    return metadata
  }

  // Fallback metadata
  private getDefaultMetadata(
    overrides: Partial<Metadata> = {},
    pageConfig: PageConfig = {}
  ): Metadata {
    const canonicalUrl = pageConfig.path
      ? this.getAbsoluteUrl(pageConfig.path)
      : this.config.siteUrl!

    return {
      title: this.config.defaultTitle!,
      description: this.config.defaultDescription!,
      keywords: this.config.keywords!,
      robots: 'index, follow',
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: pageConfig.type || 'website',
        title: this.config.defaultTitle!,
        description: this.config.defaultDescription!,
        url: canonicalUrl,
        siteName: this.config.siteName!,
        ...(this.config.defaultImage && {
          images: [
            {
              url: this.getAbsoluteUrl(this.config.defaultImage),
              width: 1200,
              height: 630,
              alt: this.config.defaultTitle!,
            },
          ],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        site: this.config.twitterHandle!,
        creator: this.config.twitterHandle!,
        title: this.config.defaultTitle!,
        description: this.config.defaultDescription!,
        ...(this.config.defaultImage && {
          images: [this.getAbsoluteUrl(this.config.defaultImage)],
        }),
      },
      ...overrides,
    }
  }
}

// Create a default instance
export const seoGenerator = new SEOGenerator()

// Export helper functions for easy use with proper typing
export function generateSEOMetadata(
  seoData?: SEOData,
  overrides: Partial<Metadata> = {},
  pageConfig: PageConfig = {}
): Metadata {
  return seoGenerator.generateMetadata(seoData, overrides, pageConfig)
}

// Export types for use in other files
export type { PageConfig, SEOConfig }
