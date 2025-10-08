import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CourseNotFound({
  courseType,
}: {
  courseType?: string
}) {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">
          {courseType || 'Course'} Not Found
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          The {courseType || 'course'} you are looking for does not exist or has
          been removed.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
