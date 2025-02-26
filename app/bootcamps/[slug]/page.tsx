import { BootcampHero } from '@/components/bootcamp/bootcamp-hero'
import { BootcampProjectShowcase } from '@/components/bootcamp/project-showcase/bootcamp-project-showcase'
import { BootcampSpeciality } from '@/components/bootcamp/bootcamp-speciality'
import { PromoVideos } from '@/components/bootcamp/promo-videos'
import { BatchSchedule } from '@/components/bootcamp/next-bacth-schedule'
import { BootcampOverview } from '@/components/bootcamp/bootcamp-overview/bootcamp-overview'
import FAQBootcamp from '@/components/faq/FAQBootcamp'
import TestimonialBootcamp from '@/components/testimonial-bootcamp'
import { BootcampLogoSlider } from '@/components/bootcamp/bootcamp-logo-slider'
import CallToAction from '@/components/shapexui/cta'
import BootcampSteps from '@/components/shapexui/steps'

// import { BootcampTestimonials } from '@/components/bootcamp/bootcamp-testimonials'

export default function BootcampDetails() {
  return (
    <>
      <BootcampHero />
      <BootcampOverview />
      <BatchSchedule />
      <BootcampSteps />
      <BootcampSpeciality />
      <BootcampLogoSlider />
      <BootcampProjectShowcase />
      <PromoVideos />
      <TestimonialBootcamp />
      <FAQBootcamp />
      <CallToAction />
    </>
  )
}
