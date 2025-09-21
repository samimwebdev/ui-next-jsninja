'use client'

import { NavMenu } from '@/components/shared/navbar/nav-menu'
import { NavigationSheet } from '@/components/shared/navbar/navigation-sheet'
import { ThemeSwitcher } from '@/components/shared/navbar/theme-switcher'
import { NotificationPanel } from '@/components/shared/navbar/notification-panel'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UserNav } from './user-nav'
import { logoutAction } from '@/app/(auth)/actions'
import { MenuItem, StrapiImage } from '@/types/shared-types'
import Image from 'next/image'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation' // ✅ Add usePathname

export const Navigation = ({
  menuItems,
  logo,
}: {
  menuItems: MenuItem[]
  logo?: StrapiImage
}) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname() // ✅ Get current pathname
  const { data: currentUser, isLoading } = useCurrentUser()
  const [mounted, setMounted] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logout = async () => {
    try {
      // ✅ Clear all user-related queries first
      await queryClient.cancelQueries({ queryKey: ['currentUser'] })
      queryClient.removeQueries({ queryKey: ['currentUser'] })
      queryClient.removeQueries({ queryKey: ['enrolledCourses'] })
      queryClient.removeQueries({ queryKey: ['userProfile'] })
      queryClient.removeQueries({ queryKey: ['notifications'] })

      // ✅ Set currentUser to null immediately for UI feedback
      queryClient.setQueryData(['currentUser'], null)

      // ✅ Then perform the logout action
      await logoutAction()

      // ✅ Clear all caches after logout
      queryClient.clear()

      // ✅ Redirect to login page
      router.push('/login')

      console.log('Logout successful')
    } catch (err) {
      console.error('Logout failed:', err)
      // ✅ Even if logout action fails, clear the cache
      queryClient.clear()
      router.push('/login')
    }
  }

  const isLoggedIn = mounted && !isLoading && !!currentUser

  const shouldShowSkeleton = !mounted || isLoading

  //  Check if current page is login or register
  const isLoginPage = pathname === '/login'
  const isRegisterPage = pathname === '/register'

  return (
    <div className="bg-muted">
      <nav className="h-20 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            {/* Logo Section */}
            <Link href="/" className="flex items-center mr-2 sm:mr-2 p-2">
              <div className="relative w-[150px] h-[100px]">
                {/* Always show placeholder first to prevent layout shift */}
                <Image
                  // width={150}
                  // height={70}
                  src="/logo.png"
                  alt="Javascript Ninja"
                  className={`object-contain transition-opacity duration-300 ${
                    logo?.formats?.thumbnail && logoLoaded
                      ? 'opacity-0'
                      : 'opacity-100'
                  }`}
                  fill // ✅ Add this
                  priority
                />

                {/* API Logo - overlay on top when loaded */}
                {logo?.formats?.thumbnail && (
                  <Image
                    // width={150}
                    // height={70}
                    fill
                    src={logo.formats.thumbnail.url}
                    alt={logo.alternativeText || 'Logo'}
                    className={`absolute inset-0 object-contain transition-opacity duration-300 ${
                      logoLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setLogoLoaded(true)}
                    onError={() => setLogoLoaded(false)}
                    // style={{ width: 'auto', height: '70px' }} // ✅ Add this
                    priority
                  />
                )}
              </div>
            </Link>

            {/* Desktop Menu */}
            <NavMenu className="hidden md:block" menuItems={menuItems} />
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center gap-3">
            {shouldShowSkeleton ? (
              // Loading state - maintain exact same layout
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
                <ThemeSwitcher />
                <div className="md:hidden">
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              </div>
            ) : isLoggedIn ? (
              // Logged in state
              <div className="flex items-center gap-3">
                <NotificationPanel />
                <UserNav user={currentUser} onLogout={logout} />
                <ThemeSwitcher />
                <div className="md:hidden">
                  <NavigationSheet
                    isLoggedIn={true}
                    logo={logo}
                    user={currentUser}
                    onLogout={logout}
                    menuItems={menuItems}
                  />
                </div>
              </div>
            ) : (
              // Logged out state
              <div className="flex items-center gap-3">
                {/* ✅ Enhanced Sign In Button with active state */}
                <Button
                  variant={isLoginPage ? 'default' : 'outline'}
                  className={`hidden sm:inline-flex h-10 transition-colors ${
                    isLoginPage
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>

                {/* ✅ Enhanced Sign Up Button with active state */}
                <Button
                  variant={isRegisterPage ? 'default' : 'outline'}
                  className={`h-10 transition-colors ${
                    isRegisterPage
                      ? 'bg-primary/90 text-primary-foreground shadow-lg ring-2 ring-primary/20'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  asChild
                >
                  <Link href="/register">Register</Link>
                </Button>

                <ThemeSwitcher />
                <div className="md:hidden">
                  <NavigationSheet
                    isLoggedIn={false}
                    logo={logo}
                    user={null}
                    onLogout={logout}
                    menuItems={menuItems}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}
