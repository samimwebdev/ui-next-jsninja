import { cn } from '@/lib/utils'

interface WhoSectionProps {
  active: boolean
}

export function WhoSection({ active }: WhoSectionProps) {
  return (
    <div
      id="who"
      className={cn(
        'pt-16 pb-16 transition-opacity duration-300',
        active ? 'opacity-100' : 'opacity-70'
      )}
    >
      <h3 className="text-3xl font-bold mb-8">Target Audience</h3>
      <div className="space-y-8">
        <AudienceItem
          title="Aspiring Content Creators"
          description="If you're looking to start a YouTube channel, create engaging social media content, or dive into the world of digital storytelling, this course will provide you with the essential skills to bring your ideas to life."
        />
        <AudienceItem
          title="Marketing Professionals"
          description="For those in marketing roles looking to enhance their digital media skills, this course will empower you to create high-quality visual content that resonates with your audience and drives engagement."
        />
        <AudienceItem
          title="Freelancers and Entrepreneurs"
          description="Whether you're starting a freelance career in digital media or looking to create compelling content for your own business, this course will equip you with the skills to stand out in a competitive market."
        />
      </div>
    </div>
  )
}

interface AudienceItemProps {
  title: string
  description: string
}

function AudienceItem({ title, description }: AudienceItemProps) {
  return (
    <div className="bg-card/50 p-6 rounded-lg border border-border/50">
      <h4 className="text-lg md:text-xl font-semibold mb-4">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
