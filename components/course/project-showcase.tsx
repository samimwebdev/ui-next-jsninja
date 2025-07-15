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
    title: 'Responsive Portfolio Website',
    description:
      'Build a modern, responsive portfolio website using React and Tailwind CSS',
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
    features: [
      'Responsive design for all devices',
      'Dark/light mode toggle',
      'Animated page transitions',
      'Contact form with validation',
    ],
  },
  {
    id: 2,
    title: 'E-commerce Dashboard',
    description: 'Create a feature-rich admin dashboard for online stores',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    features: [
      'Data visualization with charts',
      'User authentication',
      'Order management system',
      'Inventory tracking',
    ],
  },
  {
    id: 3,
    title: 'Social Media App',
    description:
      'Develop a full-featured social media application with React and Firebase',
    image:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    features: [
      'Real-time messaging',
      'User profiles and authentication',
      'Post creation and interaction',
      'Notification system',
    ],
  },
  {
    id: 4,
    title: 'Weather Application',
    description:
      'Build a weather app that fetches and displays data from a weather API',
    image:
      'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=800',
    features: [
      'Location-based weather data',
      'Five-day forecast',
      'Weather animations',
      'Responsive UI design',
    ],
  },
  {
    id: 5,
    title: 'Task Management System',
    description:
      'Create a Kanban-style task management application with drag-and-drop functionality',
    image:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800',
    features: [
      'Drag-and-drop task organization',
      'Task categories and labels',
      'Progress tracking',
      'Data persistence with localStorage',
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
        <h2 className="text-3xl font-bold">Project Showcase</h2>
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
        {projectLists.map((project) => (
          <motion.div
            key={project.id}
            className="flex-shrink-0 w-[300px] snap-start"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => setProjectItem(project)}
          >
            <div className="bg-card rounded-lg overflow-hidden cursor-pointer">
              <Image
                src={project.image || '/placeholder.svg'}
                alt={project.title}
                className="w-full h-[200px] object-cover"
                width="300"
                height="300"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">JavaScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
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
              alt={projectItem?.title || 'Project'}
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
                <Badge variant="secondary">React</Badge>
                <Badge variant="outline">JavaScript</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
