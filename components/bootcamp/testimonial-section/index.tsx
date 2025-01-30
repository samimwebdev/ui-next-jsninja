import { TestimonialMarquee } from '@/components/bootcamp/testimonial-section/testimonial-marquee'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to our LMS</h1>
      <TestimonialMarquee />
    </main>
  )
}
