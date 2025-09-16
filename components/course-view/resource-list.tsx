import type { Resource } from '@/types/course-view-types'
import DynamicIcon from '../shared/DynamicIcon'

interface ResourceListProps {
  resources: Resource[]
}

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <div className="grid gap-4">
      {resources.map((resource, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="bg-primary/10 p-2 rounded-md text-primary">
            {/* <resource.icon className="h-5 w-5" /> */}
            {resource.resourceIcon && (
              <DynamicIcon
                icon={resource.resourceIcon}
                className="h-5 w-5"
                width={15}
                height={15}
              />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{resource.title}</h4>
            <p className="text-sm text-muted-foreground">
              {resource.description}
            </p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline mt-1 inline-block"
            >
              View Resource
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
