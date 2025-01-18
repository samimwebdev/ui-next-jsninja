'use client'
import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Lock, PlayCircle, FileText } from 'lucide-react'

const courseModules = [
  {
    title: 'Introduction to the course',
    lectures: [
      {
        title: 'Welcome to the Course',
        type: 'video',
        duration: '5:30',
        isFree: true,
        videoUrl: '/lecture1.mp4',
      },
      {
        title: 'Before we start!',
        type: 'text',
        duration: '10:00',
        isFree: false,
      },
      {
        title: 'Welcome to our community',
        type: 'text',
        duration: '8:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'Facebook Marketing',
    lectures: [
      {
        title: 'Facebook Page Creation and Setup',
        type: 'video',
        duration: '15:00',
        isFree: true,
        videoUrl: '/facebook1.mp4',
      },
      {
        title: 'Content Strategy for Facebook',
        type: 'video',
        duration: '20:00',
        isFree: false,
      },
      {
        title: 'Facebook Ads Basics',
        type: 'video',
        duration: '25:00',
        isFree: true,
        videoUrl: '/facebook2.mp4',
      },
    ],
  },
  {
    title: 'Google Marketing',
    lectures: [
      {
        title: 'Introduction to Google Ads',
        type: 'video',
        duration: '18:00',
        isFree: true,
        videoUrl: '/google1.mp4',
      },
      {
        title: 'SEO Fundamentals',
        type: 'video',
        duration: '22:00',
        isFree: false,
      },
      {
        title: 'Google Analytics Setup',
        type: 'video',
        duration: '15:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'Email Marketing',
    lectures: [
      {
        title: 'Email Marketing Basics',
        type: 'video',
        duration: '20:00',
        isFree: true,
        videoUrl: '/email1.mp4',
      },
      {
        title: 'Building Email Lists',
        type: 'video',
        duration: '15:00',
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
