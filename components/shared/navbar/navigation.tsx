'use client'
import { Logo } from '@/components/shared/navbar/logo'
import { NavMenu } from '@/components/shared/navbar/nav-menu'
import { NavigationSheet } from '@/components/shared/navbar/navigation-sheet'
import { ThemeSwitcher } from '@/components/shared/navbar/theme-switcher'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { UserNav } from './user-nav'

// Demo user for testing
const demoUser = {
  name: 'John Doe',
  email: 'john@example.com',
  image: 'https://github.com/shadcn.png',
}

export const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Set to true to show logged in state by default

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
              <UserNav user={demoUser} onLogout={() => setIsLoggedIn(false)} />
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
                user={isLoggedIn ? demoUser : null}
                onLogout={() => setIsLoggedIn(false)}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
