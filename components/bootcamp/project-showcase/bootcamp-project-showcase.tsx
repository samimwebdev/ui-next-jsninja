import { ProjectShowcaseContentSection } from '@/types/bootcamp-page-types'
import { ProjectShowcaseClient } from './bootcamp-project-showcase-client'
import { extractFeatures, getCleanText } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

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
    <section className="container mx-auto max-w-screen-xl px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-4xl font-black tracking-tight text-center mb-6">
          {data.title}
        </h2>
        <p className="text-muted-foreground text-lg">{data.description}</p>
      </div>
      {/* SSR fallback grid */}
      {/* SSR: Show static grid for no-JS users */}
      <div className="hidden noscript:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {projectsData.slice(0, 6).map((project) => (
          <div key={project.id} className="bg-card rounded-lg overflow-hidden">
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

      {/* Client Masonry enhancement */}
      <ProjectShowcaseClient projectsData={projectsData} />
    </section>
  )
}
