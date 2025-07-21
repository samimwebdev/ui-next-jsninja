'use client'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import React from 'react'
import { HeroMarquee } from './hero-marquee'
import { HeroSectionData } from '@/types/home-page-types'
import Image from 'next/image'

export const HeroSection: React.FC<{ data: HeroSectionData }> = ({
  data: heroSectionData,
}) => {
  const handleVideoClick = () => {
    if (heroSectionData.promoVideo) {
      window.open(heroSectionData.promoVideo, '_blank')
    }
  }

  // Ensure courses is always an array
  const courses =
    Array.isArray(heroSectionData.courses) || heroSectionData.courses === null
      ? heroSectionData.courses
      : [heroSectionData.courses]

  // Calculate total students safely
  const totalStudents =
    courses?.reduce(
      (total, course) => total + (course.totalStudents || 0),
      0
    ) || 10000

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
            {heroSectionData.shortLabel}
          </Badge>
          <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight">
            {heroSectionData.title}
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            {heroSectionData.shortDescription}
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Image
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full border-2 border-black"
                    width={32}
                    height={32}
                  />
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Join {totalStudents.toLocaleString()}+ developers who have
              elevated their skills
            </p>
          </div>
        </div>
        <HeroMarquee data={courses} />
      </div>
    </div>
  )
}
