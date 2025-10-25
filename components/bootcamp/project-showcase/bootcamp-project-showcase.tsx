import { ProjectShowcaseContentSection } from '@/types/bootcamp-page-types'
import { ProjectShowcaseLazy } from './bootcamp-project-showcase-lazy'
import { extractFeatures, getCleanText } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Suspense } from 'react'
import { ProjectShowcaseSkeleton } from './bootcamp-project-showcase-lazy'

export const BootcampProjectShowcase: React.FC<{
  data: ProjectShowcaseContentSection
}> = ({ data }) => {
  const projects = data?.projects || []

  // Prepare data for client component
  const projectsData = projects.map((project) => ({
    ...project,
    cleanDescription: getCleanText(project.description),
    features: extractFeatures(project.description),
    technologies:
      project.technology?.split(',').map((tech) => tech.trim()) || [],
  }))

  return (
    <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-4 sm:mb-6">
          {data.title}
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
          {data.description}
        </p>
      </div>

      {/* SSR fallback grid for no-JS users */}
      <noscript>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {projectsData.slice(0, 6).map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-lg overflow-hidden border"
            >
              <Image
                src={project.image?.formats?.small?.url || '/placeholder.svg'}
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
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </noscript>

      {/* Lazy-loaded Masonry enhancement */}
      <Suspense fallback={<ProjectShowcaseSkeleton />}>
        <ProjectShowcaseLazy projectsData={projectsData} />
      </Suspense>
    </section>
  )
}
