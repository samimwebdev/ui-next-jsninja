'use client'
import { Logo } from '@/components/shared/navbar/logo'
import { NavMenu } from '@/components/shared/navbar/nav-menu'
import { NavigationSheet } from '@/components/shared/navbar/navigation-sheet'
import { ThemeSwitcher } from '@/components/shared/navbar/theme-switcher'
import { NotificationPanel } from '@/components/shared/navbar/notification-panel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UserNav } from './user-nav'
import { logoutAction } from '@/app/(auth)/actions'
import { MenuItem, StrapiImage } from '@/types/shared-types'
import Image from 'next/image'
import { useCurrentUser } from '@/hooks/use-current-user'
import { NavigationSkeleton } from './navigation-skeleton'

export const Navigation = ({
  menuItems,
  logo,
}: {
  menuItems: MenuItem[]
  logo?: StrapiImage
}) => {
  const { data: currentUser, isLoading } = useCurrentUser()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && mounted) {
      setIsLoggedIn(!!currentUser)
    }
  }, [currentUser, isLoading, mounted])

  const logout = async () => {
    try {
      await logoutAction()
      setIsLoggedIn(false)
    } catch (err) {
      console.log(err, 'Logout failed')
    }
  }

  // Show skeleton only during initial mount or when actually loading
  if (!mounted || (isLoading && !currentUser)) {
    return <NavigationSkeleton menuItems={menuItems} logo={logo} variant="loading" />
  }

  return (
    <div className="bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/">
              {logo?.url ? (
                <Image
                  width={200}
                  height={50}
                  src={logo.url}
                  alt={logo.alternativeText || 'Logo'}
                  className="h-8 w-auto"
                />
              ) : (
                <Logo />
              )}
            </Link>
            {/* Desktop Menu */}
            <NavMenu className="hidden md:block" menuItems={menuItems} />
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <NotificationPanel />
                <UserNav user={currentUser || null} onLogout={() => logout()} />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" className="hidden sm:inline-flex h-10">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="h-10">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
            <ThemeSwitcher />
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet
                isLoggedIn={isLoggedIn}
                user={isLoggedIn ? currentUser : null}
                onLogout={() => logout()}
                menuItems={menuItems}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
