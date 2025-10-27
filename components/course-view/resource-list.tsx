'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ExternalLink, FileText } from 'lucide-react'
import type { Resource } from '@/types/course-view-types'

interface ResourceListProps {
  resources: Resource[]
}

export function ResourceList({ resources }: ResourceListProps) {
  // const handleDownload = (url: string, title: string) => {
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.download = title
  //   link.target = '_blank'
  //   link.rel = 'noopener noreferrer'
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }

  return (
    <div className="space-y-3 sm:space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm sm:text-base break-words">
                  {resource.title}
                </h4>
                {resource.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                    {resource.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0 self-end sm:self-auto">
              {/* {resource.downloadUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownload(resource.downloadUrl, resource.title)
                  }
                  className="text-xs sm:text-sm"
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                  <span className="hidden sm:inline">Download</span>
                  <span className="sm:hidden">Get</span>
                </Button>
              )} */}
              {resource.url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs sm:text-sm"
                >
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                    <span className="hidden sm:inline">Open</span>
                    <span className="sm:hidden">Link</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
