'use client'

import { CurrentContent } from '@/types/course-view-types'

interface VideoPlayerProps {
  currentContent: CurrentContent
}

export function VideoPlayer({ currentContent }: VideoPlayerProps) {
  return (
    <div className="aspect-video bg-black">
      <video
        key={currentContent.lessonId} // Force video reload when source changes
        className="h-full w-full"
        poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iRgtZAuF10taOZ9NwvdNIoxB3rUiSK.png"
        controls
      >
        <source src="#" type="video/mp4" />
      </video>
    </div>
  )
}
