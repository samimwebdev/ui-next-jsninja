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
      'transition-transform duration-300 flex flex-col',
      isMobile
        ? 'scale-100 max-h-auto min-h-[280px]' // Auto height on mobile with minimum
        : isCurrent
        ? 'bg-muted/50 scale-110 shadow-lg border-primary/20 h-72'
        : 'scale-90 h-72'
    )}
  >
    <CardContent className="p-4 sm:p-6 flex flex-col h-auto">
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 flex-shrink-0">
        <Avatar className="size-12 sm:size-14 flex-shrink-0">
          <AvatarImage
            src={review?.profile?.image?.formats?.thumbnail?.url}
            alt={review.reviewerName}
          />
          <AvatarFallback className="text-sm">
            {review.reviewerName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
            {review.reviewerName}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm truncate">
            {review?.courses?.[0]?.title}
          </p>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <p
          className={cn(
            'text-muted-foreground text-xs sm:text-sm leading-relaxed',
            isMobile ? 'line-clamp-none' : 'line-clamp-6'
          )}
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
  <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
    <Button
      variant="outline"
      size="icon"
      onClick={onPrevious}
      className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
      aria-label="Previous review"
    >
      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>
    <span className="text-xs sm:text-sm text-muted-foreground min-w-[60px] text-center">
      {currentIndex + 1} / {totalItems}
    </span>
    <Button
      variant="outline"
      size="icon"
      onClick={onNext}
      className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
      aria-label="Next review"
    >
      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
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
      <section
        className="w-full max-w-screen-xl px-4 sm:px-6 py-8 sm:py-12"
        aria-label="Customer reviews"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 max-w-3xl mx-auto text-foreground">
          {reviewSectionData.title || 'Customer Reviews'}
        </h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          No reviews available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section
      className="w-full max-w-screen-xl px-4 sm:px-6 py-8 sm:py-12"
      aria-label="Customer reviews"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 max-w-3xl mx-auto text-foreground">
        {reviewSectionData.title || 'Customer Reviews'}
      </h1>

      <div className="relative max-w-6xl mx-auto">
        {/* Responsive height container */}
        <div
          className={cn(
            'flex items-center justify-center overflow-hidden',
            isMobile ? 'min-h-[320px]' : 'h-80'
          )}
        >
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
                  className={cn(
                    'flex justify-center',
                    isMobile ? 'w-full max-w-md' : 'flex-1'
                  )}
                  initial={{ opacity: 0, x: direction > 0 ? 200 : -200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -200 : 200 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={cn('w-full', !isMobile && 'max-w-sm')}>
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
