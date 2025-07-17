// lib/acl.ts
type Rule = 'VIEW_COURSE' | 'VIEW_DASHBOARD'

export function can(
  user: {
    role: { name: string }
    id: string
  },
  rule: Rule,
  resource?: { students?: string[]; isPublic?: boolean }
) {
  if (!user) return false
  const role = user.role?.name
  if (role === 'admin') return true

  switch (rule) {
    case 'VIEW_DASHBOARD':
      return ['student', 'instructor'].includes(role)
    case 'VIEW_COURSE':
      return resource?.students?.includes(user.id) || resource?.isPublic
    default:
      return false
  }
}
