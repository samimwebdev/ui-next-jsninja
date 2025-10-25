import { Curriculum } from '@/types/course-page-types'
import { CurriculumClient } from '../shared/curriculum-client'
import { CourseCurriculumSkeleton } from './course-curriculum-skeleton'

export const CourseCurriculum: React.FC<{
  data?: Curriculum
  isLoading?: boolean
  courseType?: string
}> = ({ data, isLoading = false, courseType }) => {
  const modules = data?.modules || []
  const title = data?.title || 'Course Curriculum'
  const description =
    data?.description ||
    'Explore our comprehensive curriculum designed to take you from beginner to expert.'

  if (isLoading) {
    return <CourseCurriculumSkeleton />
  }

  if (!modules.length) {
    return (
      <section id="curriculum" className="my-8 sm:my-12 px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4 text-center lg:text-left">
          {title}
        </h2>
        <p className="text-muted-foreground text-center lg:text-left">
          No curriculum available at the moment.
        </p>
      </section>
    )
  }

  return (
    <section id="curriculum" className="my-8 sm:my-12 px-4 sm:px-0">
      <div className="mb-6 sm:mb-8 text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary mb-2 sm:mb-3">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto lg:mx-0">
          {description}
        </p>
      </div>
      <CurriculumClient modules={modules} courseType={courseType} />
    </section>
  )
}
