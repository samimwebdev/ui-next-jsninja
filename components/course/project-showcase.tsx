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
      <section className="my-8 sm:my-12 px-4 sm:px-0" id="projects">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center lg:text-left">
          {data?.title || 'Project Showcase'}
        </h2>
        <p className="text-muted-foreground text-center lg:text-left">
          No projects available at the moment.
        </p>
      </section>
    )
  }

  const projectsData = projects.map((project) => ({
    ...project,
    cleanDescription: getCleanText(project.description),
    features: extractFeatures(project.description),
    technologies:
      project.technology?.split(',').map((tech) => tech.trim()) || [],
  }))

  return (
    <section className="my-8 sm:my-12 px-4 sm:px-0" id="projects">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          {data?.title || 'Project Showcase'}
        </h2>

        <noscript>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Enable JavaScript for interactive experience
          </div>
        </noscript>
      </div>

      {/* SSR fallback */}
      <div className="hidden noscript:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {projectsData.slice(0, 6).map((project) => (
          <div key={project.id} className="bg-card rounded-lg overflow-hidden">
            <Image
              src={project.image?.formats?.small?.url || '/placeholder.svg'}
              alt={project.title}
              className="w-full h-[200px] object-cover"
              width="300"
              height="200"
            />
            <div className="p-4">
              <h3 className="font-semibold text-base sm:text-lg mb-2">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {project.cleanDescription.substring(0, 100)}...
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectSlider projects={projectsData} />
    </section>
  )
}
