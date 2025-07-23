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
import { ProjectContentSection, Project } from '@/types/course-page-types'

export const ProjectShowcase: React.FC<{ data: ProjectContentSection }> = ({
  data,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Use data from API
  const projects = data?.projects || []

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Helper function to clean HTML content and extract features
  const getCleanDescription = (htmlContent: string) => {
    return htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()
  }

  const extractFeatures = (htmlContent: string): string[] => {
    const features: string[] = []
    const listItemRegex = /<li[^>]*>(.*?)<\/li>/g
    let match

    while ((match = listItemRegex.exec(htmlContent)) !== null) {
      const feature = match[1].replace(/<[^>]*>/g, '').trim()
      if (feature) {
        features.push(feature)
      }
    }

    return features
  }

  if (!projects.length) {
    return (
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">
          {data?.title || 'Project Showcase'}
        </h2>
        <p className="text-muted-foreground">
          No projects available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          {data?.title || 'Project Showcase'}
        </h2>
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
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="flex-shrink-0 w-[300px] snap-start"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProject(project)}
          >
            <div className="bg-card rounded-lg overflow-hidden cursor-pointer">
              <Image
                src={project.image?.url || '/placeholder.svg'}
                alt={project.title}
                className="w-full h-[200px] object-cover"
                width="300"
                height="200"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {getCleanDescription(project.description).substring(0, 100)}
                  ...
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technology?.split(',').map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Image
              src={selectedProject?.image?.url || '/placeholder.svg'}
              alt={selectedProject?.title || 'Project'}
              className="w-full h-[200px] object-cover rounded-lg"
              width="600"
              height="200"
            />
            <p className="text-muted-foreground">
              {selectedProject
                ? getCleanDescription(selectedProject.description)
                : ''}
            </p>
            {selectedProject &&
              extractFeatures(selectedProject.description).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Project Features:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {extractFeatures(selectedProject.description).map(
                      (feature, index) => (
                        <li key={index}>{feature}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject?.technology?.split(',').map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
