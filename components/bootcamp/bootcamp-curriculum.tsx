import { Curriculum } from '@/types/shared-types'
import { CurriculumLazy } from '../shared/curriculum-lazy'
import { Suspense } from 'react'
import { CurriculumSkeleton } from '../shared/curriculum-lazy'

export const BootcampCurriculum: React.FC<{ data: Curriculum }> = ({
  data,
}) => {
  const modules = data?.modules || []
  const title = data?.title || 'Bootcamp Curriculum'
  const description =
    data?.description ||
    'Master JavaScript and frontend development with our step-by-step curriculum, designed to take you from beginner to job-ready developer.'

  return (
    <section id="curriculum" className="my-8 sm:my-12 lg:my-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-center">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground text-center mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          {description}
        </p>

        {/* Lazy-loaded interactive curriculum component */}
        <Suspense fallback={<CurriculumSkeleton />}>
          <CurriculumLazy modules={modules} />
        </Suspense>
      </div>
    </section>
  )
}
