import { FAQ } from '@/components/shared/faq'
import { getCleanText } from '@/lib/utils'
import { FAQLayoutContentSection } from '@/types/bootcamp-page-types'

const FAQBootcamp: React.FC<{ data: FAQLayoutContentSection }> = ({ data }) => {
  // Transform bootcamp FAQ data to match the course FAQ component structure
  const faqItems = data?.faq?.questionAnswer || []

  return (
    <section className="w-full px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-screen-xl mx-auto flex items-center justify-center">
        <div className="w-full max-w-screen-xl">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl text-center !leading-[1.15] font-bold tracking-tight mb-3 sm:mb-4">
              {data?.title || 'Frequently Asked Questions'}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
              {getCleanText(data?.description || '') ||
                'Get answers to the most common questions about our JavaScript Bootcamp, including curriculum, support, certification, and how to enroll.'}
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-x-10">
            {/* First column with first half of FAQs */}
            <FAQ faqItems={faqItems.slice(0, 5)} limit={5} />

            {/* Second column with second half of FAQs */}
            <FAQ faqItems={faqItems.slice(5)} limit={5} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQBootcamp
