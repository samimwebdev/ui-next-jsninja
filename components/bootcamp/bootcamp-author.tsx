import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AuthorContentSection } from '@/types/course-page-types'
import { Award, BookOpen, Users, Star } from 'lucide-react'

export const BootcampAuthor: React.FC<{ data: AuthorContentSection }> = ({
  data,
}) => {
  const instructor = data?.instructor
  const title = data?.title || 'Meet Your Instructor'

  if (!instructor) {
    return (
      <section id="instructor" className="my-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
          <p className="text-muted-foreground text-center">
            Instructor information not available.
          </p>
        </div>
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

  // Mock stats - you can replace with real data from Strapi
  const stats = [
    { icon: Users, label: 'Students Taught', value: '10,000+' },
    { icon: BookOpen, label: 'Professional Contents', value: '3000+' },
    { icon: Star, label: 'Average Rating', value: '4.9' },
    { icon: Award, label: 'Years Experience', value: '10+' },
  ]

  return (
    <section
      id="instructor"
      className="my-16 px-4 sm:px-6 bg-accent/30 dark:bg-accent/10 py-16"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {data?.description}
          </p>
        </div>

        <Card className="overflow-hidden border-none shadow-lg bg-background/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Author Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-xl">
                  <AvatarImage
                    src={
                      instructor.profile?.image?.formats?.thumbnail?.url ||
                      instructor.profile?.imageUrl ||
                      ''
                    }
                    alt={instructor.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {getInitials(instructor.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-2xl font-bold mb-2">{instructor.name}</h3>
                  <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                    {instructor.title}
                  </Badge>

                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: instructor.bio }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="w-full lg:w-auto">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:min-w-[200px]">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-accent/50 dark:bg-accent/20 rounded-lg p-4 text-center lg:text-left"
                    >
                      <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                        <stat.icon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {stat.label}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
