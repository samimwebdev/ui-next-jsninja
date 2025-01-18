'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const reviews = [
  {
    id: 1,
    name: 'John Doe',
    rating: 5,
    comment:
      'This course exceeded my expectations. The content is top-notch and the instructor is excellent.',
  },
  {
    id: 2,
    name: 'Jane Smith',
    rating: 4,
    comment:
      'Great course overall. I learned a lot and feel much more confident with React and Next.js now.',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    rating: 5,
    comment:
      'The projects in this course are fantastic. They really helped me apply what I learned.',
  },
]

export function ReviewSlider() {
  const [currentReview, setCurrentReview] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6">What Our Students Say</h2>
      <div className="relative h-48">
        <AnimatePresence>
          <motion.div
            key={currentReview}
            className="absolute inset-0 bg-card text-card-foreground rounded-lg p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg mb-4">{reviews[currentReview].comment}</p>
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${reviews[currentReview].name}`}
                  alt={reviews[currentReview].name}
                />
              </div>
              <div>
                <p className="font-semibold">{reviews[currentReview].name}</p>
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
