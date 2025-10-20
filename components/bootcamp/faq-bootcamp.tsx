import { FAQ } from '@/components/shared/faq'
import { getCleanText } from '@/lib/utils'
import { FAQLayoutContentSection } from '@/types/bootcamp-page-types'

const FAQBootcamp: React.FC<{ data: FAQLayoutContentSection }> = ({ data }) => {
  // Transform bootcamp FAQ data to match the course FAQ component structure
  const faqItems = data?.faq?.questionAnswer || []

  return (
    <section className="w-full px-4 py-12">
      <div className="max-w-screen-xl mx-auto flex items-center justify-center ">
        <div className="w-full max-w-screen-xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-4xl text-center !leading-[1.15] font-bold tracking-tight">
              {data?.title || 'Frequently Asked Questions'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {getCleanText(data?.description || '') ||
                'Get answers to the most common questions about our JavaScript Bootcamp, including curriculum, support, certification, and how to enroll.'}
            </p>
          </div>

          <div className="w-full grid md:grid-cols-2 gap-x-10">
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
