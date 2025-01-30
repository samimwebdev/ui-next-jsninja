import { cn } from '@/lib/utils'

interface CertificationSectionProps {
  active: boolean
}

export function CertificationSection({ active }: CertificationSectionProps) {
  return (
    <div
      id="certification"
      className={cn(
        'pt-16 pb-16 transition-opacity duration-300',
        active ? 'opacity-100' : 'opacity-70'
      )}
    >
      <h3 className="text-3xl font-bold mb-8">Certification</h3>
      <div className="space-y-8">
        <CertificationItem
          title="Course Completion Certificate"
          description="Upon successful completion of the course, you'll receive a certificate recognizing your achievement and newly acquired skills in digital media creation."
        />
        <CertificationItem
          title="Industry Recognition"
          description="Our certification is recognized by leading companies in the digital media industry, giving you a competitive edge in the job market or freelance world."
        />
        <CertificationItem
          title="Continuing Education"
          description="Stay up-to-date with the latest trends and technologies through our ongoing education programs, exclusively available to course graduates."
        />
      </div>
    </div>
  )
}

interface CertificationItemProps {
  title: string
  description: string
}

function CertificationItem({ title, description }: CertificationItemProps) {
  return (
    <div className="bg-card/50 p-6 rounded-lg border border-border/50">
      <h4 className="text-lg md:text-xl font-semibold mb-4">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
