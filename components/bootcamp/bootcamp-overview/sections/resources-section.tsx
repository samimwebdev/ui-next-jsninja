import { cn } from '@/lib/utils'

interface ResourcesSectionProps {
  active: boolean
}

export function ResourcesSection({ active }: ResourcesSectionProps) {
  return (
    <div
      id="resources"
      className={cn(
        'pt-16 pb-16 transition-opacity duration-300',
        active ? 'opacity-100' : 'opacity-70'
      )}
    >
      <h3 className="text-3xl font-bold mb-8">Additional Resources</h3>
      <div className="space-y-8">
        <ResourceItem
          title="Online Community"
          description="Join our vibrant online community of fellow learners and industry professionals. Share your work, get feedback, and collaborate on projects."
        />
        <ResourceItem
          title="Exclusive Webinars"
          description="Gain insights from industry experts through our exclusive webinars. These live sessions cover cutting-edge topics and provide opportunities for Q&A with professionals."
        />
        <ResourceItem
          title="Resource Library"
          description="Access our extensive library of tutorials, templates, and assets to support your learning journey and accelerate your project development."
        />
      </div>
    </div>
  )
}

interface ResourceItemProps {
  title: string
  description: string
}

function ResourceItem({ title, description }: ResourceItemProps) {
  return (
    <div className="bg-card/50 p-6 rounded-lg border border-border/50">
      <h4 className="text-lg md:text-xl font-semibold mb-4">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
