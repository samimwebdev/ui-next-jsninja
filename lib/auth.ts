'use server'
import { cookies } from 'next/headers'
import { strapiFetch } from './strapi'
import QueryString from 'qs'
import { User, UserWithProfile } from '@/types/shared-types'
import { cache } from 'react'

const COOKIE = 'strapi_jwt'

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE)
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value

  // console.log('=== getUser Debug ===')
  // console.log('Token exists:', !!token)
  // console.log('Token value:', token ? 'Present' : 'Missing')

  if (!token) {
    console.log('No token found in cookies')
    return null
  }

  const query = QueryString.stringify({
    populate: {
      profile: {
        populate: {
          image: true,
        },
      },
    },
  })

  try {
    return await strapiFetch(`/api/users/me?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    // await clearAuthCookie()
    return null
  }
}

export const getAuthToken = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)
  return token?.value || null
})

export async function getUserWithProfile(): Promise<UserWithProfile | null> {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const profile = await strapiFetch<UserWithProfile | null>(
      '/api/users/me?populate=profile.image',
      { token }
    )

    if (!profile) {
      // await clearAuthCookie()
      return null
    }

    return {
      id: profile.id,
      documentId: profile.documentId,
      email: profile.email,
      username: profile.username,
      confirmed: profile?.confirmed,
      blocked: profile.blocked,
      profile: profile?.profile,
    }
  } catch (error) {
    console.error('Failed to get user with profile:', error)
    await clearAuthCookie()
    return null
  }
}

// Add a separate action for clearing invalid tokens
export async function clearInvalidAuthCookie() {
  'use server'
  try {
    const user = await getUser()
    if (!user) {
      await clearAuthCookie()
    }
  } catch (error) {
    console.error('Error checking auth:', error)
    await clearAuthCookie()
  }
}

// Middleware helper
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return !!user && !user.blocked
}
