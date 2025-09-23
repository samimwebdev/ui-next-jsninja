import { redirect } from 'next/navigation'
import { checkTotpStatus, generateSecret } from '@/app/(auth)/actions'
import Setup from '@/components/auth/app-setup'
import { getAuthToken } from '@/lib/auth'

export default async function Page() {
  const token = await getAuthToken()
  const status = await checkTotpStatus()

  if (status.twoFactorEnabled) {
    redirect('/dashboard?error=you have already set up 2FA')
  }

  if (!token) redirect('/login')

  const totpData = await generateSecret()

  return (
    <>
      <Setup secret={totpData.secret} url={totpData.url} />
    </>
  )
}
