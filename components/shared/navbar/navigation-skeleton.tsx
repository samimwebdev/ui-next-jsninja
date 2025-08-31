// components/shared/navbar/navigation-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeSwitcher } from './theme-switcher'
import { Logo } from './logo'
import { NavMenu } from './nav-menu'
import { MenuItem, StrapiImage } from '@/types/shared-types'
import Image from 'next/image'
import Link from 'next/link'

interface NavigationSkeletonProps {
  menuItems: MenuItem[]
  logo?: StrapiImage
  variant?: 'loading' | 'auth-check'
}

export function NavigationSkeleton({
  menuItems,
  logo,
  variant = 'loading'
}: NavigationSkeletonProps) {
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
            {variant === 'loading' ? (
              // Generic loading state - could be either logged in or out
              <>
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-32 rounded-md" />
              </>
            ) : (
              // Auth check state - show placeholder for potential logged in state
              <>
                {/* Notification panel placeholder */}
                <div className="relative">
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
                
                {/* User nav placeholder */}
                <div className="flex items-center gap-2 p-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="hidden sm:block">
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
              </>
            )}
            
            <ThemeSwitcher />
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
