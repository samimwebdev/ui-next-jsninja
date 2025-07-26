import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { PricingPackageContentSection } from '@/types/bootcamp-page-types'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { PricingClientWrapper } from './bootcamp-pricing-client'

export const BootcampPricing: React.FC<{
  data: PricingPackageContentSection
}> = ({ data }) => {
  // Server-side HTML parsing using cheerio-like approach or regex
  const parseChecklist = (htmlString: string) => {
    // Simple regex approach for server-side parsing
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
    <section className="w-full py-16 bg-background">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            {data.title}
          </h2>
          <p className="text-muted-foreground text-lg">{data.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {data.package.map((pkg) => {
            const features = parseChecklist(pkg.details)

            return (
              <Card
                key={pkg.id}
                className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 p-8"
              >
                {pkg.isPreferred && (
                  <Badge className="absolute top-6 right-6 bg-primary/10 hover:bg-primary/10 text-foreground">
                    Most Popular
                  </Badge>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    {pkg.packageIcon ? (
                      <DynamicIcon
                        icon={pkg.packageIcon}
                        className="h-6 w-6 text-primary"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <Check className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{pkg.name}</h3>
                    <p className="text-muted-foreground">
                      {pkg.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-3xl font-bold">
                    ৳{pkg.price.toLocaleString()}
                    <span className="text-lg text-muted-foreground font-normal">
                      /course
                    </span>
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Client component for button interactions */}
                <PricingClientWrapper
                  packageData={{
                    id: pkg.id,
                    name: pkg.name,
                    isPreferred: pkg.isPreferred,
                    btn: pkg.btn,
                  }}
                />
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
