import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

export const COOKIE = 'jsn_jwt'
export const REFRESH_COOKIE = 'jsn_refresh'

interface JWTPayload {
  userId: string
  sessionId: string
  type: 'access' | 'refresh'
  iat: number
  exp: number
}

interface RefreshResponse {
  jwt: string
  refreshToken: string
}

const protectedRoutes = [
  '/dashboard',
  '/checkout',
  '/admin',
  '/course-view',
  '/app-setup',
  '/app-setup-success',
]
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
]

/**
 * Check if token is expired or about to expire
 */
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Math.floor(Date.now() / 1000)
    // Add 60 second buffer - refresh if less than 1 minute remaining
    return decoded.exp < currentTime + 60
  } catch {
    return true
  }
}

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshResponse | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return null
    }

    const data: RefreshResponse = await response.json()
    return data
  } catch (error) {
    console.error('[Middleware] Token refresh error:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get cookies
  const tokenCookie = request.cookies.get(COOKIE)

  const refreshCookie =
    request.cookies.get(REFRESH_COOKIE) ||
    request.cookies.get('strapi_up_refresh')

  let token = tokenCookie?.value
  const refreshToken = refreshCookie?.value

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If access token is missing or expired, try to refresh it
  if (refreshToken && (!token || isTokenExpired(token))) {
    // Check if refresh token itself is expired
    if (!isTokenExpired(refreshToken)) {
      const refreshResult = await refreshAccessToken(refreshToken)

      if (refreshResult) {
        // Create response with refreshed tokens
        const response = NextResponse.next()

        // Set new access token
        response.cookies.set(COOKIE, refreshResult.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 15, // 15 minutes
        })

        // Set new refresh token
        response.cookies.set(REFRESH_COOKIE, refreshResult.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })

        // Update token variable for further checks
        token = refreshResult.jwt

        // For protected routes, return the response with new cookies
        if (isProtectedRoute) {
          return response
        }

        // For auth routes, redirect to dashboard with new cookies
        if (isAuthRoute) {
          const dashboardUrl = new URL('/dashboard/courses', request.url)
          const redirectResponse = NextResponse.redirect(dashboardUrl)

          // Copy the new cookies to redirect response
          redirectResponse.cookies.set(COOKIE, refreshResult.jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 15,
          })

          redirectResponse.cookies.set(
            REFRESH_COOKIE,
            refreshResult.refreshToken,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 30,
            }
          )

          return redirectResponse
        }

        return response
      } else {
        // Refresh failed, clear cookies
        if (isProtectedRoute) {
          const loginUrl = new URL('/login', request.url)
          loginUrl.searchParams.set('redirect', pathname)
          const response = NextResponse.redirect(loginUrl)

          // Clear invalid cookies
          response.cookies.delete(COOKIE)
          response.cookies.delete(REFRESH_COOKIE)

          return response
        }
      }
    } else {
      // Refresh token expired
      if (isProtectedRoute) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        const response = NextResponse.redirect(loginUrl)

        // Clear expired cookies
        response.cookies.delete(COOKIE)
        response.cookies.delete(REFRESH_COOKIE)

        return response
      }
    }
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !token && !refreshToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && (token || refreshToken)) {
    return NextResponse.redirect(new URL('/dashboard/courses', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
