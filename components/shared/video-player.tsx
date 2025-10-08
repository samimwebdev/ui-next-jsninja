'use client'

import { PlayCircle } from 'lucide-react'
import { useVideo } from '@/components/context/video-provider'
import Image from 'next/image'

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
    wide: 'aspect-[24/13]',
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
              <Image
                priority
                src={thumbnail}
                alt="Video thumbnail"
                width={600}
                height={300}
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
              <Image
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
          {/* Multiple glow layers */}
          <div className="absolute">
            {/* Outer expanding ring */}
            <div className="w-32 h-32 rounded-full border border-white/10 animate-ping absolute -top-8 -left-8"></div>

            {/* Middle glow circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl animate-pulse absolute -top-4 -left-4"></div>

            {/* Inner glow circle */}
            <div className="w-20 h-20 rounded-full bg-white/10 blur-lg animate-pulse absolute -top-2 -left-2"></div>
          </div>

          {/* Main play button container */}
          <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
            {/* Button background glow */}
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400/40 via-blue-500/40 to-purple-600/40 blur-xl animate-pulse group-hover:from-cyan-400/60 group-hover:via-blue-500/60 group-hover:to-purple-600/60"></div>

            {/* Sharp inner glow */}
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-white/20 blur-sm animate-pulse"></div>

            {/* Play button */}
            <PlayCircle className="relative w-16 h-16 text-white opacity-90 group-hover:opacity-100 transition-all duration-300 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />

            {/* Center highlight dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  )
}
