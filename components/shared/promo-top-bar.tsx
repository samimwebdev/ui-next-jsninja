'use client'

import React, { useState, useEffect } from 'react'
import { X, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PromoTopBarProps {
  message: string
  buttonText: string
  buttonLink: string
  endDate: Date
  onClose: () => void
}

export function PromoTopBar({
  message = 'Summer Flash Sale! Get 50% off all courses',
  buttonText = 'Claim Offer',
  buttonLink = '/courses',
  endDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Default: 3 days from now
  onClose,
}: PromoTopBarProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Calculate time left
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        // Time's up - hide the banner
        onClose()
      }
    }

    // Initial calculation
    calculateTimeLeft()

    // Set up interval to update countdown
    const timer = setInterval(calculateTimeLeft, 1000)

    // Cleanup interval on unmount
    return () => clearInterval(timer)
  }, [endDate, onClose])

  // Format time units to always have two digits
  const formatTimeUnit = (unit: number) => {
    return unit.toString().padStart(2, '0')
  }

  return (
    <div className="w-full bg-gradient-ninja-primary relative text-ninja-navy py-2 px-4">
      <div className="container max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center md:text-left">
          <p className="font-medium text-sm md:text-base flex flex-wrap gap-1 md:gap-2 items-center justify-center md:justify-start">
            {message}
            <span className="font-bold inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-md text-xs md:text-sm">
              <Clock size={14} />
              {timeLeft.days > 0 && <span>{timeLeft.days}d:</span>}
              <span>{formatTimeUnit(timeLeft.hours)}h:</span>
              <span>{formatTimeUnit(timeLeft.minutes)}m:</span>
              <span>{formatTimeUnit(timeLeft.seconds)}s</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href={buttonLink}>
            <Button
              size="sm"
              className="whitespace-nowrap bg-ninja-navy hover:bg-ninja-navy/80 text-white hover:scale-105 transition-transform"
            >
              {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <button
            onClick={onClose}
            className="text-ninja-navy/80 hover:text-ninja-navy p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close promotion banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
