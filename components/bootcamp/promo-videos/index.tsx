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
  // const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)

  return (
    <section className="relative flex flex-col items-center py-12 bg-background text-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 dark:opacity-10"></div>

      <div className="relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-4xl mb-4 font-black leading-tight tracking-tight">
            {data.title}
          </h2>
          <p className="text-muted-foreground max-w-3xl text-center mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-screen-xl mx-auto">
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
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {video.shortDescription}
                  </p>
                </div>
              </div>
            </CardHoverEffect>
          ))}
        </div>
      </div>
      {/* {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo.videoURL}
          className="w-full h-full"
          aspectRatio="video"
          showPlayButton={false}
          dataAttribute="promo-video-player"
        />
      )} */}

      {/* <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-[70vw] h-[90vh] p-0 overflow-hidden bg-background">
          <div className="flex flex-col h-full">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="text-2xl font-semibold mb-2">
                {selectedVideo?.title}
              </DialogTitle>
              <p className="text-muted-foreground">
                {selectedVideo?.shortDescription}
              </p>
            </DialogHeader>
            <div className="flex-1 relative w-full p-6">
              {selectedVideo && (
                <iframe
                  src={getEmbedUrl(selectedVideo.videoURL)}
                  className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </section>
  )
}
