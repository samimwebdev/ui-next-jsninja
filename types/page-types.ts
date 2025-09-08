import { StrapiImage } from './shared-types'

export interface PageResponse {
  data: PageData
  meta: Record<string, unknown>
}

export interface PageData {
  id: number
  documentId: string
  title: string
  slug: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
  seo?: SeoData
}

export interface SeoData {
  id: number
  metaTitle: string
  metaDescription: string
  keywords: string
  metaRobots: string
  structuredData: StructuredData
  metaViewport: string
  canonicalURL: string
  metaImage?: StrapiImage
  metaSocial?: MetaSocial[]
}

export interface MetaSocial {
  id: number
  socialNetwork: 'Facebook' | 'Twitter'
  title: string
  description: string
  image?: StrapiImage
}

export interface StructuredData {
  title: string
  metaDescription: string
  metaKeywords: string
  ogTitle: string
  ogDescription: string
  ogUrl: string
  ogImage: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  canonicalUrl: string
  structuredData: SchemaOrgData
}

export interface SchemaOrgData {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
}
