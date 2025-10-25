import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const ACCESS_COOKIE = process.env.ACCESS_COOKIE || 'jsn_jwt'
const REFRESH_COOKIE = process.env.REFRESH_COOKIE || 'jsn_refresh'

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
    // ✅ Increased buffer to 5 minutes - refresh if less than 5 minutes remaining
    return decoded.exp < currentTime + 300
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
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      console.error('[Middleware] Refresh token failed:', response.status)
      return null
    }

    const data: RefreshResponse = await response.json()
    return data
  } catch (error) {
    console.error('[Middleware] Token refresh error:', error)
    return null
  }
}

/**
 * Set authentication cookies on response
 */
export function setAuthCookies(
  response: NextResponse,
  jwt: string,
  refreshToken: string
) {
  response.cookies.set(ACCESS_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  })

  response.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

/**
 * Clear authentication cookies
 */
function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE)
  response.cookies.delete(REFRESH_COOKIE)
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get cookies
  const tokenCookie = request.cookies.get(ACCESS_COOKIE)
  const refreshCookie = request.cookies.get(REFRESH_COOKIE)

  const token = tokenCookie?.value
  const refreshToken = refreshCookie?.value

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // ✅ CASE 1: No tokens at all
  if (!token && !refreshToken) {
    // ✅ Only log if trying to access protected route
    if (isProtectedRoute) {
      console.log('[Auth] No tokens found, redirecting to login:', pathname)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // ✅ Silent pass for public routes and auth routes
    return NextResponse.next()
  }

  // ✅ CASE 2: Has refresh token, check if we need to refresh access token
  if (refreshToken) {
    const needsRefresh = !token || isTokenExpired(token)
    const refreshTokenExpired = isTokenExpired(refreshToken)

    // ✅ If refresh token itself is expired, logout user
    if (refreshTokenExpired) {
      console.log('[Auth] Refresh token expired')
      if (isProtectedRoute) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        loginUrl.searchParams.set('session_expired', 'true')
        const response = NextResponse.redirect(loginUrl)
        clearAuthCookies(response)
        return response
      }
      // Clear cookies for non-protected routes too
      const response = NextResponse.next()
      clearAuthCookies(response)
      return response
    }

    // ✅ Refresh access token if needed
    if (needsRefresh) {
      console.log('Need Refresh [auth]')
      const refreshResult = await refreshAccessToken(refreshToken)

      if (refreshResult) {
        console.log('[Auth] Access token refreshed successfully')

        // ✅ Create appropriate response
        let response: NextResponse

        if (isAuthRoute) {
          // Redirect authenticated users away from auth routes
          const dashboardUrl = new URL('/dashboard/courses', request.url)
          response = NextResponse.redirect(dashboardUrl)
        } else {
          // Continue to requested route
          response = NextResponse.next()
        }

        // Set new tokens
        setAuthCookies(response, refreshResult.jwt, refreshResult.refreshToken)

        return response
      } else {
        console.log('[Auth] Refresh failed, clearing session')
        // ✅ Refresh failed - logout user
        if (isProtectedRoute) {
          const loginUrl = new URL('/login', request.url)
          loginUrl.searchParams.set('redirect', pathname)
          loginUrl.searchParams.set('session_invalid', 'true')
          const response = NextResponse.redirect(loginUrl)
          clearAuthCookies(response)
          return response
        }

        // Clear cookies for non-protected routes
        const response = NextResponse.next()
        clearAuthCookies(response)
        return response
      }
    }
  }

  // ✅ CASE 3: Has valid access token
  if (token && !isTokenExpired(token)) {
    // Redirect authenticated users from auth routes
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard/courses', request.url))
    }

    // Allow access to all other routes
    return NextResponse.next()
  }

  // ✅ CASE 4: Fallback - no valid tokens
  if (isProtectedRoute) {
    console.log('[Auth] Invalid tokens, redirecting to login:', pathname)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// ✅ Configure which paths the middleware should run on
// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack-hmr (hot module replacement)
     * - api routes that handle their own auth
     * - static files (images, fonts, etc.)
     * - metadata files (favicon, sitemap, robots, manifest)
     * - service worker files
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|sitemap.xml|robots.txt|manifest.json|sw.js|workbox-.*\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|css|js|map)$).*)',
  ],
}
