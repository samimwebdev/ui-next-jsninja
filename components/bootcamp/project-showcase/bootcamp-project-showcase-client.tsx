'use client'

import { useEffect, useState } from 'react'
import Masonry from 'react-masonry-css'
import { ProjectCard } from '../../shared/project-card'
import { Project } from '@/types/shared-types'

const breakpointColumns = {
  default: 3,
  1536: 3,
  1280: 3,
  1024: 2,
  768: 2,
  640: 1,
}

interface EnhancedProject extends Project {
  cleanDescription: string
  features: string[]
  technologies: string[]
}

export const ProjectShowcaseClient: React.FC<{
  projectsData: EnhancedProject[]
}> = ({ projectsData }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Hide SSR grid after hydration
    const staticGrid = document.querySelector('.static-project-grid')
    if (staticGrid) staticGrid.classList.add('hidden')
  }, [])

  if (!mounted) return null

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-6 w-auto"
      columnClassName="pl-6 bg-clip-padding"
    >
      {projectsData.map((project) => (
        <div key={project.title} className="mb-6">
          <ProjectCard {...project} />
        </div>
      ))}
    </Masonry>
  )
}
