'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Marquee from '@/components/ui/marquee'
import Image from 'next/image'

interface ProcessedReview {
  id: number
  reviewerName: string
  designation: string
  reviewDetails: string
  profileImage: string | null
  initials: string
}

interface TestimonialMarqueeClientProps {
  reviews: ProcessedReview[]
}

export const TestimonialMarqueeClient: React.FC<
  TestimonialMarqueeClientProps
> = ({ reviews }) => {
  return (
    <div className="relative">
      {/* Gradient overlays - exact same styling */}
      <div className="z-10 absolute left-0 inset-y-0 w-[15%] bg-gradient-to-r from-background to-transparent" />
      <div className="z-10 absolute right-0 inset-y-0 w-[15%] bg-gradient-to-l from-background to-transparent" />

      {/* First marquee - exact same props */}
      <Marquee pauseOnHover className="[--duration:20s]">
        <TestimonialList reviews={reviews} />
      </Marquee>

      {/* Second marquee reverse - exact same props */}
      <Marquee pauseOnHover reverse className="mt-0 [--duration:20s]">
        <TestimonialList reviews={reviews} />
      </Marquee>
    </div>
  )
}

const TestimonialList: React.FC<{ reviews: ProcessedReview[] }> = ({
  reviews,
}) =>
  reviews.map((review) => (
    <div key={review.id} className="min-w-96 max-w-sm bg-accent rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            {review.profileImage ? (
              <Image
                src={review.profileImage}
                alt={review.reviewerName}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
                {review.initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-left">
            <p className="text-lg font-semibold">{review.reviewerName}</p>
            <p className="text-sm text-gray-500">{review.designation}</p>
          </div>
        </div>
      </div>
      <p className="mt-5 text-[17px] text-left">{review.reviewDetails}</p>
    </div>
  ))
