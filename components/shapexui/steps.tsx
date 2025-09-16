import DynamicIcon from '@/components/shared/DynamicIcon'
import Link from 'next/link'
import { BootcampStepsContentSection } from '@/types/bootcamp-page-types'
import { StepsLazy } from './steps-lazy'
import { Suspense } from 'react'
import { StepsClientSkeleton } from './steps-lazy'

const Steps: React.FC<{ data: BootcampStepsContentSection }> = ({ data }) => {
  const steps = data.stepSection.map((step, index) => ({
    id: index + 1,
    title: step.title,
    isCompleted: true,
    details: step.details,
    icon: step.icon,
  }))

  return (
    <div className="py-12 max-w-screen-xl flex flex-col md:flex-row items-center justify-center mx-auto gap-8">
      <div className="align-top p-2">
        <h3 className="text-4xl md:text-4xl font-bold tracking-tight mb-4">
          <span className="text-primary">{data.title}</span>
        </h3>
        <p className="text-muted-foreground text-lg">{data.description}</p>
        {data.btn && (
          <Link
            href={data.btn.btnLink || '#'}
            className="inline-flex items-center justify-center px-6 mt-6 py-3 font-sans text-base font-semibold transition-all duration-200 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
            role="button"
          >
            {data.btn.btnLabel}
            {data.btn.btnIcon && (
              <DynamicIcon
                icon={data.btn.btnIcon}
                className="h-5 w-5 ml-2"
                width={20}
                height={20}
              />
            )}
          </Link>
        )}
      </div>

      {/* Lazy-loaded interactive steps component */}
      <Suspense fallback={<StepsClientSkeleton />}>
        <StepsLazy
          secondaryHeading={data.secondaryHeading}
          secondaryDescription={data.secondaryDescription}
          steps={steps}
        />
      </Suspense>
    </div>
  )
}

export default Steps
