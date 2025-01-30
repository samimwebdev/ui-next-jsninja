import { BootcampFeatureSection } from '@/components/bootcamp/bootcamp-feature'
import { BootcampHero } from '@/components/bootcamp/bootcamp-hero'
import { BootcampProjectShowcase } from '@/components/bootcamp/bootcamp-project-showcase'
import { HowBootcampRuns } from '@/components/bootcamp/how-bootcamp-runs'

// import { BootcampTestimonials } from '@/components/bootcamp/bootcamp-testimonials'

export default function BootcampDetails() {
  return (
    <>
      <BootcampHero />
      <BootcampFeatureSection />
      <BootcampProjectShowcase />
      <HowBootcampRuns />
    </>
  )
}
