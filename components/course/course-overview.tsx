import { OverviewFeature } from '@/types/course-page-types'
import { Check } from 'lucide-react'

export const Overview: React.FC<{ data?: OverviewFeature[] }> = ({ data }) => {
  // Use data from API or fallback to empty array
  const overviewFeatures = data || []

  if (!overviewFeatures.length) {
    return (
      <section id="overview" className="my-12">
        <p className="text-muted-foreground">
          No overview information available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section id="overview" className="my-12">
      <div className="grid gap-8 md:grid-cols-2">
        {overviewFeatures.map((section, index) => (
          <div key={section.id || index} className="bg-card rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            <ul className="space-y-3">
              {section.features?.map((item, itemIndex) => (
                <li
                  key={item.id || itemIndex}
                  className="flex items-start gap-2"
                >
                  <Check className="h-5 w-5 text-[#E91E63] mt-1 flex-shrink-0" />
                  <span>{item.feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
