import { CourseList } from '@/components/home/course-list'
import { DemoVideos } from '@/components/home/demo-videos'
import { FeatureSection } from '@/components/home/feature-section'
import { HeroSection } from '@/components/home/hero-section'
import { LogoSlider } from '@/components/home/logo-slider'
import { TestimonialSection } from '@/components/home/testimonial-section'
import { StatsSection } from '@/components/home/stats-section'
import { BootcampList } from '@/components/home/bootcamp-list'

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      suppressHydrationWarning
    >
      <HeroSection />
      <FeatureSection />
      <LogoSlider />
      <CourseList />
      <TestimonialSection />
      <StatsSection />
      <BootcampList />
      <DemoVideos />
    </div>
  )
}
