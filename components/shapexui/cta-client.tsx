'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CallToActionContentSection } from '@/types/bootcamp-page-types'
import DynamicIcon from '../shared/DynamicIcon'
import { getCleanText } from '@/lib/utils'
import { CourseInfoType } from './cta'
import { useRouter } from 'next/navigation'

interface CTAClientWrapperProps {
  data: CallToActionContentSection
  courseInfo: CourseInfoType
}

export const CTAClientWrapper: React.FC<CTAClientWrapperProps> = ({
  data,
  courseInfo,
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      router.push(
        `/checkout?courseSlug=${courseInfo.slug}&courseType=${courseInfo.courseType}`
      )
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-foreground">
          {data.title}
        </h2>
        <p className="max-w-xl mx-auto mt-6 text-lg leading-relaxed text-muted-foreground">
          {data.description}
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {data.callToActionContent.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="flex items-start rounded-xl p-6 backdrop-blur-sm bg-background/90 border border-border/50 hover:border-primary/30 hover:bg-background hover:shadow-lg transition-all duration-300 shadow-sm"
          >
            <div className="p-3 rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
              {feature.icon ? (
                <DynamicIcon
                  icon={feature.icon}
                  className="h-8 w-8"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="h-8 w-8" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <div className="mt-1.5 text-sm text-muted-foreground">
                {getCleanText(feature.details)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-xl mx-auto mt-12"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto px-12 py-7 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition duration-300 shadow-lg shadow-primary/25 relative overflow-hidden group rounded-full font-bold"
              onClick={handleClick}
              disabled={isLoading}
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? 'Loading...' : data.btn?.btnLabel}
                {data.btn?.btnIcon && (
                  <DynamicIcon
                    icon={data.btn.btnIcon}
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    width={20}
                    height={20}
                  />
                )}
              </span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
