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
import { Project } from '@/types/course-page-types'

interface EnhancedProject extends Project {
  cleanDescription: string
  features: string[]
  technologies: string[]
}

interface ProjectSliderProps {
  projects: EnhancedProject[]
}

export const ProjectSlider: React.FC<ProjectSliderProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] =
    useState<EnhancedProject | null>(null)
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
    <>
      {/* Interactive slider controls */}
      <div className="flex gap-2 mb-4 justify-end">
        <Button variant="outline" size="icon" onClick={() => scroll('left')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => scroll('right')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Interactive slider */}
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
                  {project.cleanDescription.substring(0, 100)}...
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project details modal */}
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
              {selectedProject?.cleanDescription}
            </p>
            {selectedProject && selectedProject.features.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Project Features:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {selectedProject.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject?.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
