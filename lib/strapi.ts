import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL!
const ACCESS_COOKIE = process.env.ACCESS_COOKIE || 'jsn_jwt'
const REFRESH_COOKIE = process.env.REFRESH_COOKIE || 'jsn_refresh'
// This file is used to interact with the Strapi API.
// It provides a function to fetch data from the Strapi backend.
// The function supports custom headers, caching, and Next.js revalidation.
export async function strapiFetch<T>(
  path: string,
  options: RequestInit & {
    token?: string
    cache?: RequestCache
    next?: {
      revalidate?: number | false
      tags?: string[]
    }
    allowNotFound?: boolean // New option to handle 404s differently
    returnErrorResponse?: boolean // New option to return error responses instead of throwing
  } = {}
): Promise<T> {
  const {
    cache = 'default',
    token,
    next,
    returnErrorResponse = false,
    allowNotFound = false,
    ...rest
  } = options

  try {
    const res = await fetch(`${STRAPI}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache, // 'no-store' | '' | 'default'
      next, // supports { revalidate, tags } for Next.js 15
      ...rest,
    })

    if (!res.ok) {
      const errorData = await res.json()

      // ✅ Handle 401 Unauthorized
      if (res.status === 401) {
        const cookieStore = await cookies()
        const refreshCookie = cookieStore.get(REFRESH_COOKIE)

        if (!refreshCookie) {
          console.log('No RefreshToken  in strapi fetch')
          // No refresh token, redirect to login
          redirect('/login?session_expired=true')
        }

        try {
          const refreshToken = refreshCookie?.value
          // Try to refresh token via middleware
          const refreshResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/refresh`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
              cache: 'no-store',
            }
          )

          console.log(
            { refreshResponse },
            'new Access Token using refreshToken in strapi fetch'
          )
          if (refreshResponse.ok) {
            const accessCookie = cookieStore.get(ACCESS_COOKIE)
            const token = accessCookie?.value
            console.log('Get AccessToken using refresh Token in strapi fetch')
            // Token refreshed, retry original request
            const retryResponse = await fetch(`${STRAPI}${path}`, {
              headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              cache, // 'no-store' | '' | 'default'
              next, // supports { revalidate, tags } for Next.js 15
              ...rest,
            })
            if (!retryResponse.ok) {
              throw new Error(`HTTP error! status: ${retryResponse.status}`)
            }
            return await retryResponse.json()
          } else {
            // Token refresh failed, redirect to login
            redirect('/login?session_expired=true')
          }
        } catch (err) {
          console.error('Error during token refresh:', err)
        }
      }

      //  For 404 responses with allowNotFound=true, return the error structure
      if (res.status === 404 && allowNotFound) {
        return {
          data: null,
          error: {
            status: 404,
            name: 'NotFoundError',
            message: errorData?.error?.message || 'Resource not found',
            details: errorData?.error?.details || {},
          },
        } as T
      }

      // For security endpoints, return error responses instead of throwing
      if (returnErrorResponse) {
        return {
          data: null,
          error: {
            status: res.status,
            name: errorData?.error?.name || 'APIError',
            message: errorData?.error?.message || 'Server Error',
            details: errorData?.error?.details || {},
          },
        } as T
      }

      // For other status codes or when returnErrorResponse=false, throw error
      throw new Error(errorData?.error?.message || 'Server Error')
    }

    return res.json()
  } catch (err) {
    let message = 'Something went wrong'

    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === 'string') {
      message = err
    }

    throw new Error(message)
  }
}
