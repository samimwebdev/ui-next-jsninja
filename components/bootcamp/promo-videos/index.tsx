'use client'
import { CardHoverEffect } from './card-hover-effect'
import { Play } from 'lucide-react'
import Image from 'next/image'

import { DemoVideosLayoutContentSection } from '@/types/bootcamp-page-types'

import { useVideo } from '@/components/context/video-provider'
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils'

export const PromoVideos: React.FC<{
  data: DemoVideosLayoutContentSection
}> = ({ data }) => {
  const { openVideo } = useVideo()

  return (
    <section className="relative max-w-screen-xl mx-auto flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 bg-background text-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 dark:opacity-10"></div>

      <div className="relative z-10 w-full">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl mb-3 sm:mb-4 font-black leading-tight tracking-tight">
            {data.title}
          </h2>
          <p className="text-muted-foreground max-w-3xl text-center mx-auto text-sm sm:text-base px-4">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-screen-xl mx-auto">
          {data.videos.map((video) => (
            <CardHoverEffect key={video.id} className="group">
              <div
                className="relative aspect-video cursor-pointer overflow-hidden rounded-xl"
                onClick={() => openVideo(video.videoURL)}
              >
                <Image
                  src={
                    getYouTubeThumbnail(extractYouTubeId(video.videoURL)) ||
                    '/images/placeholder.svg'
                  }
                  alt={video.title}
                  width={2000}
                  height={500}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">
                    {video.shortDescription}
                  </p>
                </div>
              </div>
            </CardHoverEffect>
          ))}
        </div>
      </div>
    </section>
  )
}
