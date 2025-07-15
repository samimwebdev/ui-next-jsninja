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

const courseModules = [
  {
    title: 'Getting Started with React',
    lectures: [
      {
        title: 'Welcome to Frontend Ninja',
        type: 'video',
        duration: '5:30',
        isFree: true,
        videoUrl: '/lecture1.mp4',
      },
      {
        title: 'Setting Up Your Development Environment',
        type: 'text',
        duration: '10:00',
        isFree: true,
      },
      {
        title: 'React Fundamentals & JSX',
        type: 'video',
        duration: '15:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'React Hooks & State Management',
    lectures: [
      {
        title: 'Understanding useState and useEffect',
        type: 'video',
        duration: '20:00',
        isFree: true,
        videoUrl: '/react-hooks.mp4',
      },
      {
        title: 'Custom Hooks for Reusable Logic',
        type: 'video',
        duration: '18:00',
        isFree: false,
      },
      {
        title: 'Global State with Context API',
        type: 'video',
        duration: '25:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'Next.js Fundamentals',
    lectures: [
      {
        title: 'Introduction to Next.js',
        type: 'video',
        duration: '18:00',
        isFree: true,
        videoUrl: '/nextjs-intro.mp4',
      },
      {
        title: 'Routing in Next.js',
        type: 'video',
        duration: '22:00',
        isFree: false,
      },
      {
        title: 'Server Components vs Client Components',
        type: 'video',
        duration: '25:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'Building UI with Tailwind & Shadcn',
    lectures: [
      {
        title: 'Tailwind CSS Fundamentals',
        type: 'video',
        duration: '20:00',
        isFree: true,
        videoUrl: '/tailwind-basics.mp4',
      },
      {
        title: 'Component-Driven Development with Shadcn UI',
        type: 'video',
        duration: '25:00',
        isFree: false,
      },
      {
        title: 'Email Automation',
        type: 'video',
        duration: '25:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'Content Marketing',
    lectures: [
      {
        title: 'Content Strategy Basics',
        type: 'video',
        duration: '20:00',
        isFree: true,
        videoUrl: '/content1.mp4',
      },
      {
        title: 'Content Creation Tools',
        type: 'video',
        duration: '18:00',
        isFree: false,
      },
      {
        title: 'Content Distribution',
        type: 'video',
        duration: '22:00',
        isFree: false,
      },
    ],
  },
]

interface LectureType {
  title: string
  type: string
  duration: string
  isFree: boolean
  videoUrl?: string
}

export function CourseContent() {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string
    title: string
  } | null>(null)

  const handleLectureClick = (lecture: LectureType) => {
    if (lecture.isFree && lecture.type === 'video') {
      setSelectedVideo({
        url: lecture.videoUrl as string,
        title: lecture.title,
      })
    }
  }

  return (
    <section id="curriculum" className="my-12">
      <h2 className="text-3xl font-bold tracking-tight mb-6">
        কোর্সের পরিপূর্ণ কারিকুলাম
      </h2>
      <Accordion type="single" collapsible className="mt-8 space-y-4">
        {courseModules.map((module, moduleIndex) => (
          <AccordionItem
            key={moduleIndex}
            value={`module-${moduleIndex}`}
            className="bg-accent py-1 px-4 rounded-xl border-none"
          >
            <AccordionTrigger className="flex items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline text-start text-lg">
              {module.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y">
                {module.lectures.map((lecture, lectureIndex) => (
                  <div
                    key={lectureIndex}
                    onClick={() => handleLectureClick(lecture)}
                    className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                      lecture.isFree ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {lecture.type === 'video' ? (
                        <PlayCircle className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-500" />
                      )}
                      <span>{lecture.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {lecture.duration}
                      </span>
                      {lecture.isFree ? (
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
