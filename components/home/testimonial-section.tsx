'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Review, ReviewSectionData } from '@/types/home-page-types'

const AUTO_SCROLL_INTERVAL = 5000

const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

const ReviewCard = ({
  review,
  isCurrent,
  isMobile,
}: {
  review: Review
  isCurrent: boolean
  isMobile: boolean
}) => (
  <Card
    className={cn(
      'h-full transition-transform duration-300',
      isMobile
        ? 'scale-100'
        : isCurrent
        ? 'bg-gray-50 scale-110 text-black'
        : 'scale-90'
    )}
  >
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="size-14">
          <AvatarImage
            src={
              review?.profile?.imageUrl ||
              review?.profile?.image?.formats?.medium?.url
            }
            alt={review.reviewerName}
          />
          <AvatarFallback>
            {review.reviewerName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{review.reviewerName}</h3>
          <p className="text-gray-600 text-sm">{review?.course?.title}</p>
        </div>
      </div>
      <p
        className="text-gray-600 text-sm"
        dangerouslySetInnerHTML={{ __html: review.reviewDetails }}
      />
    </CardContent>
  </Card>
)

const NavigationControls = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
}: {
  currentIndex: number
  totalItems: number
  onPrevious: () => void
  onNext: () => void
}) => (
  <div className="flex items-center justify-center gap-4 mt-2">
    <Button
      variant="outline"
      size="icon"
      onClick={onPrevious}
      className="rounded-full"
      aria-label="Previous review"
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <span className="text-sm text-gray-500">
      {currentIndex + 1} / {totalItems}
    </span>
    <Button
      variant="outline"
      size="icon"
      onClick={onNext}
      className="rounded-full"
      aria-label="Next review"
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
)

export const TestimonialSection: React.FC<{ data: ReviewSectionData }> = ({
  data: reviewSectionData,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const isMobile = useMediaQuery()

  // Use the provided data or fallback to empty array
  const reviews =
    reviewSectionData?.reviews?.length > 0 ? reviewSectionData.reviews : []

  const next = useCallback(() => {
    if (reviews.length === 0) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }, [reviews.length])

  const previous = useCallback(() => {
    if (reviews.length === 0) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }, [reviews.length])

  const visibleReviews = useMemo(() => {
    if (reviews.length === 0) return []

    if (isMobile) {
      return [reviews[currentIndex]]
    }

    // Always show 3 reviews: previous, current, next (like original)
    return [
      reviews[(currentIndex - 1 + reviews.length) % reviews.length],
      reviews[currentIndex],
      reviews[(currentIndex + 1) % reviews.length],
    ]
  }, [currentIndex, isMobile, reviews])

  useEffect(() => {
    if (reviews.length === 0) return
    const id = setInterval(next, AUTO_SCROLL_INTERVAL)
    return () => clearInterval(id)
  }, [next, reviews.length])

  if (reviews.length === 0) {
    return (
      <section className="px-4 py-6" aria-label="Customer reviews">
        <h1 className="text-4xl font-bold text-center mb-12 max-w-3xl mx-auto">
          {reviewSectionData.title || 'Customer Reviews'}
        </h1>
        <p className="text-center text-gray-500">
          No reviews available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section className="px-4 py-6" aria-label="Customer reviews">
      <h1 className="text-4xl font-bold text-center mb-12 max-w-3xl mx-auto">
        {reviewSectionData.title || 'Customer Reviews'}
      </h1>

      <div className="relative max-w-6xl mx-auto">
        <div
          className={cn(
            'flex items-center h-72 overflow-hidden',
            isMobile ? 'gap-0' : 'gap-4'
          )}
        >
          <AnimatePresence initial={false} custom={direction}>
            {visibleReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                className="flex-1"
                initial={{ opacity: 0, x: direction > 0 ? 200 : -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ReviewCard
                  review={review}
                  isCurrent={!isMobile && idx === 1}
                  isMobile={isMobile}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <NavigationControls
          currentIndex={currentIndex}
          totalItems={reviews.length}
          onPrevious={previous}
          onNext={next}
        />
      </div>
    </section>
  )
}
