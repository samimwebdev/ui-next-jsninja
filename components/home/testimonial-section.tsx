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
      // Set fixed height and ensure all cards have same baseline height
      'transition-transform duration-300 flex flex-col',
      isMobile
        ? 'scale-100 h-72'
        : isCurrent
        ? 'bg-muted/50 scale-110 shadow-lg border-primary/20 h-72'
        : 'scale-90 h-72'
    )}
  >
    <CardContent className="p-6 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
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
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground truncate">
            {review.reviewerName}
          </h3>
          <p className="text-muted-foreground text-sm truncate">
            {review?.course?.title}
          </p>
        </div>
      </div>

      {/* Use flex-1 to fill remaining space and add scrolling for long content */}
      <div className="flex-1 overflow-hidden">
        <p
          className="text-muted-foreground text-sm leading-relaxed line-clamp-6"
          dangerouslySetInnerHTML={{ __html: review.reviewDetails }}
        />
      </div>
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
    <span className="text-sm text-muted-foreground">
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
  const reviews = useMemo(
    () =>
      reviewSectionData?.reviews?.length > 0 ? reviewSectionData.reviews : [],
    [reviewSectionData]
  )

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

    // Always show 3 reviews: previous, current, next
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
        <h1 className="text-4xl font-bold text-center mb-12 max-w-3xl mx-auto text-foreground">
          {reviewSectionData.title || 'Customer Reviews'}
        </h1>
        <p className="text-center text-muted-foreground">
          No reviews available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section className="px-4 py-6" aria-label="Customer reviews">
      <h1 className="text-4xl font-bold text-center mb-12 max-w-3xl mx-auto text-foreground">
        {reviewSectionData.title || 'Customer Reviews'}
      </h1>

      <div className="relative max-w-6xl mx-auto">
        {/* Fixed height container to ensure consistent alignment */}
        <div className="flex items-center justify-center h-80 overflow-hidden">
          <div
            className={cn(
              'flex items-center w-full',
              isMobile ? 'gap-0 justify-center' : 'gap-4 justify-center'
            )}
          >
            <AnimatePresence initial={false} custom={direction}>
              {visibleReviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  className="flex-1 flex justify-center"
                  initial={{ opacity: 0, x: direction > 0 ? 200 : -200 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full max-w-sm">
                    <ReviewCard
                      review={review}
                      isCurrent={!isMobile && idx === 1}
                      isMobile={isMobile}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
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
