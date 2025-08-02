import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { getUserWithProfile } from '@/lib/auth'
import { getProfileImageUrl } from '@/lib/utils'

export async function UserProfile() {
  const user = await getUserWithProfile()

  const profileImageUrl = getProfileImageUrl(user)

  // Fallbacks
  const firstName = user?.profile?.firstName || ''
  const lastName = user?.profile?.lastName || ''

  const fullName =
    firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : user?.username || 'User'

  const bio = user?.profile?.bio || 'No bio yet. Please update your profile.'

  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`
      : user?.username
      ? user.username.slice(0, 2).toUpperCase()
      : 'U'

  // TODO: Replace with real data from Strapi if available
  const coursesEnrolled = 5
  const certificatesEarned = 3

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container py-8">
        <Card className="border-0 shadow-none">
          <CardContent className="flex items-center gap-6 p-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImageUrl} alt={fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{fullName}</h2>
              <p className="text-muted-foreground">{bio}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-sm text-muted-foreground">
                  {coursesEnrolled} Courses Enrolled
                </span>
                <span className="text-sm text-muted-foreground">
                  {certificatesEarned} Certificates Earned
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
