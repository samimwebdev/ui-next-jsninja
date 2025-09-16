import { ReviewLayoutContentSection } from '@/types/bootcamp-page-types'
import { getCleanText } from '@/lib/utils'
import { TestimonialMarqueeClient } from './testimonial-bootcamp-client'

const TestimonialBootcamp: React.FC<{ data: ReviewLayoutContentSection }> = ({
  data,
}) => {
  // Process reviews data on server - SSR
  const processedReviews = (data?.reviews || []).map((review) => ({
    id: review.id,
    reviewerName: review.reviewerName,
    designation: review?.designation || 'Student',
    reviewDetails: getCleanText(review.reviewDetails),
    profileImage: review.profile?.image?.url || null,
    initials: review.reviewerName.charAt(0),
  }))

  return (
    <div className="flex justify-center items-center py-12">
      <div className="h-full w-full text-center">
        {/* Static header content - SSR */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-4xl font-bold tracking-tight px-6">
            {data?.title ||
              'Testimonials + JavaScript Bootcamp Success Stories'}
          </h2>
          <p className="text-muted-foreground text-lg">
            {getCleanText(data?.description) ||
              'What about the people who have already taken the course? Heres what - they have to say + Hear from graduates who transformed their careers through our JavaScript Bootcamp.'}
          </p>
        </div>

        {/* Pass processed data to client component for animations */}
        <TestimonialMarqueeClient reviews={processedReviews} />
      </div>
    </div>
  )
}

export default TestimonialBootcamp
