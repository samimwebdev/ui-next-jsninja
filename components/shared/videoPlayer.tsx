import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
interface VideoPlayerProps {
  url: string
  onClose: () => void
}

export function VideoPlayer({ url, onClose }: VideoPlayerProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <VisuallyHidden>
        <DialogTitle>Hidden Dialog Title</DialogTitle>
      </VisuallyHidden>

      <DialogContent className="sm:max-w-[800px]">
        <video controls className="w-full aspect-video">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </DialogContent>
    </Dialog>
  )
}
