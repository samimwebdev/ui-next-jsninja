'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Marquee from '@/components/ui/marquee'
import Image from 'next/image'
import { Quote } from 'lucide-react'

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
    <div className="relative py-8">
      {/* Enhanced gradient overlays */}
      <div className="z-10 absolute left-0 inset-y-0 w-[8%] bg-gradient-to-r from-background via-background/90 to-transparent" />
      <div className="z-10 absolute right-0 inset-y-0 w-[8%] bg-gradient-to-l from-background via-background/90 to-transparent" />

      {/* First marquee */}
      <Marquee pauseOnHover className="[--duration:30s] mb-6">
        <TestimonialList reviews={reviews} />
      </Marquee>

      {/* Second marquee reverse */}
      <Marquee pauseOnHover reverse className="[--duration:30s]">
        <TestimonialList reviews={reviews} />
      </Marquee>
    </div>
  )
}

const TestimonialList: React.FC<{ reviews: ProcessedReview[] }> = ({
  reviews,
}) =>
  reviews.map((review) => (
    <div
      key={review.id}
      className="relative min-w-[420px] max-w-md mx-4 bg-card border border-border hover:border-primary rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Quote icon */}
      <div className="absolute top-6 right-6 opacity-15">
        <Quote className="w-10 h-10 text-primary" />
      </div>

      {/* Header with profile */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-16 h-16 ring-2 ring-primary/20 flex-shrink-0">
          {review.profileImage ? (
            <Image
              src={review.profileImage}
              alt={review.reviewerName}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary border border-primary/20">
              {review.initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0 pt-1 text-left">
          <h4 className="font-bold text-lg text-primary leading-tight">
            {review.reviewerName}
          </h4>
          <p className="text-base text-muted-foreground mt-1 leading-relaxed">
            {review.designation}
          </p>
        </div>
      </div>

      {/* Review content */}
      <blockquote className="text-base leading-relaxed text-justify">
        {/* <span className="text-primary text-xl font-bold mr-1">&quot;</span> */}
        {review.reviewDetails}
        {/* <span className="t
        ext-primary text-xl font-bold ml-1">&quot;</span> */}
      </blockquote>

      {/* Bottom gradient border on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-accent/20 rounded-b-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  ))
