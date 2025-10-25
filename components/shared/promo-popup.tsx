'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'

interface PromoPopupProps {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  imageUrl?: string | null
}

export function PromoPopup({
  title,
  description,
  buttonText,
  buttonLink,
  imageUrl,
}: PromoPopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if the popup has been shown in this session
    const hasShownPopup = sessionStorage.getItem('promoPopupShown')

    if (!hasShownPopup) {
      // Wait a moment before showing the popup (better UX)
      const timer = setTimeout(() => {
        setIsOpen(true)
        // Mark as shown for this session
        sessionStorage.setItem('promoPopupShown', 'true')
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogContent className="p-0 overflow-hidden border-none max-w-[90vw] sm:max-w-md md:max-w-lg w-full rounded-xl sm:rounded-2xl">
        <div className="relative overflow-hidden bg-gradient-ninja-dark">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-black/30 text-white hover:bg-black/50 z-10 transition-colors"
            aria-label="Close promotion popup"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Image (if provided) */}
          {imageUrl && (
            <div className="w-full h-32 sm:h-40 md:h-48 relative">
              <Image
                src={imageUrl}
                alt="Promotional offer"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 448px, 512px"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ninja-navy/90 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div
            className={`p-4 sm:p-6 ${
              imageUrl ? '-mt-8 sm:-mt-12 relative z-[1]' : ''
            }`}
          >
            <div className="py-3 sm:py-4 space-y-3 sm:space-y-4">
              {/* Badge */}
              <div className="inline-block px-2.5 sm:px-3 py-1 bg-ninja-gold/20 text-ninja-gold rounded-full text-xs sm:text-sm font-medium">
                Special Offer
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                {title}
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:gap-4 pt-2">
                <Link href={buttonLink} className="w-full">
                  <Button className="w-full bg-gradient-ninja-primary hover:bg-gradient-ninja-reverse text-ninja-navy font-semibold py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                    {buttonText} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="w-full border-white/20 text-white hover:text-white bg-white/30 hover:bg-white/10 py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  Maybe later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
