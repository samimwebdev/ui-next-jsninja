import { SEOData, StructuredData } from '@/types/home-page-types'

export interface PageData {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
}

export class StructuredDataGenerator {
  // Simple method to get structured data from SEO data or return null
  getStructuredData(seoData?: SEOData): StructuredData | null {
    // If custom structured data exists in SEO from Strapi, use it
    if (seoData?.structuredData) {
      return seoData.structuredData as StructuredData
    }

    // No structured data from Strapi, return null
    return null
  }

  // Optional: Validate if the structured data is valid JSON-LD
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
export function getStructuredData(seoData?: SEOData): StructuredData | null {
  return structuredDataGenerator.getStructuredData(seoData)
}
