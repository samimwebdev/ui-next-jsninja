'use client'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-black">
        <DialogHeader>
          <DialogTitle className="sr-only">Video Player</DialogTitle>
        </DialogHeader>
        <div className="aspect-video relative">
          <video className="w-full h-full" controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  )
}
