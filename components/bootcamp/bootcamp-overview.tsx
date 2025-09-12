import { Card } from '@/components/ui/card'
import { BootcampOverviewContentSection } from '@/types/bootcamp-page-types'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { BootcampOverviewLazy } from './bootcamp-overview-lazy'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Static Section Component for SSR
const StaticSection: React.FC<{
  section: BootcampOverviewContentSection['sections'][0]
  sectionKey: string
}> = ({ section, sectionKey }) => (
  <div id={sectionKey} className="scroll-mt-32 transition-opacity duration-300">
    <h3 className="text-3xl font-bold mb-8">{section.secondaryHeading}</h3>
    <div className="space-y-12">
      {section.sectionContent.map((content) => (
        <div
          key={content.id}
          className="bg-card/50 p-6 rounded-lg border border-border/50"
        >
          <div className="flex items-center gap-3 mb-6">
            {/* Content icon */}
            {content.icon && (
              <div className="p-2 rounded-lg bg-primary/10">
                <DynamicIcon
                  icon={content.icon}
                  width={content.icon.width}
                  height={content.icon.height}
                  className="h-6 w-6 text-primary"
                />
              </div>
            )}
            <h4 className="text-xl font-semibold">{content.title}</h4>
          </div>

          <div
            className="prose prose-sm max-w-none dark:prose-invert [&_ul]:ml-8 [&_ul]:space-y-3 [&_ul]:list-disc [&_ul]:text-muted-foreground [&_p]:ml-8 [&_p]:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: content.details }}
          />
        </div>
      ))}
    </div>
  </div>
)

// Fallback skeleton for the sidebar
const SidebarSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="flex flex-col h-auto bg-card dark:bg-card p-2 space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="w-full p-4 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  </Card>
)

// Main SSR Component
export const BootcampOverview: React.FC<{
  data: BootcampOverviewContentSection
}> = ({ data }) => {
  // Process section keys on server
  const sectionKeys = data.sections.map((section) =>
    section.primaryLabel.toLowerCase().replace(/\s+/g, '-')
  )

  // Process sections data for client
  const processedSections = data.sections.map((section) => ({
    id: section.id,
    primaryLabel: section.primaryLabel,
    primaryLabelIcon: section.primaryLabelIcon,
    sectionKey: section.primaryLabel.toLowerCase().replace(/\s+/g, '-'),
  }))

  return (
    <section className="max-w-screen-xl container mx-auto bg-background py-12 dark:bg-background">
      {/* Static header content - SSR */}
      <div className="text-center mb-6">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {data.title}
        </h2>
        <p className="text-muted-foreground text-lg">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 mt-16">
        {/* Left Sidebar - Lazy loaded with enhanced client functionality */}
        <div className="md:sticky md:top-24 h-fit">
          <Suspense fallback={<SidebarSkeleton />}>
            <BootcampOverviewLazy
              sections={processedSections}
              defaultActiveSection={sectionKeys[0] || ''}
            />
          </Suspense>
        </div>

        {/* Right Content - Static sections (SSR) */}
        <Card className="p-8 relative">
          <div className="space-y-16">
            {data.sections.map((section) => {
              const sectionKey = section.primaryLabel
                .toLowerCase()
                .replace(/\s+/g, '-')

              return (
                <StaticSection
                  key={section.id}
                  section={section}
                  sectionKey={sectionKey}
                />
              )
            })}
          </div>
        </Card>
      </div>
    </section>
  )
}
