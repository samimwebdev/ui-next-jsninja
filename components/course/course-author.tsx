import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AuthorContentSection } from '@/types/course-page-types'

export const CourseAuthor: React.FC<{ data: AuthorContentSection }> = ({
  data,
}) => {
  return (
    <section id="instructor" className="my-12">
      <h2 className="text-3xl font-bold mb-6">Meet Your Instructor</h2>
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rxcxbhOGI9hdkibrnJoCLFBEyyygNa.png"
            alt="Priyom Mozumder"
            width={80}
            height={80}
          />
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">Alex Johnson</h3>
          <p className="text-muted-foreground">
            Senior Frontend Engineer & Instructor
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <p>
          Alex is a seasoned frontend developer with over 8 years of experience
          working with React and modern JavaScript frameworks. He has led
          frontend teams at several tech startups and now focuses on teaching
          the next generation of developers.
        </p>
        <p>
          Having contributed to popular open-source projects and spoken at React
          conferences, Alex brings real-world expertise and best practices to
          his teaching. His students appreciate his clear explanations and
          practical, project-based approach to learning.
        </p>
      </div>
    </section>
  )
}
