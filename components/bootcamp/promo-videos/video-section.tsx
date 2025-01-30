'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { CardHoverEffect } from './card-hover-effect'
import { Play } from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Brand Story',
    description: "Discover how we're changing the game",
    thumbnail:
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'Product Features',
    description: 'See our latest innovations in action',
    thumbnail:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '3',
    title: 'Customer Success',
    description: 'Real stories from real customers',
    thumbnail:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2000',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '4',
    title: 'Behind the Scenes',
    description: 'Meet the team building the future',
    thumbnail:
      'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2000',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
]

export default function VideoSection() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  return (
    <section className="relative py-20 bg-background text-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 dark:opacity-10"></div>

      <div className="container relative z-10">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-4">Our Story in Motion</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover our journey through carefully crafted videos that
              showcase our vision, products, and the people behind them.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videos.map((video) => (
            <CardHoverEffect key={video.id} className="group">
              <div
                className="relative aspect-video cursor-pointer overflow-hidden rounded-xl"
                onClick={() => setSelectedVideo(video)}
              >
                <img
                  src={video.thumbnail || '/placeholder.svg'}
                  alt={video.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{video.description}</p>
                </div>
              </div>
            </CardHoverEffect>
          ))}
        </div>
      </div>

      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="sm:max-w-[80vw] h-[80vh] p-0">
          {selectedVideo && (
            <iframe
              src={selectedVideo.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
