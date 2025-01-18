'use client'
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

const videos = [
  {
    id: 'video1',
    title: 'JavaScript Fundamentals',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    duration: '12:34',
    views: '2.5k',
    embedId: 'PkZNo7MFNFg',
  },
  {
    id: 'video2',
    title: 'NPM Crash Course',
    thumbnail:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800',
    duration: '15:21',
    views: '1.8k',
    embedId: 'jHDhaSSKmB0',
  },
  {
    id: 'video3',
    title: 'Node.js Introduction',
    thumbnail:
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&q=80&w=800',
    duration: '18:45',
    views: '3.2k',
    embedId: 'TlB_eWDSMt4',
  },
  {
    id: 'video4',
    title: 'React Hooks Deep Dive',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&q=80&w=800',
    duration: '20:15',
    views: '4.1k',
    embedId: 'TNhaISOUy6Q',
  },
]

export const DemoVideos = () => {
  const [activeVideo, setActiveVideo] = useState(videos[0].embedId)

  return (
    <div className=" max-w-screen-xl  bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4 text-center mb-12">
          <Badge variant="secondary" className="px-4 py-1">
            Demo Videos
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight">
            Actions Speak Louder Than Words
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Main Video Player */}
          <div className="relative aspect-video bg-muted rounded-xl overflow-hidden shadow-xl mt-4">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
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
                {videos.map((video) => (
                  <CarouselItem
                    key={video.id}
                    className="md:basis-1/2 lg:basis-1/2"
                  >
                    <div
                      className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer transition-all duration-300  ${
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
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
                            {video.duration}
                          </span>
                          <span className="text-xs text-white/80">
                            {video.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="mt-10">
                {videos.map((video) => (
                  <CarouselItem
                    key={video.id}
                    className="md:basis-1/2 lg:basis-1/2"
                  >
                    <div
                      className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 ${
                        activeVideo === video.embedId
                          ? 'ring-3 ring-primary'
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
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
                            {video.duration}
                          </span>
                          <span className="text-xs text-white/80">
                            {video.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  )
}
