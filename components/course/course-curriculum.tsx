'use client'
import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Lock, PlayCircle, FileText } from 'lucide-react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Curriculum, Lesson } from '@/types/course-page-types'

export const CourseCurriculum: React.FC<{ data?: Curriculum }> = ({ data }) => {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string
    title: string
  } | null>(null)

  // Use data from API
  const modules = data?.modules || []
  const title = data?.title || 'কোর্সের পরিপূর্ণ কারিকুলাম'

  const handleLectureClick = (lecture: Lesson) => {
    if (lecture.isFree && lecture.type === 'Video' && lecture.videoUrl) {
      setSelectedVideo({
        url: lecture.videoUrl,
        title: lecture.title,
      })
    }
  }

  // Helper function to format duration (assuming it's in seconds)
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!modules.length) {
    return (
      <section id="curriculum" className="my-12">
        <h2 className="text-3xl font-bold tracking-tight mb-6">{title}</h2>
        <p className="text-muted-foreground">
          No curriculum available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section id="curriculum" className="my-12">
      <h2 className="text-3xl font-bold tracking-tight mb-6">{title}</h2>
      <Accordion type="single" collapsible className="mt-8 space-y-4">
        {modules.map((module, moduleIndex) => (
          <AccordionItem
            key={module.id}
            value={`module-${moduleIndex}`}
            className="bg-accent py-1 px-4 rounded-xl border-none"
          >
            <AccordionTrigger className="flex items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline text-start text-lg">
              {module.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y">
                {module.lessons?.map((lesson, lectureIndex) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLectureClick(lesson)}
                    className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                      lesson.isFree ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {lesson.type === 'Video' ? (
                        <PlayCircle className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-500" />
                      )}
                      <span>{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(lesson.duration)}
                      </span>
                      {lesson.isFree ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          ফ্রি ভিডিও
                        </span>
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <video
              controls
              className="w-full h-full rounded-lg"
              src={selectedVideo?.url}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
