import { cn } from '@/lib/utils'
import { Clapperboard, Palette, Bot, Briefcase } from 'lucide-react'

interface ToolsSectionProps {
  active: boolean
}

export function ToolsSection({ active }: ToolsSectionProps) {
  return (
    <div
      id="tools"
      className={cn(
        'pt-4 pb-16 transition-opacity duration-300',
        active ? 'opacity-100' : 'opacity-70'
      )}
    >
      <h3 className="text-3xl font-bold mb-8">
        What You&apos;ll Master In This Course
      </h3>

      <div className="space-y-12">
        <ToolCard
          icon={Clapperboard}
          title="Video Editing Mastery"
          items={[
            'Dominate the fundamentals and advanced techniques of video editing',
            'Unlock the secrets of professional editors and their workflows',
            'Create captivating content across various formats: viral reels, documentaries, podcasts, and more',
            'Elevate your storytelling through powerful editing techniques',
          ]}
        />

        <ToolCard
          icon={Palette}
          title="Graphic Design & Motion Graphics"
          items={[
            'Transform from novice to expert in photo editing and graphic design',
            'Craft stunning visuals for ads, thumbnails, posters, and banners',
            'Bring your designs to life with dynamic animation and motion graphics',
            'Dive into 3D environments and create complex visual stories',
          ]}
        />

        <ToolCard
          icon={Bot}
          title="Cutting-Edge AI Integration"
          items={[
            'Harness the power of generative AI tools for next-level editing',
            'Master prompt writing for text-to-image, text-to-video, and text-to-audio transformations',
            'Explore voice cloning and other innovative AI technologies',
            'Stay ahead of the curve with the latest AI advancements in media creation',
          ]}
        />

        <ToolCard
          icon={Briefcase}
          title="Launch Your Freelance Career"
          items={[
            'Turn your newfound skills into a thriving freelance business',
            'Design an irresistible portfolio that attracts high-paying clients',
            'Navigate freelancing platforms like a pro',
            'Learn the roadmap to building your own successful service-based agency',
          ]}
        />
      </div>
    </div>
  )
}

interface ToolCardProps {
  icon: React.ElementType
  title: string
  items: string[]
}

function ToolCard({ icon: Icon, title, items }: ToolCardProps) {
  return (
    <div className="bg-card/50 p-6 rounded-lg border border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 shadow-sm">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h4 className="text-lg md:text-xl font-semibold">{title}</h4>
      </div>
      <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
