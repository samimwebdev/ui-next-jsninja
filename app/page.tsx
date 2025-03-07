import { CourseList } from '@/components/home/course-list'
import { DemoVideos } from '@/components/home/demo-videos'
import { FeatureSection } from '@/components/home/feature-section'
import { HeroSection } from '@/components/home/hero-section'
import { TestimonialSection } from '@/components/home/testimonial-section'
import { StatsSection } from '@/components/home/stats-section'
import { BootcampList } from '@/components/home/bootcamp-list'

import HomeTechLogos from '@/components/home-tech-logos'
import HomeBlogList from '@/components/home/home-blog-list'

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      suppressHydrationWarning
    >
      <HeroSection />
      <FeatureSection />
      <HomeTechLogos />
      <CourseList />
      <TestimonialSection />
      <StatsSection />
      <BootcampList />
      <HomeBlogList />
      <DemoVideos />
    </div>
  )
}
