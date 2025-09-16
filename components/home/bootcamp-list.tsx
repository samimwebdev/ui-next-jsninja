'use client'
import React, { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { CircleX, Calendar, Clock, DollarSign } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useOutsideClick } from '@/hooks/user-outside-click'
import Link from 'next/link'
import { BootcampSectionData, Course } from '@/types/home-page-types'
import { formatDuration } from '@/lib/utils'
import { formatBootcampPrice, formatDate } from '@/lib/bootcamp-utils'

// // Helper function to format date
// const formatDate = (dateString: string | undefined): string => {
//   if (!dateString) return 'TBA'
//   const date = new Date(dateString)
//   return date.toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   })
// }

// // Helper function to format price
// const formatPrice = (price: number): string => {
//   if (!price || price <= 0) return 'Free'
//   return `${price.toLocaleString()} BDT`
// }

// Add this helper function after the other helper functions
const getDifficultyStyle = (level: string) => {
  const normalizedLevel = level?.toLowerCase()
  switch (normalizedLevel) {
    case 'beginner':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'advanced':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const BootcampList: React.FC<{ data: BootcampSectionData }> = ({
  data: bootcampSectionData,
}) => {
  const bootcampList = bootcampSectionData.bootcamps || []
  const [bootcamp, setBootcamp] = useState<Course | null>(null)
  const ref = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)
  const id = useId()
  const [isInView, setIsInView] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setBootcamp(null)
      }
    }

    if (bootcamp) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [bootcamp])

  useOutsideClick(ref, () => setBootcamp(null))

  return (
    <div className="w-full max-w-screen-xl py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div aria-label="Bootcamp courses" ref={sectionRef}>
          <motion.h2
            className="text-4xl font-bold text-center mb-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {bootcampSectionData.title}
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {bootcampSectionData.description}
          </motion.p>

          <AnimatePresence>
            {bootcamp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-10"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {bootcamp && (
              <div className="fixed inset-0 grid place-items-center z-20 p-4">
                <motion.div
                  layoutId={`card-${bootcamp.baseContent.title}-${id}`}
                  ref={ref}
                  className="w-full max-w-2xl bg-background rounded-lg shadow-lg overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <div className="relative">
                    <Image
                      src={
                        bootcamp.baseContent.featureImage?.formats?.medium
                          ?.url ||
                        bootcamp.baseContent.featureImage?.url ||
                        '/images/placeholder.svg'
                      }
                      alt={bootcamp.baseContent.title}
                      width={800}
                      height={400}
                      className="w-full h-60 object-cover"
                    />
                    <motion.button
                      onClick={() => setBootcamp(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CircleX size={20} />
                    </motion.button>

                    {/* Price Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold">
                        {formatBootcampPrice(bootcamp.baseContent.price)}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-3xl font-bold mb-3 text-foreground">
                      {bootcamp.baseContent.title}
                    </h2>

                    {/* Bootcamp Details - Single Row */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={16} />
                        <span>
                          Starts:{' '}
                          {formatDate(bootcamp.baseContent.startingFrom || '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground">Duration:</span>
                        <Badge variant="secondary" className="ml-1">
                          {formatDuration(bootcamp.baseContent.duration)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign size={16} />
                        <span>
                          {formatBootcampPrice(bootcamp.baseContent.price)}
                        </span>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bootcamp.baseContent.categories?.map(
                        (category, indx) => (
                          <Badge key={indx} variant="secondary">
                            {category.name}
                          </Badge>
                        )
                      )}
                      {bootcamp.baseContent.level && (
                        <Badge variant="outline">
                          {bootcamp.baseContent.level}
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {bootcamp.baseContent.shortDescription}
                    </p>

                    <div className="flex gap-3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1"
                      >
                        <Button className="w-full">
                          <Link
                            href={`/bootcamps/${bootcamp.baseContent.slug}`}
                            className="w-full"
                          >
                            {bootcamp?.baseContent.browseCoursesBtn?.btnLabel ||
                              'Enroll Now'}
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <motion.div
            className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {bootcampList.map((bootcamp, index) => (
              <motion.div
                layoutId={`card-${bootcamp.baseContent.title}-${id}`}
                key={bootcamp.documentId}
                onClick={() => setBootcamp(bootcamp)}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="overflow-hidden h-full w-full flex flex-col border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="p-0 relative">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          bootcamp.baseContent.featureImage?.formats?.medium
                            ?.url ||
                          bootcamp.baseContent.featureImage?.url ||
                          '/images/placeholder.svg'
                        }
                        alt={bootcamp.baseContent.title}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-110"
                      />
                      {/* Price and Level Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        <Badge className="bg-primary text-primary-foreground font-semibold shadow-lg">
                          {formatBootcampPrice(bootcamp.baseContent.price)}
                        </Badge>
                        {bootcamp.baseContent.level && (
                          <Badge
                            className={`font-semibold shadow-lg border text-xs hover:text-white ${getDifficultyStyle(
                              bootcamp.baseContent.level
                            )}`}
                          >
                            {bootcamp.baseContent.level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 flex-1 flex flex-col">
                    <CardTitle className="text-lg font-bold mb-2 line-clamp-2">
                      {bootcamp.baseContent.title}
                    </CardTitle>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {bootcamp.baseContent.shortDescription}
                    </p>

                    {/* Bootcamp Info - Single Row for Cards */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>
                          Starts:{' '}
                          {formatDate(bootcamp.baseContent.startingFrom || '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-1"
                        >
                          {formatDuration(bootcamp.baseContent.duration)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      variant="outline"
                    >
                      {bootcamp?.baseContent.browseCoursesBtn?.btnLabel ||
                        'View Details'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {bootcampList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No bootcamps available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
