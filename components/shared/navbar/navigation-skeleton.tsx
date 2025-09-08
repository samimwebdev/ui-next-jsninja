// components/shared/navbar/navigation-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeSwitcher } from './theme-switcher'
import { NavMenu } from './nav-menu'
import { MenuItem, StrapiImage } from '@/types/shared-types'
import Link from 'next/link'
import Image from 'next/image'

interface NavigationSkeletonProps {
  menuItems: MenuItem[]
  logo?: StrapiImage
}

export function NavigationSkeleton({ menuItems }: NavigationSkeletonProps) {
  return (
    <div className="bg-muted">
      <nav className="h-20 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            {/* Logo - always show placeholder to prevent layout shift */}
            <Link href="/" className="flex items-center mr-2 sm:mr-2 p-2">
              <div className="relative w-[150px] h-[70px]">
                <Image
                  width={150}
                  height={70}
                  src="/logo.png"
                  alt="Javascript Ninja"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <NavMenu className="hidden md:block" menuItems={menuItems} />
          </div>

          {/* Right side skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <ThemeSwitcher />
            <div className="md:hidden">
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
