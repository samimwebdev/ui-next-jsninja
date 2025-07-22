'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlayCircle, Wallet2Icon } from 'lucide-react'

import React, { useState } from 'react'
import VideoModal from '../shared/video-modal'
import Image from 'next/image'
import BootcampAssessment from './bootcamp-assessment'
import BootcampShortFeature from './bootcamp-short-features'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/micro-animations'

export const BootcampHero = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const videoUrl = 'https://v0.blob.com/demo-video.mp4'

  // Define container variant for staggered children animations
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariant}
        >
          <motion.div variants={fadeInUp}>
            <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
              Batch 8
            </Badge>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight"
          >
            Javascript Programming Bootcamp
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-6 max-w-[60ch] text-lg">
            Explore a collection of Shadcn UI blocks and components, ready to
            preview and copy. Streamline your development workflow with
            easy-to-implement examples.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex items-center gap-4"
          >
            <Button size="lg" className="rounded-full text-base">
              <Wallet2Icon className="!h-5 !w-5 transition-transform group-hover:translate-x-1" />
              3000Tk | Enroll Now
            </Button>
            <BootcampAssessment />
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-8 border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
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
              <div className="text-sm">
                <span className="font-bold">400+</span> students enrolled in the
                last 30 days
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Video */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <BootcampShortFeature />
          </motion.div>
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
