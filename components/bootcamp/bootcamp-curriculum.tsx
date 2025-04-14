'use client'

import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Lock, PlayCircle, FileText, BookOpen } from 'lucide-react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'

const bootcampModules = [
  {
    title: 'Getting Started with Frontend Development',
    lectures: [
      {
        title: 'Introduction to Web Development',
        type: 'video',
        duration: '10:30',
        isFree: true,
        videoUrl: '/lecture1.mp4',
      },
      {
        title: 'Setting Up Your Development Environment',
        type: 'text',
        duration: '15:00',
        isFree: true,
      },
      {
        title: 'Understanding HTML, CSS, and JavaScript',
        type: 'video',
        duration: '20:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'HTML Fundamentals',
    lectures: [
      {
        title: 'HTML Document Structure',
        type: 'video',
        duration: '12:00',
        isFree: true,
        videoUrl: '/html1.mp4',
      },
      {
        title: 'Working with Text and Lists',
        type: 'video',
        duration: '15:00',
        isFree: false,
      },
      {
        title: 'HTML Forms and Input Elements',
        type: 'video',
        duration: '18:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'CSS Styling',
    lectures: [
      {
        title: 'CSS Selectors and Properties',
        type: 'video',
        duration: '14:00',
        isFree: true,
        videoUrl: '/css1.mp4',
      },
      {
        title: 'Box Model and Layout',
        type: 'video',
        duration: '16:00',
        isFree: false,
      },
      {
        title: 'Responsive Design with CSS',
        type: 'video',
        duration: '20:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'JavaScript Essentials',
    lectures: [
      {
        title: 'JavaScript Syntax and Variables',
        type: 'video',
        duration: '15:00',
        isFree: true,
        videoUrl: '/js1.mp4',
      },
      {
        title: 'Functions and Control Flow',
        type: 'video',
        duration: '18:00',
        isFree: false,
      },
      {
        title: 'DOM Manipulation',
        type: 'video',
        duration: '22:00',
        isFree: false,
      },
    ],
  },
  {
    title: 'React Framework',
    lectures: [
      {
        title: 'Introduction to React',
        type: 'video',
        duration: '20:00',
        isFree: true,
        videoUrl: '/react1.mp4',
      },
      {
        title: 'Components and Props',
        type: 'video',
        duration: '25:00',
        isFree: false,
      },
      {
        title: 'State Management',
        type: 'video',
        duration: '30:00',
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

export function BootcampCurriculum() {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string
    title: string
  } | null>(null)

  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  const handleLectureClick = (lecture: LectureType) => {
    if (lecture.isFree && lecture.type === 'video') {
      setSelectedVideo({
        url: lecture.videoUrl as string,
        title: lecture.title,
      })
    }
  }

  return (
    <section id="curriculum" className="my-16 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
          Bootcamp Curriculum
        </h2>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Our comprehensive curriculum is designed to take you from beginner to
          professional frontend developer
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Accordion
          type="single"
          collapsible
          className="mt-8 space-y-4"
          value={expandedModule || undefined}
          onValueChange={(value) => {
            // If clicking the same module that's already expanded, collapse it
            if (value === expandedModule) {
              setExpandedModule(null)
            } else {
              setExpandedModule(value)
            }
          }}
        >
          {bootcampModules.map((module, moduleIndex) => (
            <motion.div
              key={moduleIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * moduleIndex, duration: 0.5 }}
            >
              <AccordionItem
                value={`module-${moduleIndex}`}
                className="bg-accent dark:bg-accent/80 py-1 px-4 rounded-xl border-none shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="flex items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline text-start text-lg group">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <span className="group-hover:text-primary transition-colors">
                      {module.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="overflow-hidden">
                  <div className="divide-y divide-border/50">
                    {module.lectures.map((lecture, lectureIndex) => (
                      <div
                        key={lectureIndex}
                        onClick={() => handleLectureClick(lecture)}
                        className={`flex items-center justify-between p-4 hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors rounded-md my-1 ${
                          lecture.isFree ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {lecture.type === 'video' ? (
                            <PlayCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          )}
                          <span>{lecture.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {lecture.duration}
                          </span>
                          {lecture.isFree ? (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                              Free Preview
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
            </motion.div>
          ))}
        </Accordion>
      </motion.div>

      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black/5 dark:bg-black/20 rounded-md overflow-hidden">
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
