import { getStructuredData } from '@/lib/structured-data'
import type { SEOData } from '@/types/home-page-types'

interface StructuredDataProps {
  seoData?: SEOData
}

export function StructuredData({ seoData }: StructuredDataProps) {
  const structuredData = getStructuredData(seoData)

  // Only render if we have structured data from Strapi
  if (!structuredData) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
