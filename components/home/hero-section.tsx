import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import React from 'react'
import { HeroMarquee } from './hero-marquee'

interface HeroSectionProps {
  data: {
    shortLabel: string
    title: string
    shortDescription: string
    promoVideo: string
    courses: Array<{
      id: number
      title: string
      totalStudents: number
    }>
  }
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const handleVideoClick = () => {
    if (data.promoVideo) {
      window.open(data.promoVideo, '_blank')
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
            {data.shortLabel}
          </Badge>
          <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight">
            {data.title}
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            {data.shortDescription}
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Button size="lg" className="rounded-full text-base">
              Browse Courses <ArrowUpRight className="!h-5 !w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
              onClick={handleVideoClick}
            >
              <CirclePlay className="!h-5 !w-5" /> Watch Demo
            </Button>
          </div>
          <div className="pt-4 flex items-center gap-4 animate-in slide-in-from-left duration-700 delay-400">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background bg-primary/10"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Join{' '}
              {data.courses?.reduce(
                (total, course) => total + course.totalStudents,
                0
              ) || 10000}
              + developers who have elevated their skills
            </p>
          </div>
        </div>
        <HeroMarquee />
      </div>
    </div>
  )
}
