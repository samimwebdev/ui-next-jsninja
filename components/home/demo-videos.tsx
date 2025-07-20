'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface Video {
  id: number
  title: string
  shortDescription: string
  videoURL: string
}

interface BrowseVideosBtn {
  id: number
  btnLabel: string
  btnIcon: {
    iconName: string
    iconData: string
    width: number
    height: number
  }
  btnLink: string
}

interface DemoVideosProps {
  data: {
    title: string
    description: string
    video: Video[]
    browseVideosBtn: BrowseVideosBtn
  }
}

const extractYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}

const generateThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export const DemoVideos: React.FC<DemoVideosProps> = ({ data }) => {
  const [activeVideo, setActiveVideo] = useState(
    data.video.length > 0 ? extractYouTubeId(data.video[0].videoURL) : ''
  )

  const videosWithThumbnails = data.video.map((video) => ({
    ...video,
    embedId: extractYouTubeId(video.videoURL),
    thumbnail: generateThumbnail(extractYouTubeId(video.videoURL)),
  }))

  return (
    <div className="max-w-screen-xl bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4 text-center mb-12">
          <Badge variant="secondary" className="px-4 py-1">
            Demo Videos
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">{data.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Main Video Player */}
          <div className="relative aspect-video bg-muted rounded-xl overflow-hidden shadow-xl mt-4">
            {activeVideo ? (
              <iframe
                key={activeVideo}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No video selected</p>
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
                {videosWithThumbnails.map((video) => (
                  <CarouselItem
                    key={video.id}
                    className="md:basis-1/2 lg:basis-1/2"
                  >
                    <div
                      className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 ${
                        activeVideo === video.embedId
                          ? 'ring-2 ring-primary'
                          : 'hover:ring-2 hover:ring-primary/50'
                      }`}
                      onClick={() => setActiveVideo(video.embedId)}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-12 h-12 text-white" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-sm font-medium text-white line-clamp-2">
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

            {/* Second row of videos */}
            {videosWithThumbnails.length > 2 && (
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full mt-6"
              >
                <CarouselContent>
                  {videosWithThumbnails.slice(2).map((video) => (
                    <CarouselItem
                      key={video.id}
                      className="md:basis-1/2 lg:basis-1/2"
                    >
                      <div
                        className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 ${
                          activeVideo === video.embedId
                            ? 'ring-2 ring-primary'
                            : 'hover:ring-2 hover:ring-primary/50'
                        }`}
                        onClick={() => setActiveVideo(video.embedId)}
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-12 h-12 text-white" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-sm font-medium text-white line-clamp-2">
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

            {/* Browse Videos Button */}
            {data.browseVideosBtn && (
              <div className="flex justify-center mt-8">
                <Button asChild className="group">
                  <Link href={data.browseVideosBtn.btnLink}>
                    <div
                      className="w-4 h-4 mr-2"
                      dangerouslySetInnerHTML={{
                        __html: data.browseVideosBtn.btnIcon.iconData,
                      }}
                    />
                    {data.browseVideosBtn.btnLabel}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
