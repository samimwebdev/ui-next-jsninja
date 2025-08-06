'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Maximize2 } from 'lucide-react'
import { CurrentContent } from '@/types/course-view-types'

interface TextContentProps {
  currentContent: CurrentContent
}

export function TextContent({ currentContent }: TextContentProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <>
      <div className="aspect-video bg-muted flex items-start p-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold mb-4">
                {currentContent.title}
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <p
                  className="whitespace-pre-line text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: currentContent.content }}
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0"
              onClick={() => setIsDialogOpen(true)}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Full View
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{currentContent.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full">
            <div className="pr-4">
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-line">
                  <p
                    className="whitespace-pre-line text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: currentContent.content }}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
