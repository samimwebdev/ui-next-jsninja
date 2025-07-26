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

  // Use data from API or fallback to empty array
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
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">
          {data?.title || 'What Our Students Say'}
        </h2>
        <p className="text-muted-foreground">
          No reviews available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section className="my-12" id="reviews">
      <h2 className="text-3xl font-bold mb-6">
        {data?.title || 'What Our Students Say'}
      </h2>
      <div className="relative h-48">
        <AnimatePresence>
          <motion.div
            key={currentReview}
            className="absolute inset-0 bg-card text-card-foreground rounded-lg p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-lg mb-4">
              {getCleanText(reviews[currentReview].reviewDetails)}
            </p>
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                {reviews[currentReview].profile?.image?.url ? (
                  <Image
                    className="h-10 w-10 rounded-full object-cover"
                    src={reviews[currentReview].profile.image.url}
                    alt={reviews[currentReview].reviewerName}
                    width={40}
                    height={40}
                  />
                ) : (
                  <Image
                    className="h-10 w-10 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      reviews[currentReview].reviewerName
                    )}`}
                    width={40}
                    height={40}
                    alt={reviews[currentReview].reviewerName}
                  />
                )}
              </div>
              <div>
                <p className="font-semibold">
                  {reviews[currentReview].reviewerName}
                </p>
                <div className="flex items-center">
                  {[...Array(reviews[currentReview].rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
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
