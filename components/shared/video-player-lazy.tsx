'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load the VideoPlayer component
const VideoPlayer = dynamic(
  () => import('./video-player').then((mod) => ({ default: mod.VideoPlayer })),
  {
    ssr: false, // Disable SSR since it has client-side interactions
    loading: () => <VideoPlayerSkeleton />,
  }
)

// Loading skeleton component that matches the video player aspect ratios
const VideoPlayerSkeleton = ({
  aspectRatio = 'video',
  className = '',
}: {
  aspectRatio?: 'video' | 'square' | 'wide'
  className?: string
}) => {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  }

  return (
    <div
      className={`relative ${aspectClasses[aspectRatio]} bg-gray-900 rounded-xl overflow-hidden ${className}`}
    >
      <Skeleton className="w-full h-full" />

      {/* Play button skeleton */}
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div> */}
    </div>
  )
}

interface VideoPlayerLazyProps {
  videoUrl: string
  posterImage?: string
  className?: string
  aspectRatio?: 'video' | 'square' | 'wide'
  autoPlay?: boolean
  showPlayButton?: boolean
  dataAttribute?: string
}

export const VideoPlayerLazy: React.FC<VideoPlayerLazyProps> = (props) => {
  return <VideoPlayer {...props} />
}

// Export the skeleton separately for use in other components
export { VideoPlayerSkeleton }
