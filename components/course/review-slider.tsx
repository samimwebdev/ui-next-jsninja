'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ReviewContentSection } from '@/types/course-page-types'
import Image from 'next/image'
import { getCleanText } from '@/lib/utils'

export const ReviewSlider: React.FC<{ data: ReviewContentSection }> = ({
  data,
}) => {
  const [currentReview, setCurrentReview] = useState(0)
  const reviews = data?.reviews || []

  useEffect(() => {
    if (reviews.length > 0) {
      const timer = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [reviews.length])

  if (!reviews.length) {
    return (
      <section className="my-8 sm:my-12 px-4 sm:px-0" id="reviews">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center lg:text-left">
          {data?.title || 'What Our Students Say'}
        </h2>
        <p className="text-muted-foreground text-center lg:text-left">
          No reviews available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section className="my-8 sm:my-12 px-4 sm:px-0" id="reviews">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center lg:text-left">
        {data?.title || 'What Our Students Say'}
      </h2>
      <div className="relative min-h-[200px] sm:min-h-[220px]">
        <AnimatePresence>
          <motion.div
            key={currentReview}
            className="absolute inset-0 bg-card text-card-foreground rounded-lg p-4 sm:p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-base sm:text-lg mb-4 leading-relaxed">
              {getCleanText(reviews[currentReview].reviewDetails)}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {reviews[currentReview].profile?.image?.formats?.thumbnail
                  ?.url ? (
                  <Image
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                    src={
                      reviews[currentReview].profile.image.formats.thumbnail.url
                    }
                    alt={reviews[currentReview].reviewerName}
                    width={48}
                    height={48}
                  />
                ) : (
                  <Image
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      reviews[currentReview].reviewerName
                    )}`}
                    width={48}
                    height={48}
                    alt={reviews[currentReview].reviewerName}
                  />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm sm:text-base">
                  {reviews[currentReview].reviewerName}
                </p>
                <div className="flex items-center gap-0.5">
                  {[...Array(reviews[currentReview].rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
