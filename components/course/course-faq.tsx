'use client'

import { FAQ } from '@/components/shared/faq'
import { FAQContentSection } from '@/types/course-page-types'

export const CourseFAQ: React.FC<{ data: FAQContentSection }> = ({ data }) => {
  const faqItems = data?.faq?.questionAnswer || []
  const title = data?.title || 'Frequently Asked Questions'

  if (!faqItems.length) {
    return (
      <div className="w-full max-w-screen-xl px-4 sm:px-0 my-8 sm:my-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center lg:text-left mb-4">
          {title}
        </h2>
        <p className="text-muted-foreground text-center lg:text-left">
          No FAQs available at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-xl px-4 sm:px-0 my-8 sm:my-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center lg:text-left mb-6 sm:mb-8">
        {title}
      </h2>

      <div className="w-full">
        <FAQ faqItems={faqItems} limit={5} />
      </div>
    </div>
  )
}
