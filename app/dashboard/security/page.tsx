'use server'
import { getAuthToken, getUserWithProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { checkTotpStatus } from '@/app/(auth)/actions'
import { SecuritySettings } from '@/components/dashboard/security-settings'

export default async function SecurityPage() {
  const token = await getAuthToken()
  const user = await getUserWithProfile()

  if (!token || !user) {
    redirect('/login?redirect=/dashboard/security')
  }

  // Get current 2FA status
  const totpStatus = await checkTotpStatus()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Security Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account security and two-factor authentication settings.
        </p>
      </div>

      <SecuritySettings
        user={user}
        initialTotpStatus={totpStatus.twoFactorEnabled || false}
      />
    </div>
  )
}
