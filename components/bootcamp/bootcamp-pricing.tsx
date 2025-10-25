import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { PricingPackageContentSection } from '@/types/bootcamp-page-types'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { PricingClientWrapper } from './bootcamp-pricing-client'

export const BootcampPricing: React.FC<{
  data: PricingPackageContentSection
  courseInfo: {
    title: string
    slug: string
    price: number
    courseType: string
    isRegistrationOpen: boolean
    isLiveRegistrationAvailable: boolean
    liveBootcampPrice?: number
    isRecordedRegistrationAvailable: boolean
    endDate: string | null
    actualPrice?: number | null
  }
}> = ({ data, courseInfo }) => {
  const parseChecklist = (htmlString: string) => {
    const matches = htmlString.match(
      /class="todo-list__label__description"[^>]*>([^<]*)</g
    )
    if (!matches) return []

    return matches
      .map((match) => {
        const textMatch = match.match(/>([^<]*)</)
        return textMatch ? textMatch[1].trim() : ''
      })
      .filter((text) => text.length > 0)
  }

  return (
    <section
      id="bootcamp-pricing"
      className="w-full py-8 sm:py-12 lg:py-16 bg-background px-4 sm:px-6"
    >
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
            {data.title}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {data.package.map((pkg) => {
            const features = parseChecklist(pkg.details)

            return (
              <Card
                key={pkg.id}
                className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 p-6 sm:p-8 flex flex-col"
              >
                {pkg.isPreferred && (
                  <Badge className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-primary/10 hover:bg-primary/10 text-foreground text-xs sm:text-sm px-2 sm:px-3 py-1">
                    Most Popular
                  </Badge>
                )}

                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    {pkg.packageIcon ? (
                      <DynamicIcon
                        icon={pkg.packageIcon}
                        className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {pkg.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                  {features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col mt-auto">
                  <PricingClientWrapper
                    packageData={{
                      id: pkg.id,
                      name: pkg.name,
                      isPreferred: pkg.isPreferred,
                      btn: pkg.btn,
                      packageType: pkg.packageType,
                    }}
                    courseInfo={courseInfo}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
