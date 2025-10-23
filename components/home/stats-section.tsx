'use client'
import { Card } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'

interface StatsCounter {
  id: number
  statsLabel: string
  statsCount: number
  icon: {
    iconName: string
    iconData: string
    width: number
    height: number
  }
}

interface StatsSectionProps {
  data: {
    title: string
    description: string
    statsCounter: StatsCounter[]
  }
}

export const StatsSection: React.FC<StatsSectionProps> = ({ data }) => {
  const [isInView, setIsInView] = useState(false)
  const [counts, setCounts] = useState<{ [key: number]: number }>({})
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView || !data.statsCounter) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const initialCounts: { [key: number]: number } = {}
    data.statsCounter.forEach((stat) => {
      initialCounts[stat.id] = 0
    })
    setCounts(initialCounts)

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      const newCounts: { [key: number]: number } = {}
      data.statsCounter.forEach((stat) => {
        newCounts[stat.id] = Math.round(stat.statsCount * progress)
      })

      setCounts(newCounts)

      if (step === steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isInView, data.statsCounter])

  return (
    <div
      ref={sectionRef}
      className="w-full max-w-screen-xl space-y-8 py-8 sm:py-12 px-4 sm:px-8 mx-auto"
    >
      <Card className="mx-auto max-w-screen-xl p-6 sm:p-8 rounded-3xl">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {data.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {data.statsCounter.map((stat) => (
              <div key={stat.id} className="space-y-2 text-center md:text-left">
                <div
                  className="h-5 w-5 text-muted-foreground mx-auto md:mx-0"
                  dangerouslySetInnerHTML={{ __html: stat.icon.iconData }}
                />
                <div className="text-2xl sm:text-3xl font-bold">
                  {counts[stat.id] || 0}
                  {stat.statsLabel.toLowerCase().includes('rate')
                    ? '%'
                    : stat.statsLabel.toLowerCase().includes('efficiency')
                    ? '%'
                    : '+'}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {stat.statsLabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
