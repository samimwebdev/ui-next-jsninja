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
import type { CurrentContent } from './types/course'

interface TextContentProps {
  currentContent: CurrentContent
}
/* eslint-disable @typescript-eslint/no-unused-vars */
export function TextContent({ currentContent }: TextContentProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const content = {
    title: 'Section 3: Synthetic Events',
    description: `React wraps native browser events in SyntheticEvent objects. These provide a consistent interface across different browsers.

Key benefits of Synthetic Events:
• Cross-browser compatibility
• Improved performance through event pooling
• Consistent behavior across different browsers
• Access to native event through nativeEvent property`,
    fullContent: `React wraps native browser events in SyntheticEvent objects. These provide a consistent interface across different browsers. Understanding how synthetic events work is crucial for building robust React applications.

Key benefits of Synthetic Events:
• Cross-browser compatibility
• Improved performance through event pooling
• Consistent behavior across different browsers
• Access to native event through nativeEvent property

Example usage:
function handleClick(event) {
  // Access the synthetic event properties
  console.log(event.type); // "click"
  console.log(event.target); // DOM element
  
  // Access the native event if needed
  const nativeEvent = event.nativeEvent;
  
  // Prevent default behavior
  event.preventDefault();
  
  // Stop propagation
  event.stopPropagation();
}

Common Synthetic Event Properties:
• event.type - The type of event (e.g., "click", "change")
• event.target - The DOM element that triggered the event
• event.currentTarget - The DOM element that the event handler is attached to
• event.preventDefault() - Prevents default browser behavior
• event.stopPropagation() - Stops event bubbling
• event.nativeEvent - Access to the underlying native browser event

Best Practices:
1. Always use synthetic events instead of native events for consistency
2. Be cautious with event pooling in older React versions
3. Clean up event listeners in useEffect cleanup functions
4. Use event delegation when handling events on multiple elements
5. Consider performance implications when adding many event listeners`,
  }

  return (
    <>
      <div className="aspect-video bg-muted flex items-start p-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold mb-4">{content.title}</h1>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-muted-foreground">
                  {content.description}
                </p>
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
            <DialogTitle>{content.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full">
            <div className="pr-4">
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-line">{content.fullContent}</div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
