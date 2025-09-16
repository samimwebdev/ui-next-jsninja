'use client'

import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
}

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl,
}: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Determine video type and get appropriate embed URL
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

  const getEmbedUrl = (url: string) => {
    const videoType = getVideoType(url)

    switch (videoType) {
      case 'youtube':
        const youtubeRegExp =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const youtubeMatch = url.match(youtubeRegExp)
        if (youtubeMatch && youtubeMatch[2].length === 11) {
          return `https://www.youtube.com/embed/${youtubeMatch[2]}?autoplay=1&rel=0`
        }
        return url

      case 'vimeo':
        const vimeoRegExp = /vimeo.com\/(\d+)/
        const vimeoMatch = url.match(vimeoRegExp)
        if (vimeoMatch) {
          return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
        }
        return url

      case 'iframe':
        return url

      default:
        return url
    }
  }

  const renderVideoContent = () => {
    const videoType = getVideoType(videoUrl)
    const embedUrl = getEmbedUrl(videoUrl)

    if (videoType === 'direct') {
      return (
        <video className="w-full h-full" controls autoPlay playsInline>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    }

    return (
      <div style={{ position: 'relative', aspectRatio: '24/13' }}>
        <iframe
          src={embedUrl}
          className="w-full h-full"
          style={{
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
          }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video Player"
        />
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>

        {renderVideoContent()}
      </div>
    </div>
  )
}

// https://play.gumlet.io/embed/68936c007afab80a3ee00e03?background=false&autoplay=false&loop=false&disableControls=false

// ;<div style="position:relative;aspect-ratio:24/13;">
//   <iframe
//     loading="lazy"
//     title="Gumlet video player"
//     src="https://play.gumlet.io/embed/68936c007afab80a3ee00e03?background=false&autoplay=false&loop=false&disableControls=false"
//     style="border:none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
//     allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
//   ></iframe>
// </div>
