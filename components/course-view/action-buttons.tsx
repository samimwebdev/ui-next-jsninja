'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LucideIcon } from 'lucide-react'
import { useState } from 'react'

interface ActionButton {
  label: string
  active: boolean
  content: string | undefined
  icon: LucideIcon
}

interface ActionButtonsProps {
  actionButtons: ActionButton[]
}

export function ActionButtons({ actionButtons }: ActionButtonsProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 py-4">
      {actionButtons.map((button) =>
        button.active ? (
          <Dialog
            key={button.label}
            open={openDialog === button.label}
            onOpenChange={(open) => setOpenDialog(open ? button.label : null)}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial min-w-[120px] text-xs sm:text-sm"
              >
                <button.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="truncate">{button.label}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto w-[95vw] sm:w-full">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <button.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  {button.label}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {button.label} information and details
                </DialogDescription>
              </DialogHeader>
              <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
                <div
                  className="text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: button.content || '' }}
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : null
      )}
    </div>
  )
}
