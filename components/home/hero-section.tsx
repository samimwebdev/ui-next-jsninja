import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import React from 'react'
import { HeroMarquee } from './hero-marquee'

export const HeroSection = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
            Dev Courses
          </Badge>
          <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight">
            Elevate you Skill with Javascript Ninja
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            Explore a collection of Real World SKill that will help you to
            become a successful developer
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Button size="lg" className="rounded-full text-base">
              Browse Courses <ArrowUpRight className="!h-5 !w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
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
              Join 10,000+ developers who have elevated their skills
            </p>
          </div>
        </div>
        <HeroMarquee />
      </div>
    </div>
  )
}
