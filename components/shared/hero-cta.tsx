'use client'

import { CTAButtons } from './cta-buttons'
import { useVideo } from '../context/video-provider'

interface HeroCTAProps {
  primaryBtnLink: string
  videoUrl: string
}

export function HeroCTA({ primaryBtnLink, videoUrl }: HeroCTAProps) {
  const { openVideo } = useVideo()

  return (
    <CTAButtons
      primaryButtonLink={primaryBtnLink}
      className="mt-8"
      isSecondaryBtn={true}
      onPreviewClick={() => {
        openVideo(videoUrl)
      }}
      primaryButtonVariant="default"
      secondaryButtonVariant="outline"
    />
  )
}
