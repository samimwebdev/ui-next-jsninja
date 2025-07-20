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

    // Initialize counts
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

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div ref={sectionRef} className="w-full space-y-8 py-12 px-2">
      <Card className="mx-auto max-w-screen-xl p-8 rounded-3xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">{data.title}</h2>
            <p className="text-muted-foreground">{data.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {data.statsCounter.map((stat) => (
              <div key={stat.id} className="space-y-2">
                <div
                  className="h-5 w-5 text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: stat.icon.iconData }}
                />
                <div className="text-3xl font-bold">
                  {counts[stat.id] || 0}
                  {stat.statsLabel.toLowerCase().includes('rate')
                    ? '%'
                    : stat.statsLabel.toLowerCase().includes('efficiency')
                    ? '%'
                    : '+'}
                </div>
                <p className="text-sm text-muted-foreground">
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
