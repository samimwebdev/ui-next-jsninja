'use client'

import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Lock, PlayCircle, FileText } from 'lucide-react'
import { Lesson } from '@/types/course-page-types'
import { useVideo } from '../context/video-provider'
import { formatDuration } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useUser } from '../context/AuthProvider'

export const CurriculumClient: React.FC<{
  modules: Array<{
    id: number
    title: string
    lessons?: Lesson[]
  }>
}> = ({ modules }) => {
  const { openVideo } = useVideo()
  const user = useUser()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isFree && lesson.videoUrl && lesson.type === 'Video') {
      if (!user) {
        const currentPath = window.location.pathname
        toast.error('Please log in to watch free lectures', {
          description: 'You will be redirected back after login',
        })
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
        return
      }
      openVideo(lesson.videoUrl)
    }
  }

  return (
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
              {module.lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={`flex items-center justify-between p-4 transition-colors ${
                    lesson.isFree && lesson.videoUrl && lesson.type === 'Video'
                      ? 'cursor-pointer hover:bg-muted/50 hover:bg-blue-50/50'
                      : 'cursor-default opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {lesson.type === 'Video' ? (
                      <PlayCircle
                        className={`h-5 w-5 ${
                          lesson.isFree ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-500" />
                    )}
                    <span
                      className={
                        lesson.isFree
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDuration(lesson.duration)}
                    </span>
                    {lesson.isFree ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Free preview
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
