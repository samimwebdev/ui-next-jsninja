'use client'

import { FAQ } from '@/components/shared/faq'
import { FAQContentSection } from '@/types/course-page-types'

export const CourseFAQ: React.FC<{ data: FAQContentSection }> = ({ data }) => {
  // Use data from API
  const faqItems = data?.faq?.questionAnswer || []
  const title = data?.title || 'Frequently Asked Questions'

  if (!faqItems.length) {
    return (
      <div className="w-full max-w-screen-xl">
        <h2 className="text-3xl md:text-3xl !leading-[1.15] font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-6 text-muted-foreground">
          No FAQs available at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-xl">
      <h2 className="text-3xl md:text-3xl !leading-[1.15] font-bold tracking-tight">
        {title}
      </h2>

      <div className="mt-6 w-full">
        <FAQ faqItems={faqItems} limit={5} />
      </div>
    </div>
  )
}
