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
      <DialogContent className="p-0 overflow-hidden border-none max-w-md md:max-w-lg w-[95vw] rounded-2xl">
        <div className="relative overflow-hidden bg-gradient-ninja-dark">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 z-10 transition-colors"
            aria-label="Close promotion popup"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Image (if provided) */}
          {imageUrl && (
            <div className="w-full h-40 md:h-48 relative">
              <Image
                src={imageUrl}
                alt="Promotional offer"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 95vw, 500px"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ninja-navy/90 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className={`p-6 ${imageUrl ? '-mt-12 relative z-[1]' : ''}`}>
            <div className="py-4 space-y-4">
              <div className="inline-block px-3 py-1 bg-ninja-gold/20 text-ninja-gold rounded-full text-sm font-medium">
                Special Offer
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h2>

              <p className="text-slate-300">{description}</p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href={buttonLink} className="flex-1">
                  <Button className="w-full bg-gradient-ninja-primary hover:bg-gradient-ninja-reverse text-ninja-navy font-semibold py-2.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                    {buttonText} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="border-white/20 text-white hover:text-white bg-white/30 hover:bg-white/10"
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
