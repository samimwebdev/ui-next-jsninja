import { Curriculum } from '@/types/shared-types'

import { CurriculumClient } from '../shared/curriculum-client'

export const BootcampCurriculum: React.FC<{ data: Curriculum }> = ({
  data,
}) => {
  const modules = data?.modules || []
  const title = data?.title || 'Bootcamp Curriculum'
  const description =
    data?.description ||
    'Master JavaScript and frontend development with our step-by-step curriculum, designed to take you from beginner to job-ready developer.'

  // SSR: Render static structure and pass data to client
  return (
    <section id="curriculum" className="my-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
          {title}
        </h2>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        {/* Client component for accordion and interactivity */}
        <CurriculumClient modules={modules} />
      </div>
    </section>
  )
}
