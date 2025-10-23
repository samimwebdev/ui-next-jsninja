import { OverviewFeature } from '@/types/course-page-types'
import { Check } from 'lucide-react'

export const Overview: React.FC<{ data?: OverviewFeature[] }> = ({ data }) => {
  const overviewFeatures = data || []

  if (!overviewFeatures.length) {
    return (
      <section id="overview" className="my-8 sm:my-12 px-4 sm:px-0">
        <p className="text-muted-foreground text-center">
          No overview information available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section id="overview" className="my-8 sm:my-12 px-4 sm:px-0">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        {overviewFeatures.map((section) => (
          <div key={section.id} className="bg-card rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              {section.title}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {section.features?.map((item, itemIndex) => (
                <li
                  key={item.id || itemIndex}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{item.feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
