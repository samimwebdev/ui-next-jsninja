'use server'
import { cookies } from 'next/headers'
import { strapiFetch } from './strapi'
// import QueryString from 'qs'
import { User, UserWithProfile } from '@/types/shared-types'

const COOKIE = 'jsn_jwt'
const REFRESH_COOKIE = 'jsn_refresh'

/**
 * Set both access and refresh tokens
 */
export async function setAuthCookies(jwt: string, refreshToken: string) {
  'use server'
  const cookieStore = await cookies()

  // Set access token (15 minutes)
  cookieStore.set(COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  })

  // Set refresh token (30 days)
  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

/**
 * Legacy function - now also sets refresh token if available
 */
export async function setAuthCookie(token: string, refreshToken?: string) {
  'use server'
  const cookieStore = await cookies()
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  })

  // If refresh token provided, set it too
  if (refreshToken) {
    cookieStore.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }
}

/**
 * Clear all auth cookies
 */
export async function clearAuthCookie() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE)
  cookieStore.delete(REFRESH_COOKIE)
}

/**
 * Get auth token from cookies
 * Middleware ensures this is always fresh
 */
export async function getAuthToken(): Promise<string | null> {
  'use server'
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE)
  return cookie?.value || null
}

/**
 * Get valid auth token (alias for getAuthToken for clarity)
 */
export async function getValidAuthToken(): Promise<string | null> {
  'use server'
  return await getAuthToken()
}

export async function getUser(): Promise<User | null> {
  'use server'
  const token = await getAuthToken()

  if (!token) {
    return null
  }

  try {
    return await strapiFetch(`/api/users/me?populate=role`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
  } catch (error) {
    console.error('[Auth] getUser error:', error)
    return null
  }
}

export async function getUserWithProfile(): Promise<UserWithProfile | null> {
  'use server'
  try {
    const token = await getAuthToken()
    if (!token) return null

    const profile = await strapiFetch<UserWithProfile | null>(
      '/api/users/me?populate=profile.image',
      {
        token,
        cache: 'no-store',
      }
    )

    if (!profile) {
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
    console.error('[Auth] getUserWithProfile error:', error)
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
    console.error('[Auth] clearInvalidAuthCookie error:', error)
    await clearAuthCookie()
  }
}

// Middleware helper
export async function isAuthenticated(): Promise<boolean> {
  'use server'
  const token = await getAuthToken()

  return !!token
}
