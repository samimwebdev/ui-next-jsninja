import { ProjectContentSection } from '@/types/course-page-types'
import { ProjectSlider } from './project-slider'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { extractFeatures, getCleanText } from '@/lib/utils'

export const ProjectShowcase: React.FC<{ data: ProjectContentSection }> = ({
  data,
}) => {
  const projects = data?.projects || []

  if (!projects.length) {
    return (
      <section className="my-12" id="projects">
        <h2 className="text-3xl font-bold mb-6">
          {data?.title || 'Project Showcase'}
        </h2>
        <p className="text-muted-foreground">
          No projects available at the moment.
        </p>
      </section>
    )
  }

  // Prepare data for client component
  const projectsData = projects.map((project) => ({
    ...project,
    cleanDescription: getCleanText(project.description),
    features: extractFeatures(project.description),
    technologies:
      project.technology?.split(',').map((tech) => tech.trim()) || [],
  }))

  return (
    <section className="my-12" id="projects">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          {data?.title || 'Project Showcase'}
        </h2>

        {/* Static project cards for SSR */}
        <noscript>
          <div className="text-sm text-muted-foreground">
            Enable JavaScript for interactive experience
          </div>
        </noscript>
      </div>

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

      {/* Client-side interactive slider */}
      <ProjectSlider projects={projectsData} />
    </section>
  )
}
