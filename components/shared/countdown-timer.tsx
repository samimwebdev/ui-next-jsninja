'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Flame } from 'lucide-react'

interface CountdownTimerProps {
  endDate: string | null
  title?: string
  subtitle?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({
  endDate,
  title = 'Limited Time Offer!',
  subtitle = 'Registration ends in:',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (!endDate) return

    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
        setIsExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
      }
    }

    // Initial calculation
    calculateTimeLeft()

    // Set up interval to update countdown
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  // Don't render on server to avoid hydration mismatch
  if (!isMounted || !endDate) return null

  // Don't show if expired
  if (isExpired) return null

  const formatTimeUnit = (unit: number) => {
    return unit.toString().padStart(2, '0')
  }

  const isUrgent = timeLeft.days <= 3

  return (
    <div className="relative mb-6">
      {/* Background gradient with enhanced contrast */}
      <div
        className={`
        relative overflow-hidden rounded-xl py-4 px-10
        ${
          isUrgent
            ? 'bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-red-500/20'
            : 'bg-gradient-to-r from-amber-100/80 via-orange-100/80 to-yellow-100/80 dark:from-ninja-gold/10 dark:via-ninja-orange/10 dark:to-ninja-gold/10 border border-amber-300/50 dark:border-ninja-gold/20'
        }
        ${isUrgent ? 'animate-pulse' : ''}
      `}
      >
        {/* Animated background shimmer */}
        <div
          className={`
          absolute inset-0 opacity-20 dark:opacity-30
          ${
            isUrgent
              ? 'bg-gradient-to-r from-transparent via-red-400/20 to-transparent'
              : 'bg-gradient-to-r from-transparent via-amber-300/30 dark:via-ninja-gold/20 to-transparent'
          }
          animate-shimmer bg-[length:200%_100%]
        `}
        />

        <div className="relative z-10 text-center">
          {/* Header with icon - improved contrast */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className={`
              p-1.5 rounded-full border
              ${
                isUrgent
                  ? 'bg-red-500/20 text-red-400 border-red-400/30'
                  : 'bg-amber-200/60 dark:bg-ninja-gold/20 text-amber-700 dark:text-ninja-gold border-amber-400/50 dark:border-ninja-gold/30'
              }
            `}
            >
              {isUrgent ? (
                <Flame className="h-4 w-4 animate-bounce" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </div>
            <h4
              className={`
              font-bold text-sm
              ${
                isUrgent
                  ? 'text-red-400'
                  : 'text-amber-800 dark:text-ninja-gold'
              }
            `}
            >
              {isUrgent ? '🔥 URGENT: Registration Closing Soon!' : title}
            </h4>
          </div>

          {/* Subtitle - better contrast */}
          <p
            className={`text-xs mb-4 font-medium ${
              isUrgent
                ? 'text-muted-foreground'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {subtitle}
          </p>

          {/* Countdown display - enhanced readability */}
          <div className="flex justify-center gap-2 md:gap-3">
            {/* Days */}
            <div
              className={`
              flex flex-col items-center p-2 md:p-3 rounded-lg min-w-[60px] border-2
              ${
                isUrgent
                  ? 'bg-red-500/20 border-red-500/30'
                  : 'bg-amber-50/90 dark:bg-ninja-gold/20 border-amber-400/60 dark:border-ninja-gold/30'
              }
            `}
            >
              <span
                className={`
                text-xl md:text-2xl font-bold
                ${
                  isUrgent
                    ? 'text-red-400'
                    : 'text-amber-700 dark:text-ninja-gold'
                }
              `}
              >
                {formatTimeUnit(timeLeft.days)}
              </span>
              <span
                className={`text-xs font-semibold ${
                  isUrgent
                    ? 'text-muted-foreground'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Days
              </span>
            </div>

            {/* Separator */}
            <div
              className={`
              flex items-center text-lg font-bold
              ${
                isUrgent
                  ? 'text-red-400'
                  : 'text-amber-600 dark:text-ninja-gold'
              }
            `}
            >
              :
            </div>

            {/* Hours */}
            <div
              className={`
              flex flex-col items-center p-2 md:p-3 rounded-lg min-w-[60px] border-2
              ${
                isUrgent
                  ? 'bg-red-500/20 border-red-500/30'
                  : 'bg-amber-50/90 dark:bg-ninja-gold/20 border-amber-400/60 dark:border-ninja-gold/30'
              }
            `}
            >
              <span
                className={`
                text-xl md:text-2xl font-bold
                ${
                  isUrgent
                    ? 'text-red-400'
                    : 'text-amber-700 dark:text-ninja-gold'
                }
              `}
              >
                {formatTimeUnit(timeLeft.hours)}
              </span>
              <span
                className={`text-xs font-semibold ${
                  isUrgent
                    ? 'text-muted-foreground'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Hours
              </span>
            </div>

            {/* Separator */}
            <div
              className={`
              flex items-center text-lg font-bold
              ${
                isUrgent
                  ? 'text-red-400'
                  : 'text-amber-600 dark:text-ninja-gold'
              }
            `}
            >
              :
            </div>

            {/* Minutes */}
            <div
              className={`
              flex flex-col items-center p-2 md:p-3 rounded-lg min-w-[60px] border-2
              ${
                isUrgent
                  ? 'bg-red-500/20 border-red-500/30'
                  : 'bg-amber-50/90 dark:bg-ninja-gold/20 border-amber-400/60 dark:border-ninja-gold/30'
              }
            `}
            >
              <span
                className={`
                text-xl md:text-2xl font-bold
                ${
                  isUrgent
                    ? 'text-red-400'
                    : 'text-amber-700 dark:text-ninja-gold'
                }
              `}
              >
                {formatTimeUnit(timeLeft.minutes)}
              </span>
              <span
                className={`text-xs font-semibold ${
                  isUrgent
                    ? 'text-muted-foreground'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Min
              </span>
            </div>

            {/* Separator */}
            <div
              className={`
              flex items-center text-lg font-bold
              ${
                isUrgent
                  ? 'text-red-400'
                  : 'text-amber-600 dark:text-ninja-gold'
              }
            `}
            >
              :
            </div>

            {/* Seconds */}
            <div
              className={`
              flex flex-col items-center p-2 md:p-3 rounded-lg min-w-[60px] border-2
              ${
                isUrgent
                  ? 'bg-red-500/20 border-red-500/30'
                  : 'bg-amber-50/90 dark:bg-ninja-gold/20 border-amber-400/60 dark:border-ninja-gold/30'
              }
            `}
            >
              <span
                className={`
                text-xl md:text-2xl font-bold animate-bounce
                ${
                  isUrgent
                    ? 'text-red-400'
                    : 'text-amber-700 dark:text-ninja-gold'
                }
              `}
              >
                {formatTimeUnit(timeLeft.seconds)}
              </span>
              <span
                className={`text-xs font-semibold ${
                  isUrgent
                    ? 'text-muted-foreground'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Sec
              </span>
            </div>
          </div>

          {/* Urgency message */}
          {isUrgent && (
            <div className="mt-3 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
              <p className="text-xs font-medium text-red-400">
                Only {timeLeft.days} day{timeLeft.days !== 1 ? 's' : ''} left to
                register!
              </p>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
