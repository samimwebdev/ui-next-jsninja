import { cn } from '@/lib/utils'

interface LearnSectionProps {
  active: boolean
}

export function LearnSection({ active }: LearnSectionProps) {
  return (
    <div
      id="learn"
      className={cn(
        'pt-16 pb-16 transition-opacity duration-300',
        active ? 'opacity-100' : 'opacity-70'
      )}
    >
      <h3 className="text-3xl font-bold mb-8">Learning Path</h3>
      <div className="space-y-8">
        <LearningPathItem
          title="1. Foundations of Digital Media"
          items={[
            'Understanding digital formats and compression',
            'Color theory and its application in digital media',
            'Basics of composition and framing',
            'Introduction to industry-standard software',
          ]}
        />
        <LearningPathItem
          title="2. Advanced Video Editing Techniques"
          items={[
            'Mastering timeline editing and keyframing',
            'Color grading and color correction',
            'Audio editing and sound design',
            'Creating compelling transitions and effects',
          ]}
        />
        <LearningPathItem
          title="3. Graphic Design for Digital Media"
          items={[
            'Typography and layout design',
            'Creating engaging thumbnails and posters',
            'Logo design and branding elements',
            'Infographic creation for data visualization',
          ]}
        />
      </div>
    </div>
  )
}

interface LearningPathItemProps {
  title: string
  items: string[]
}

function LearningPathItem({ title, items }: LearningPathItemProps) {
  return (
    <div className="bg-card/50 p-6 rounded-lg border border-border/50">
      <h4 className="text-lg md:text-xl font-semibold mb-4">{title}</h4>
      <ul className="ml-8 space-y-3 list-disc text-muted-foreground">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
