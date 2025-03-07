import { CourseTabs } from '@/components/course/course-tabs'
import { CourseContent } from '@/components/course/course-content'
import { Overview } from '@/components/course/course-overview'
import { ProjectShowcase } from '@/components/course/project-showcase'
import { ReviewSlider } from '@/components/course/review-slider'
import { CourseAuthor } from '@/components/course/course-author'
import { FAQ } from '@/components/course/faq'
import { CourseBundle } from '@/components/course/course-bundle'
import { CourseHero } from '@/components/course/course-hero'
import { CircleCheckBig } from 'lucide-react'

export default async function CourseDetailsPage({
  params,
}: {
  params: { slug: string }
}) {
  console.log(params)
  // const { slug } = await params
  return (
    <div className="bg-background text-foreground">
      {/* <CourseHead slug="test" /> */}
      <main className="container mx-auto px-4 max-w-screen-xl">
        <CourseHero />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-2 md:order-2 lg:order-1">
            <CourseTabs />
            <Overview />
            <CourseContent />
            <CourseAuthor />
            <div id="reviews" className="scroll-mt-20">
              <ReviewSlider />
            </div>
            <FAQ />
            <ProjectShowcase />
            <CourseBundle />
          </div>
          <div className="lg:col-span-1 space-y-6 order-1 md:order-1 lg:order-2">
            <div className="sticky top-4 bg-card rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Course Features</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">
                    <CircleCheckBig className="w-5 h-5 text-green-500" />
                  </span>
                  150+ ঘন্টার কোর্স
                </li>
                <li className="flex items-center">
                  <span className="mr-2">
                    <CircleCheckBig className="w-5 h-5 text-green-500" />
                  </span>
                  প্রজেক্ট ভিত্তিক
                </li>
                <li className="flex items-center">
                  <span className="mr-2">
                    {' '}
                    <CircleCheckBig className="w-5 h-5 text-green-500" />
                  </span>
                  লাইফটাইম এক্সেস
                </li>
                <li className="flex items-center">
                  <span className="mr-2">
                    {' '}
                    <CircleCheckBig className="w-5 h-5 text-green-500" />
                  </span>
                  ৩ মাসের জন্য ১:১ সাপোর্ট
                </li>
              </ul>
              <div className="mt-6">
                <div className="text-3xl font-bold mb-4">৳ ৭৯৯৯</div>
                <a href={`/checkout?courseId=${params.slug}`} className="block w-full">
                  <button className="w-full bg-[#E91E63] text-white py-3 px-6 rounded-lg hover:bg-[#D81B60] transition-colors">
                    কোর্সে ভর্তি হন
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
