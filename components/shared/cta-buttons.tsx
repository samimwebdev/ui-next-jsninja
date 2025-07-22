'use client'

import { Button } from '@/components/ui/button'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CTAButtonsProps {
  primaryLabel?: string
  secondaryLabel?: string
  primaryButtonLink?: string
  onPreviewClick?: () => void
  className?: string
  variant?: 'default' | 'outline'
  primaryButtonVariant?: 'default' | 'outline'
  secondaryButtonVariant?: 'default' | 'outline'
  isSecondaryBtn?: boolean
  size?: 'sm' | 'default' | 'lg'
}

export function CTAButtons({
  primaryLabel = 'Enroll Now',
  secondaryLabel = 'Watch Preview',
  primaryButtonLink,
  onPreviewClick,
  className = '',
  primaryButtonVariant = 'default',
  secondaryButtonVariant = 'outline',
  isSecondaryBtn = false,
  size = 'lg',
}: CTAButtonsProps) {
  const router = useRouter()

  const handleEnrollClick = () => {
    if (primaryButtonLink) {
      router.push(primaryButtonLink)
    }
  }

  const handlePreviewClick = () => {
    if (onPreviewClick) {
      onPreviewClick()
    } else {
      // Default behavior - scroll to video
      const videoElement = document.querySelector('[data-video-player]')
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Button
        size={size}
        className="rounded-full text-base"
        onClick={handleEnrollClick}
        variant={primaryButtonVariant}
      >
        {primaryLabel} <ArrowUpRight className="!h-5 !w-5" />
      </Button>
      {isSecondaryBtn && (
        <Button
          variant={secondaryButtonVariant}
          size={size}
          className="rounded-full text-base shadow-none"
          onClick={handlePreviewClick}
        >
          <CirclePlay className="!h-5 !w-5" /> {secondaryLabel}
        </Button>
      )}
    </div>
  )
}
