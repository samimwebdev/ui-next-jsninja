'use client'

import { PlayCircle } from 'lucide-react'
import { useVideo } from '@/components/context/video-provider'

interface VideoPlayerProps {
  videoUrl: string
  posterImage?: string
  className?: string
  aspectRatio?: 'video' | 'square' | 'wide'
  autoPlay?: boolean
  showPlayButton?: boolean
  dataAttribute?: string
}

export function VideoPlayer({
  videoUrl,
  posterImage,
  className = '',
  aspectRatio = 'video',
  autoPlay = true,
  showPlayButton = true,
  dataAttribute = 'video-player',
}: VideoPlayerProps) {
  const { openVideo } = useVideo()

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  }

  // Determine video type
  const getVideoType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube'
    }
    if (url.includes('vimeo.com')) {
      return 'vimeo'
    }
    if (url.includes('iframe') || url.includes('embed')) {
      return 'iframe'
    }
    return 'direct'
  }

  const videoType = getVideoType(videoUrl)

  // Get thumbnail for YouTube videos
  const getYouTubeThumbnail = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`
    }
    return posterImage
  }

  const renderVideoPreview = () => {
    const thumbnail =
      videoType === 'youtube' ? getYouTubeThumbnail(videoUrl) : posterImage

    switch (videoType) {
      case 'youtube':
      case 'vimeo':
      case 'iframe':
        return (
          <div className="w-full h-full bg-gray-900">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-white opacity-50" />
              </div>
            )}
          </div>
        )

      default: // direct video
        return (
          <>
            {posterImage ? (
              <img
                src={posterImage}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay={autoPlay}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </>
        )
    }
  }

  return (
    <div
      data-video-player={dataAttribute}
      className={`relative ${aspectClasses[aspectRatio]} bg-gray-900 rounded-xl overflow-hidden cursor-pointer group animate-fade-in-scale ${className}`}
      onClick={() => openVideo(videoUrl)}
    >
      {renderVideoPreview()}

      {showPlayButton && (
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
    </div>
  )
}
