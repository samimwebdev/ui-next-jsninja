'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CirclePlay, PlayCircle } from 'lucide-react'

import React, { useState } from 'react'
import VideoModal from './video-modal'
import Image from 'next/image'

export const BootcampHero = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const videoUrl = 'https://v0.blob.com/demo-video.mp4'
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
            Batch 8
          </Badge>
          <h1
            className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            Javascript Programming Bootcamp
          </h1>
          <p
            className="mt-6 max-w-[60ch] text-lg animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            Explore a collection of Shadcn UI blocks and components, ready to
            preview and copy. Streamline your development workflow with
            easy-to-implement examples.
          </p>
          <div
            className="mt-12 flex items-center gap-4 animate-fade-in-up 
            "
            style={{ animationDelay: '500ms' }}
          >
            <Button size="lg" className="rounded-full text-base ">
              Get Started{' '}
              <ArrowUpRight className="!h-5 !w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <CirclePlay className="!h-5 !w-5" /> Watch Demo
            </Button>
          </div>

          <div
            className="pt-8 border-white/10 animate-fade-in-up"
            style={{ animationDelay: '600ms' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <Image
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full border-2 border-black"
                    width={32}
                    height={32}
                  />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold">400+</span> students enrolled in the
                last 30 days
              </div>
            </div>
          </div>
        </div>

        {/* Video */}
        <div
          className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group animate-fade-in-scale"
          style={{ animationDelay: '400ms' }}
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
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={videoUrl}
        />
      </div>
    </div>
  )
}
