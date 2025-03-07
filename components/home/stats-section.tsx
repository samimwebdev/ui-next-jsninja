'use client'
import { Card } from '@/components/ui/card'
import { Database, Eye, Gauge, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const StatsSection = () => {
  const [isInView, setIsInView] = useState(false)
  const [counts, setCounts] = useState({
    dataEfficiency: 0,
    conversionRate: 0,
    aiScale: 0,
    totalUsers: 0,
  })
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
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const targets = {
      dataEfficiency: 420,
      conversionRate: 708,
      aiScale: 1820,
      totalUsers: 3230,
    }

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounts({
        dataEfficiency: Math.round(targets.dataEfficiency * progress),
        conversionRate: Math.round(targets.conversionRate * progress),
        aiScale: Math.round(targets.aiScale * progress),
        totalUsers: Math.round(targets.totalUsers * progress),
      })

      if (step === steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isInView])
  return (
    <div ref={sectionRef} className="w-full space-y-8 py-12 px-2">
      <Card className="mx-auto max-w-screen-xl p-8 rounded-3xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Let&apos;s build something great.
            </h2>
            <p className="text-muted-foreground">
              Enim sed faucibus turpis in eu mi bibendum neque egestas. Mi
              bibendum neque egestas congue quisque egestas diam in arcu. Elit
              pellentesque habitant.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <div className="text-3xl font-bold">{counts.dataEfficiency}%</div>
              <p className="text-sm text-muted-foreground">Data Efficiency</p>
            </div>
            <div className="space-y-2">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div className="text-3xl font-bold">{counts.conversionRate}+</div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
            <div className="space-y-2">
              <Gauge className="h-5 w-5 text-muted-foreground" />
              <div className="text-3xl font-bold">
                {(counts.aiScale / 1000).toFixed(2)}M
              </div>
              <p className="text-sm text-muted-foreground">AI LLM Scale</p>
            </div>
            <div className="space-y-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="text-3xl font-bold">
                {(counts.totalUsers / 1000).toFixed(2)}K
              </div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
