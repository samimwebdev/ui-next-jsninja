import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wrench, GraduationCap, Users, BookOpen, Award } from 'lucide-react'

interface CourseSidebarProps {
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export function CourseSidebar({
  activeSection,
  onSectionChange,
}: CourseSidebarProps) {
  return (
    <div className="md:sticky md:top-8 h-fit">
      <Tabs
        value={activeSection}
        onValueChange={onSectionChange}
        orientation="vertical"
        className="w-full"
      >
        <TabsList className="flex flex-col h-auto bg-card dark:bg-card p-2 space-y-2">
          <TabsTrigger
            value="tools"
            className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
            aria-label="Software and Tools"
          >
            <Wrench className="h-5 w-5" />
            Software And Tools
          </TabsTrigger>
          <TabsTrigger
            value="learn"
            className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
            aria-label="What You Will Learn"
          >
            <GraduationCap className="h-5 w-5" />
            What You Will Learn
          </TabsTrigger>
          <TabsTrigger
            value="who"
            className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
            aria-label="Who Is This Course For"
          >
            <Users className="h-5 w-5" />
            Who Is This Course For
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
            aria-label="Additional Resources"
          >
            <BookOpen className="h-5 w-5" />
            Additional Resources
          </TabsTrigger>
          <TabsTrigger
            value="certification"
            className="w-full justify-start gap-3 p-4 text-base data-[state=active]:bg-primary/10"
            aria-label="Certification"
          >
            <Award className="h-5 w-5" />
            Certification
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
