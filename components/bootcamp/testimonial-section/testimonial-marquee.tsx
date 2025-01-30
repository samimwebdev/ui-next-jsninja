'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { testimonials } from './data'
import { TestimonialCard } from './testimonial-card'

export function TestimonialMarquee() {
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)
  const [isHovered1, setIsHovered1] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  const handleMouseEnter1 = useCallback(() => setIsHovered1(true), [])
  const handleMouseLeave1 = useCallback(() => setIsHovered1(false), [])
  const handleMouseEnter2 = useCallback(() => setIsHovered2(true), [])
  const handleMouseLeave2 = useCallback(() => setIsHovered2(false), [])

  useEffect(() => {
    const scroll1 = scrollRef1.current
    const scroll2 = scrollRef2.current
    if (!scroll1 || !scroll2) return

    let animationFrame1: number
    let animationFrame2: number
    let lastTimestamp1 = 0
    let lastTimestamp2 = 0

    const animate1 = (timestamp: number) => {
      if (!isHovered1) {
        const elapsed = timestamp - lastTimestamp1
        if (elapsed > 16) {
          // Aim for 60fps
          lastTimestamp1 = timestamp
          scroll1.scrollLeft += 1
          if (scroll1.scrollLeft >= scroll1.scrollWidth / 2) {
            scroll1.scrollLeft = 0
          }
        }
      }
      animationFrame1 = requestAnimationFrame(animate1)
    }

    const animate2 = (timestamp: number) => {
      if (!isHovered2) {
        const elapsed = timestamp - lastTimestamp2
        if (elapsed > 16) {
          // Aim for 60fps
          lastTimestamp2 = timestamp
          scroll2.scrollLeft -= 1
          if (scroll2.scrollLeft <= 0) {
            scroll2.scrollLeft = scroll2.scrollWidth / 2
          }
        }
      }
      animationFrame2 = requestAnimationFrame(animate2)
    }

    animationFrame1 = requestAnimationFrame(animate1)
    animationFrame2 = requestAnimationFrame(animate2)

    return () => {
      cancelAnimationFrame(animationFrame1)
      cancelAnimationFrame(animationFrame2)
    }
  }, [isHovered1, isHovered2])

  // Double the testimonials for seamless infinite scrolling
  const doubledTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="w-full overflow-hidden bg-background py-12 dark:bg-background">
      <div className="container mb-12">
        <h2 className="text-center text-3xl font-bold leading-tight tracking-tighter text-foreground md:text-4xl">
          Trusted by 20,000+ entrepreneurs,
          <br /> freelancers & web design agencies
        </h2>
      </div>

      {/* First row - Left to Right */}
      <div
        ref={scrollRef1}
        className="mb-8 flex w-full overflow-hidden"
        onMouseEnter={handleMouseEnter1}
        onMouseLeave={handleMouseLeave1}
      >
        <div className="flex">
          {doubledTestimonials.map((testimonial, idx) => (
            <div key={`row1-${testimonial.id}-${idx}`} className="px-3">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        <div className="flex" aria-hidden="true">
          {doubledTestimonials.map((testimonial, idx) => (
            <div
              key={`row1-duplicate-${testimonial.id}-${idx}`}
              className="px-3"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      {/* Second row - Right to Left */}
      <div
        ref={scrollRef2}
        className="flex w-full overflow-hidden"
        onMouseEnter={handleMouseEnter2}
        onMouseLeave={handleMouseLeave2}
      >
        <div className="flex">
          {doubledTestimonials.reverse().map((testimonial, idx) => (
            <div key={`row2-${testimonial.id}-${idx}`} className="px-3">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        <div className="flex" aria-hidden="true">
          {doubledTestimonials.map((testimonial, idx) => (
            <div
              key={`row2-duplicate-${testimonial.id}-${idx}`}
              className="px-3"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
