// components/Protected.tsx
import { can } from '@/lib/acl'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default async function Protected({
  rule,
  children,
  resource,
}: {
  rule: Parameters<typeof can>[1]
  children: React.ReactNode
  resource?: Parameters<typeof can>[2]
}) {
  const user = await getUser()
  if (!can(user, rule, resource)) redirect('/login')
  return <>{children}</>
}
