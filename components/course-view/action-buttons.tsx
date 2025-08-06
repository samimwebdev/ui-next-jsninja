'use client'
import type { ActionButton } from './types/course'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface ActionButtonsProps {
  actionButtons: ActionButton[]
}

export function ActionButtons({ actionButtons }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2 p-4 border-b">
      {actionButtons.map((action, index) => {
        const IconComponent = action.icon // Extract the icon component

        return (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-1 items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {action.label}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{action.label}</DialogTitle>
                <DialogDescription
                  dangerouslySetInnerHTML={{ __html: action.content }}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )
      })}
    </div>
  )
}
