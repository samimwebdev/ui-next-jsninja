'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import VideoModal from '@/components/shared/video-modal'

interface VideoContextType {
  openVideo: (videoUrl: string) => void
  closeVideo: () => void
  isVideoOpen: boolean
  currentVideo: string | null
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export function VideoProvider({ children }: { children: ReactNode }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)

  const openVideo = (videoUrl: string) => {
    setCurrentVideo(videoUrl)
    setIsVideoOpen(true)
  }

  const closeVideo = () => {
    setIsVideoOpen(false)
    setCurrentVideo(null)
  }

  return (
    <VideoContext.Provider
      value={{ openVideo, closeVideo, isVideoOpen, currentVideo }}
    >
      {children}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={closeVideo}
        videoUrl={currentVideo || ''}
      />
    </VideoContext.Provider>
  )
}

export function useVideo() {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider')
  }
  return context
}
