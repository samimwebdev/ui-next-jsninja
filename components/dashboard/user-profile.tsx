import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

export function UserProfile() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container py-8">
        <Card className="border-0 shadow-none">
          <CardContent className="flex items-center gap-6 p-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/images/user-avatar.jpg" alt="John Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">John Doe</h2>
              <p className="text-muted-foreground">
                Frontend Developer | Learning enthusiast passionate about web
                technologies
              </p>
              <div className="flex gap-4 mt-2">
                <span className="text-sm text-muted-foreground">
                  5 Courses Enrolled
                </span>
                <span className="text-sm text-muted-foreground">
                  3 Certificates Earned
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
