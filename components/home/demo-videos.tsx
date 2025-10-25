'use client'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'

import { PlayCircle } from 'lucide-react'
import { useState } from 'react'

import { VideoSectionData } from '@/types/home-page-types'
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils'

export const DemoVideos: React.FC<{ data: VideoSectionData }> = ({
  data: videoSectionData,
}) => {
  const videosWithData = videoSectionData.videos.map((video) => ({
    ...video,
    embedId: extractYouTubeId(video.videoURL),
    thumbnail: getYouTubeThumbnail(extractYouTubeId(video.videoURL)),
  }))

  const [activeVideo, setActiveVideo] = useState(
    videosWithData.length > 0 ? videosWithData[0].embedId : ''
  )

  return (
    <div className="max-w-screen-xl bg-background text-foreground w-full">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="space-y-4 text-center mb-8 sm:mb-12">
          <Badge variant="secondary" className="px-4 py-1">
            Demo Videos
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight px-4">
            {videoSectionData.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            {videoSectionData.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 items-start">
          {/* Main Video Player */}
          <div className="relative aspect-video bg-muted rounded-xl overflow-hidden shadow-xl">
            {activeVideo ? (
              <iframe
                key={activeVideo}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
                title="YouTube video player"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No video available</p>
              </div>
            )}
          </div>

          {/* Video Carousel */}
          <div className="relative">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {videosWithData.map((video) => (
                  <CarouselItem
                    key={video.id}
                    className="basis-full sm:basis-1/2"
                  >
                    <div
                      className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 ${
                        activeVideo === video.embedId
                          ? 'ring-2 ring-primary'
                          : 'hover:ring-2 hover:ring-primary/50'
                      }`}
                      onClick={() => setActiveVideo(video.embedId)}
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={480}
                        height={360}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = `https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-xs text-white/80 mt-1 line-clamp-1">
                          {video.shortDescription}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>

            {videosWithData.length > 2 && (
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full mt-4 sm:mt-6"
              >
                <CarouselContent>
                  {videosWithData.map((video) => (
                    <CarouselItem
                      key={`second-${video.id}`}
                      className="basis-full sm:basis-1/2"
                    >
                      <div
                        className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 ${
                          activeVideo === video.embedId
                            ? 'ring-2 ring-primary'
                            : 'hover:ring-2 hover:ring-primary/50'
                        }`}
                        onClick={() => setActiveVideo(video.embedId)}
                      >
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          width={480}
                          height={360}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = `https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                          <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-xs text-white/80 mt-1 line-clamp-1">
                            {video.shortDescription}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
