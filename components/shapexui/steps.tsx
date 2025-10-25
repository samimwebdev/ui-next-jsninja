import DynamicIcon from '@/components/shared/DynamicIcon'
import Link from 'next/link'
import { BootcampStepsContentSection } from '@/types/bootcamp-page-types'
import { StepsLazy } from './steps-lazy'
import { Suspense } from 'react'
import { StepsClientSkeleton } from './steps-lazy'

const BootcampSteps: React.FC<{ data: BootcampStepsContentSection }> = ({
  data,
}) => {
  const steps = data.stepSection.map((step, index) => ({
    id: index + 1,
    title: step.title,
    isCompleted: true,
    details: step.details,
    icon: step.icon,
  }))

  return (
    <section className="w-full px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-screen-xl container mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:gap-8 lg:gap-12">
        {/* Left text section - narrower on desktop */}
        <div className="w-full lg:w-auto lg:max-w-md xl:max-w-lg flex-shrink-0 text-center lg:text-left">
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            <span className="text-primary">{data.title}</span>
          </h3>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
            {data.description}
          </p>
          {data.btn && (
            <Link
              href={data.btn.btnLink || '#'}
              className="inline-flex items-center justify-center px-5 sm:px-6 mt-4 sm:mt-6 py-2.5 sm:py-3 font-sans text-sm sm:text-base font-semibold transition-all duration-200 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
              role="button"
            >
              {data.btn.btnLabel}
              {data.btn.btnIcon && (
                <DynamicIcon
                  icon={data.btn.btnIcon}
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-2"
                  width={20}
                  height={20}
                />
              )}
            </Link>
          )}
        </div>

        {/* Lazy-loaded interactive steps component - takes remaining space */}
        <div className="w-full lg:flex-2 lg:max-w-4xl">
          <Suspense fallback={<StepsClientSkeleton />}>
            <StepsLazy
              secondaryHeading={data.secondaryHeading}
              secondaryDescription={data.secondaryDescription}
              steps={steps}
            />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export default BootcampSteps
