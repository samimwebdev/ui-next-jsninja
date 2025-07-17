'use client'
import { Logo } from '@/components/shared/navbar/logo'
import { NavMenu } from '@/components/shared/navbar/nav-menu'
import { NavigationSheet } from '@/components/shared/navbar/navigation-sheet'
import { ThemeSwitcher } from '@/components/shared/navbar/theme-switcher'
import { NotificationPanel } from '@/components/shared/navbar/notification-panel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { UserNav } from './user-nav'
import { useUser } from '@/components/context/AuthProvider'
import { logoutAction } from '@/app/(auth)/actions'

// Demo user for testing
// const demoUser = {
//   id: 1,
//   documentId: '12345',
//   email: 'demo@example.com',
//   username: 'demoUser',
// }

export const Navigation = () => {
  const user = useUser()
  console.log({ user })
  const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false) // Set to true to show logged in state by default

  const logout = async () => {
    await logoutAction()
    setIsLoggedIn(false)
  }
  return (
    <div className="bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/">
              <Logo />
            </Link>
            {/* Desktop Menu */}
            <NavMenu className="hidden md:block" />
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <NotificationPanel />
                <UserNav user={user} onLogout={() => setIsLoggedIn(false)} />
              </>
            ) : (
              <>
                <Button variant="outline" className="hidden sm:inline-flex">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
            <ThemeSwitcher />
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet
                isLoggedIn={isLoggedIn}
                user={isLoggedIn ? user : null}
                onLogout={() => logout()}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
