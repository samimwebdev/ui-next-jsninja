import { SEOData } from '@/types/home-page-types'
import { SchemaOrgData } from '@/types/page-types'

export interface PageData {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
}

export class StructuredDataGenerator {
  // Simple method to get structured data from SEO data or return null
  getStructuredData(seoData?: SEOData): SchemaOrgData | null {
    // If custom structured data exists in SEO from Strapi, use it
    if (seoData?.structuredData && typeof seoData.structuredData === 'object') {
      // Check if it's already a proper Schema.org object
      if (this.isValidStructuredData(seoData.structuredData)) {
        return seoData.structuredData as SchemaOrgData
      }
    }

    // No valid structured data from Strapi, return null
    return null
  }

  // Validate if the structured data is valid JSON-LD
  isValidStructuredData(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      '@context' in data &&
      '@type' in data
    )
  }
}

// Create a default instance
export const structuredDataGenerator = new StructuredDataGenerator()

// Simple helper function
export function getStructuredData(seoData?: SEOData): SchemaOrgData | null {
  return structuredDataGenerator.getStructuredData(seoData)
}
