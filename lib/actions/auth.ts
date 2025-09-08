'use server'

export async function checkAuthAction(): Promise<boolean> {
  const { isAuthenticated } = await import('@/lib/auth')
  return await isAuthenticated()
}
