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

export const Navigation = ({
  menuItems,
  logo,
}: {
  menuItems: MenuItem[]
  logo?: StrapiImage
}) => {
  const { data: currentUser, isLoading } = useCurrentUser()
  const [mounted, setMounted] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logout = async () => {
    try {
      await logoutAction()
    } catch (err) {
      console.log(err, 'Logout failed')
    }
  }

  const isLoggedIn = mounted && !isLoading && !!currentUser
  const shouldShowSkeleton = !mounted || isLoading

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
                  width={150}
                  height={70}
                  src="/logo.png"
                  alt="Javascript Ninja"
                  className={`object-contain transition-opacity duration-300 ${
                    logo?.formats?.thumbnail && logoLoaded
                      ? 'opacity-0'
                      : 'opacity-100'
                  }`}
                  priority
                />

                {/* API Logo - overlay on top when loaded */}
                {logo?.formats?.thumbnail && (
                  <Image
                    width={150}
                    height={70}
                    src={logo.formats.thumbnail.url}
                    alt={logo.alternativeText || 'Logo'}
                    className={`absolute inset-0 object-contain transition-opacity duration-300 ${
                      logoLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setLogoLoaded(true)}
                    onError={() => setLogoLoaded(false)}
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
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex h-10"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="h-10" asChild>
                  <Link href="/register">Sign Up</Link>
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
