import { Curriculum } from '@/types/course-page-types'
import { CurriculumClient } from '../shared/curriculum-client'
import { CourseCurriculumSkeleton } from './course-curriculum-skeleton'

export const CourseCurriculum: React.FC<{
  data?: Curriculum
  isLoading?: boolean
}> = ({ data, isLoading = false }) => {
  const modules = data?.modules || []
  const title = data?.title || 'Course Curriculum'

  // SSR: Show skeleton while loading
  if (isLoading) {
    return <CourseCurriculumSkeleton />
  }

  // SSR: No modules fallback
  if (!modules.length) {
    return (
      <section id="curriculum" className="my-12">
        <h2 className="text-3xl font-bold tracking-tight mb-6">{title}</h2>
        <p className="text-muted-foreground">
          No curriculum available at the moment.
        </p>
      </section>
    )
  }

  // SSR: Render static structure and pass data to client
  return (
    <section id="curriculum" className="my-12">
      <h2 className="text-3xl font-bold tracking-tight mb-6">{title}</h2>
      <CurriculumClient modules={modules} />
    </section>
  )
}
