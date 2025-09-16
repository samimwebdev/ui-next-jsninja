import { ProfileUpdateForm } from '@/components/dashboard/profile-update-form'
import { getUserWithProfile } from '@/lib/auth'

export default async function ProfilePage() {
  const user = await getUserWithProfile()

  if (!user?.profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">
          No profile found. Something went wrong.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <ProfileUpdateForm profile={user?.profile} username={user?.username} />
    </div>
  )
}
