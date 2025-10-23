'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { Menu, Home, BookOpen, User as UserIcon, LogOut } from 'lucide-react'
import Link from 'next/link'
import { Logo } from './logo'
import { MenuItem, StrapiImage, User } from '@/types/shared-types'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavigationSheetProps {
  isLoggedIn?: boolean
  logo?: StrapiImage
  user?: User | null
  onLogout?: () => void
  menuItems?: MenuItem[]
}

export const NavigationSheet = ({
  isLoggedIn,
  user,
  onLogout,
  logo,
  menuItems = [],
}: NavigationSheetProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Helper to check if a link is active
  const isActiveLink = (url: string) => {
    if (url === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(url)
  }

  // Helper to close sheet when link is clicked
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  // Helper to handle logout and close sheet
  const handleLogout = () => {
    onLogout?.()
    setIsOpen(false)
  }

  // Helper to render SVG icon from string
  const SVGIcon = ({ svgString }: { svgString: string }) =>
    svgString ? (
      <span
        className="h-5 w-5 flex-shrink-0 text-muted-foreground inline-flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:text-slate-700 dark:[&>svg]:text-ninja-gold [&>svg]:fill-current [&>svg]:stroke-current"
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    ) : null

  // Top-level links (no children)
  const topLinks = menuItems.filter(
    (item) => !item.children || item.children.length === 0
  )

  // Section links (with children)
  const courseSection = menuItems.find(
    (item) =>
      item.title.toLowerCase().includes('course') && item.children?.length
  )
  const bootcampSection = menuItems.find(
    (item) =>
      item.title.toLowerCase().includes('bootcamp') && item.children?.length
  )

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[350px] overflow-y-auto"
      >
        <SheetTitle className="sr-only">Main Navigation</SheetTitle>

        {/* Logo Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <Link href="/" onClick={handleLinkClick} className="inline-block">
            {logo?.formats?.thumbnail ? (
              <Image
                width={150}
                height={70}
                src={logo.formats.thumbnail.url}
                alt={logo.alternativeText || 'Logo'}
                className="object-contain h-16 sm:h-20 w-auto mx-auto"
                priority
              />
            ) : (
              <Logo />
            )}
          </Link>
        </div>

        {/* User Section for Logged In Users */}
        {isLoggedIn && user && (
          <div className="mb-6 pb-6 border-b">
            <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-accent/50">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-ninja-gold to-ninja-orange flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold truncate">
                  {user.username || user.email}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Link href="/dashboard" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className={cn(
                    'justify-start w-full hover:bg-accent text-sm sm:text-base py-2 sm:py-2.5',
                    isActiveLink('/dashboard') && 'bg-accent font-semibold'
                  )}
                >
                  <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/courses" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className={cn(
                    'justify-start w-full hover:bg-accent text-sm sm:text-base py-2 sm:py-2.5',
                    isActiveLink('/dashboard/courses') &&
                      'bg-accent font-semibold'
                  )}
                >
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                  My Courses
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10 w-full text-sm sm:text-base py-2 sm:py-2.5"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="space-y-6">
          {/* Top-level links */}
          <div className="space-y-1">
            {topLinks.map((link) => {
              const isActive = isActiveLink(link.url)
              return (
                <Link
                  key={link.id}
                  href={link.url}
                  target={link.target || '_self'}
                  className={cn(
                    'flex items-center px-3 py-2.5 sm:py-3 rounded-lg hover:bg-accent transition-colors font-medium text-sm sm:text-base relative',
                    isActive && 'bg-accent font-semibold'
                  )}
                  onClick={handleLinkClick}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-ninja-gold to-ninja-orange rounded-r-full" />
                  )}
                  <span className={cn(isActive && 'ml-2')}>{link.title}</span>
                </Link>
              )
            })}

            {/* Auth links for guests */}
            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className={cn(
                    'flex items-center px-3 py-2.5 sm:py-3 rounded-lg hover:bg-accent transition-colors font-medium text-sm sm:text-base relative',
                    isActiveLink('/login') && 'bg-accent font-semibold'
                  )}
                  onClick={handleLinkClick}
                >
                  {isActiveLink('/login') && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-ninja-gold to-ninja-orange rounded-r-full" />
                  )}
                  <span className={cn(isActiveLink('/login') && 'ml-2')}>
                    Login
                  </span>
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    'flex items-center px-3 py-2.5 sm:py-3 rounded-lg hover:bg-accent transition-colors font-medium text-sm sm:text-base relative',
                    isActiveLink('/register') && 'bg-accent font-semibold'
                  )}
                  onClick={handleLinkClick}
                >
                  {isActiveLink('/register') && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-ninja-gold to-ninja-orange rounded-r-full" />
                  )}
                  <span className={cn(isActiveLink('/register') && 'ml-2')}>
                    Register
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Divider */}
          {(courseSection || bootcampSection) && (
            <div className="border-t pt-6" />
          )}

          {/* Courses Section */}
          {courseSection && (
            <div>
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-3 px-3">
                {courseSection.title}
              </h3>
              <ul className="space-y-1">
                {courseSection?.children?.map((course) => {
                  const isActive = isActiveLink(course.url)
                  return (
                    <li key={course.id}>
                      <Link
                        href={course.url}
                        target={course.target || '_self'}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-lg hover:bg-accent transition-colors group text-sm sm:text-base relative',
                          isActive && 'bg-accent font-semibold'
                        )}
                        onClick={handleLinkClick}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-ninja-gold to-ninja-orange rounded-r-full" />
                        )}
                        {course.icon && <SVGIcon svgString={course.icon} />}
                        <span
                          className={cn(
                            'group-hover:translate-x-0.5 transition-transform',
                            isActive && !course.icon && 'ml-2'
                          )}
                        >
                          {course.title}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Bootcamps Section */}
          {bootcampSection && (
            <div>
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-3 px-3">
                {bootcampSection.title}
              </h3>
              <ul className="space-y-1">
                {bootcampSection?.children?.map((bootcamp) => {
                  const isActive = isActiveLink(bootcamp.url)
                  return (
                    <li key={bootcamp.id}>
                      <Link
                        href={bootcamp.url}
                        target={bootcamp.target || '_self'}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-lg hover:bg-accent transition-colors group text-sm sm:text-base relative',
                          isActive && 'bg-accent font-semibold'
                        )}
                        onClick={handleLinkClick}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-ninja-gold to-ninja-orange rounded-r-full" />
                        )}
                        {bootcamp.icon && <SVGIcon svgString={bootcamp.icon} />}
                        <span
                          className={cn(
                            'group-hover:translate-x-0.5 transition-transform',
                            isActive && !bootcamp.icon && 'ml-2'
                          )}
                        >
                          {bootcamp.title}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
