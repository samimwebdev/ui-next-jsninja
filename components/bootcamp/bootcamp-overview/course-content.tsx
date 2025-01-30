import type { RefObject } from 'react'
import { Card } from '@/components/ui/card'
import { ToolsSection } from './sections/tools-section'
import { LearnSection } from './sections/learn-section'
import { WhoSection } from './sections/whom-section'
import { ResourcesSection } from './sections/resources-section'
import { CertificationSection } from './sections/certificate-section'

interface CourseContentProps {
  contentRef: RefObject<HTMLDivElement>
  activeSection: string
}

export function CourseContent({
  contentRef,
  activeSection,
}: CourseContentProps) {
  return (
    <Card className="p-6 md:p-8 relative shadow-md">
      <div ref={contentRef} className="space-y-16">
        <ToolsSection active={activeSection === 'tools'} />
        <LearnSection active={activeSection === 'learn'} />
        <WhoSection active={activeSection === 'who'} />
        <ResourcesSection active={activeSection === 'resources'} />
        <CertificationSection active={activeSection === 'certification'} />
      </div>
    </Card>
  )
}
