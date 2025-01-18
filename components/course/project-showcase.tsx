'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const projectLists = [
  {
    id: 1,
    title: 'Facebook Marketing Mastery',
    description:
      'Learn how to create and manage successful Facebook marketing campaigns',

    image:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800',
    features: [
      '20+ hours of video content',
      'Practical assignments',
      'Certificate of completion',
      'Lifetime access',
    ],
  },
  {
    id: 2,
    title: 'Google Ads Professional',
    description: 'Master Google Ads and drive traffic to your business',

    image:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800',
    features: [
      '25+ hours of video content',
      'Real campaign setup',
      'Certificate of completion',
      'Lifetime access',
    ],
  },
  {
    id: 3,
    title: 'Complete Digital Marketing',
    description:
      'Comprehensive course covering all aspects of digital marketing',

    image:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800',
    features: [
      '50+ hours of video content',
      'Multiple projects',
      'Certificate of completion',
      'Lifetime access',
    ],
  },
  {
    id: 4,
    title: 'Complete Digital Marketing',
    description:
      'Comprehensive course covering all aspects of digital marketing',
    image:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800',
    features: [
      '50+ hours of video content',
      'Multiple projects',
      'Certificate of completion',
      'Lifetime access',
    ],
  },
  {
    id: 5,
    title: 'Complete Digital Marketing',
    description:
      'Comprehensive course covering all aspects of digital marketing',
    image:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800',
    features: [
      '50+ hours of video content',
      'Multiple projects',
      'Certificate of completion',
      'Lifetime access',
    ],
  },
]

export const ProjectShowcase = () => {
  const [projectItem, setProjectItem] = useState<
    (typeof projectLists)[0] | null
  >(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Project ShowCase</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll('left')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll('right')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        {projectLists.map((course) => (
          <motion.div
            key={course.id}
            className="flex-shrink-0 w-[300px] snap-start"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => setProjectItem(course)}
          >
            <div className="bg-card rounded-lg overflow-hidden cursor-pointer">
              <Image
                src={course.image || '/placeholder.svg'}
                alt={course.title}
                className="w-full h-[200px] object-cover"
                width="300"
                height="300"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {course.description}
                </p>
                {/* <p className="text-2xl font-bold">৳{course.price}</p> */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Javascript</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Asynchronous</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!projectItem} onOpenChange={() => setProjectItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{projectItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Image
              src={projectItem?.image || '/placeholder.svg'}
              alt={projectItem?.title || 'demo title'}
              className="w-full h-[200px] object-cover rounded-lg"
              width="600"
              height="200"
            />
            <p className="text-muted-foreground">{projectItem?.description}</p>
            <div>
              <h4 className="font-semibold mb-2">Project Features:</h4>
              <ul className="list-disc pl-4 space-y-1">
                {projectItem?.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Javascript</Badge>
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">Asynchronous</Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
