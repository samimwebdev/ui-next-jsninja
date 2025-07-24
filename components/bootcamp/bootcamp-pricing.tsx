'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Zap } from 'lucide-react'
import { PricingPackageContentSection } from '@/types/bootcamp-page-types'

export const BootcampPricing: React.FC<{
  data: PricingPackageContentSection
}> = ({ data }) => {
  return (
    <section className="w-full py-16 bg-background">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Choose Your <span className="text-primary">Learning Path</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Select the package that best fits your learning style and schedule
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Live Package */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 p-8">
            <Badge className="absolute top-6 right-6 bg-primary/10 hover:bg-primary/10 text-foreground">
              Most Popular
            </Badge>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Live Package</h3>
                <p className="text-muted-foreground">
                  Interactive live sessions
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-3xl font-bold">
                ৳15,000
                <span className="text-lg text-muted-foreground font-normal">
                  /course
                </span>
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Live interactive classes with instructors</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Real-time doubt clearing sessions</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Live project reviews and feedback</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Interactive group discussions</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Access to recorded sessions</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Certificate of completion</span>
              </div>
            </div>

            <Button size="lg" className="w-full">
              Enroll Now - Live Package
            </Button>
          </Card>

          {/* Recorded Package */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Recorded Package</h3>
                <p className="text-muted-foreground">Learn at your own pace</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-3xl font-bold">
                ৳8,000
                <span className="text-lg text-muted-foreground font-normal">
                  /course
                </span>
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Full access to recorded lectures</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Flexible learning schedule</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Lifetime access to course content</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Self-paced assignments</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Email support</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Certificate of completion</span>
              </div>
            </div>

            <Button size="lg" variant="outline" className="w-full">
              Enroll Now - Recorded Package
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
