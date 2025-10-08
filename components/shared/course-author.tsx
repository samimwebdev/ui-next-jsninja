import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AuthorContentSection } from '@/types/course-page-types'

export const CourseAuthor: React.FC<{ data: AuthorContentSection }> = ({
  data,
}) => {
  const instructor = data?.instructor
  const title = data?.title || 'Meet Your Instructor'

  if (!instructor) {
    return (
      <section id="instructor" className="my-12">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <p className="text-muted-foreground">
          Instructor information not available.
        </p>
      </section>
    )
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <section id="instructor" className="my-12">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={
              instructor.profile?.image?.formats?.thumbnail?.url ||
              instructor.profile?.imageUrl ||
              ''
            }
            alt={instructor.name}
            width={80}
            height={80}
          />
          <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">{instructor.name}</h3>
          <p className="text-muted-foreground">{instructor.title}</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div dangerouslySetInnerHTML={{ __html: instructor.bio }} />
      </div>
    </section>
  )
}
