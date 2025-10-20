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
      <SheetContent side="right" className="w-[300px]  overflow-y-auto">
        <SheetTitle className="sr-only">Main Navigation</SheetTitle>

        {/* Logo Section */}
        <div className="mb-8 text-center">
          <Link href="/" onClick={handleLinkClick} className="block">
            {logo?.formats?.thumbnail ? (
              <Image
                width={150}
                height={70}
                src={logo.formats.thumbnail.url}
                alt={logo.alternativeText || 'Logo'}
                className="object-contain h-20 w-auto"
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
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ninja-gold to-ninja-orange flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.username || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Link href="/dashboard" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className="justify-start w-full hover:bg-accent"
                >
                  <Home className="h-4 w-4 mr-3" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/courses" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className="justify-start w-full hover:bg-accent"
                >
                  <BookOpen className="h-4 w-4 mr-3" />
                  My Courses
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="space-y-6">
          {/* Top-level links */}
          <div className="space-y-1">
            {topLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target={link.target || '_self'}
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors font-medium"
                onClick={handleLinkClick}
              >
                {link.title}
              </Link>
            ))}

            {/* Auth links for guests */}
            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors font-medium"
                  onClick={handleLinkClick}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center px-3 py-2.5 rounded-lg bg-gradient-to-r from-ninja-gold to-ninja-orange text-white hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-sm"
                  onClick={handleLinkClick}
                >
                  Sign Up
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
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 px-3">
                {courseSection.title}
              </h3>
              <ul className="space-y-1">
                {courseSection?.children?.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={course.url}
                      target={course.target || '_self'}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
                      onClick={handleLinkClick}
                    >
                      {course.icon && <SVGIcon svgString={course.icon} />}
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {course.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bootcamps Section */}
          {bootcampSection && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 px-3">
                {bootcampSection.title}
              </h3>
              <ul className="space-y-1">
                {bootcampSection?.children?.map((bootcamp) => (
                  <li key={bootcamp.id}>
                    <Link
                      href={bootcamp.url}
                      target={bootcamp.target || '_self'}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
                      onClick={handleLinkClick}
                    >
                      {bootcamp.icon && <SVGIcon svgString={bootcamp.icon} />}
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {bootcamp.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
