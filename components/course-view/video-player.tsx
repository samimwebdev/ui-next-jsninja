'use client'

import React, { useMemo, useRef } from 'react'
import { useVideoProgress } from '@/hooks/useVideoProgress'
import { CurrentContent } from '@/types/course-view-types'

// Detect video source type from iframe HTML or URL
const getVideoSourceType = (
  videoUrl: string
):
  | 'youtube'
  | 'vimeo'
  | 'bunny'
  | 'gumlet'
  | 'direct'
  | 'iframe'
  | 'unknown' => {
  if (!videoUrl) return 'unknown'

  // Check if it's an iframe HTML
  if (videoUrl.includes('<iframe')) {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))
      return 'youtube'
    if (videoUrl.includes('vimeo.com')) return 'vimeo'
    if (
      videoUrl.includes('mediadelivery.net') ||
      videoUrl.includes('bunnycdn.com')
    )
      return 'bunny'
    if (videoUrl.includes('gumlet.io')) return 'gumlet'
    return 'iframe' // Generic iframe
  }

  // Check if it's a direct URL
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))
    return 'youtube'
  if (videoUrl.includes('vimeo.com')) return 'vimeo'
  if (
    videoUrl.includes('mediadelivery.net') ||
    videoUrl.includes('bunnycdn.com')
  )
    return 'bunny'
  if (videoUrl.includes('gumlet.io')) return 'gumlet'
  if (
    videoUrl.includes('.mp4') ||
    videoUrl.includes('.webm') ||
    videoUrl.includes('.ogg')
  )
    return 'direct'

  return 'unknown'
}

// Add signed URL to Bunny iframe
const addSignedUrlToBunnyIframe = (
  iframeHtml: string,
  signedUrl?: string
): string => {
  if (!signedUrl) return iframeHtml

  // Replace the src attribute with the signed URL
  return iframeHtml.replace(/src\s*=\s*["']([^"']+)["']/i, `src="${signedUrl}"`)
}

const extractIframeProps = (iframeHtml: string) => {
  const srcMatch = iframeHtml.match(/src\s*=\s*["']([^"']+)["']/i)
  const titleMatch = iframeHtml.match(/title\s*=\s*["']([^"']+)["']/i)
  const allowMatch = iframeHtml.match(/allow\s*=\s*["']([^"']+)["']/i)
  const styleMatch = iframeHtml.match(/style\s*=\s*["']([^"']+)["']/i)

  return {
    src: srcMatch?.[1],
    title: titleMatch?.[1] || 'Video Player',
    allow:
      allowMatch?.[1] ||
      'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;',
    style: styleMatch?.[1],
  }
}

export const VideoPlayer = ({
  currentContent,
}: {
  currentContent: CurrentContent
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const videoContent = useMemo(() => {
    const url = currentContent?.videoUrl || ''
    const type = getVideoSourceType(url)

    if (type === 'direct') {
      return { type: 'direct', src: url }
    }

    if (url.includes('<iframe')) {
      const props = extractIframeProps(url)
      // Use signed URL for Bunny if available
      if (type === 'bunny' && currentContent?.signedUrl) {
        props.src = currentContent.signedUrl
      }
      return { type: 'iframe', ...props }
    }

    // Plain URL - treat as iframe src
    return {
      type: 'iframe',
      src: url,
      title: 'Video Player',
      allow:
        'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;',
    }
  }, [currentContent])

  useVideoProgress(iframeRef, {
    lectureId: String(currentContent.lessonId ?? ''),
    userId: String(currentContent.userId ?? '123'), // Replace with actual user ID
    updateInterval: 15000,
    completionThreshold: 95,
  })

  if (!videoContent.src) {
    return (
      <div className="flex items-center justify-center aspect-video bg-muted rounded-lg mb-6">
        <div className="text-center">
          <p className="text-muted-foreground">No video source available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      {videoContent.type === 'direct' ? (
        <video
          className="w-full aspect-video rounded-lg bg-black"
          controls
          playsInline
        >
          <source src={videoContent.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div style={{ position: 'relative', aspectRatio: '16/9' }}>
          <iframe
            ref={iframeRef}
            loading="lazy"
            src={videoContent.src}
            title={videoContent.title}
            style={{
              border: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              ...parseInlineStyle(videoContent.style),
            }}
            allow={videoContent.allow}
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}

// Helper to parse inline CSS string to object
function parseInlineStyle(styleString?: string): React.CSSProperties {
  if (!styleString) return {}

  const styles: React.CSSProperties = {}
  styleString.split(';').forEach((rule) => {
    const [property, value] = rule.split(':').map((s) => s.trim())
    if (property && value) {
      const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      )
      styles[camelCaseProperty as keyof React.CSSProperties] = value
    }
  })

  return styles
}
