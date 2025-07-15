'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CirclePlay, PlayCircle } from 'lucide-react'
import React, { useState } from 'react'
import VideoModal from '../bootcamp/video-modal'

export const CourseHero = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const videoUrl = 'https://v0.blob.com/demo-video.mp4'
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
            Updated On 15/06/2024
          </Badge>
          <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight">
            Frontend Ninja: Master React & Next.js Development
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            Become a frontend development expert with our comprehensive course.
            Learn modern React, Next.js, and UI frameworks to build stunning,
            responsive web applications from scratch.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Button size="lg" className="rounded-full text-base">
              Enroll Now <ArrowUpRight className="!h-5 !w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <CirclePlay className="!h-5 !w-5" /> Watch Preview
            </Button>
          </div>
        </div>
        <div>
          <div
            className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden cursor-pointer group animate-fade-in-scale"
            onClick={() => setIsVideoModalOpen(true)}
          >
            <video
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={videoUrl}
        />
      </div>
    </div>
  )
}
