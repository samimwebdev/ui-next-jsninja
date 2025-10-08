'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
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
        className="h-5 w-5 mr-2 text-muted-foreground inline-block [&>svg]:w-full [&>svg]:h-full [&>svg]:text-slate-700 dark:[&>svg]:text-ninja-gold [&>svg]:fill-current [&>svg]:stroke-current"
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
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="sr-only">Main Navigation</SheetTitle>

        {/* Logo */}
        <Link href="/" onClick={handleLinkClick}>
          {logo?.formats?.thumbnail ? (
            <Image
              // width={150}
              // height={70}
              src={logo.formats.thumbnail.url}
              alt={logo.alternativeText || 'Logo'}
              className="object-contain"
              fill
            />
          ) : (
            <Logo />
          )}
        </Link>

        {/* User Section for Logged In Users */}
        {isLoggedIn && user && (
          <div className="mt-8 border-t pt-6">
            <div className="flex flex-col gap-2">
              <Link href="/dashboard" onClick={handleLinkClick}>
                <Button variant="ghost" className="justify-start w-full">
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/courses" onClick={handleLinkClick}>
                <Button variant="ghost" className="justify-start w-full">
                  My Courses
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="justify-start text-destructive w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="mt-12 text-base space-y-6">
          {/* Top-level links */}
          <div className="flex flex-col gap-2">
            {topLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target={link.target || '_self'}
                className="py-2 px-1 rounded hover:bg-accent transition"
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
                  className="py-2 px-1 rounded hover:bg-accent transition"
                  onClick={handleLinkClick}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="py-2 px-1 rounded hover:bg-accent transition"
                  onClick={handleLinkClick}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Divider */}
          {(courseSection || bootcampSection) && (
            <div className="border-t my-4" />
          )}

          {/* Courses Section */}
          {courseSection && (
            <div>
              <div className="font-bold mb-2">{courseSection.title}</div>
              <ul className="space-y-3 ml-1 pl-3 border-l">
                {courseSection?.children?.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={course.url}
                      target={course.target || '_self'}
                      className="flex items-center gap-3 py-2 px-1 rounded hover:bg-accent transition"
                      onClick={handleLinkClick}
                    >
                      {course.icon && <SVGIcon svgString={course.icon} />}
                      <span>{course.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bootcamps Section */}
          {bootcampSection && (
            <div>
              <div className="font-bold mb-2">{bootcampSection.title}</div>
              <ul className="space-y-3 ml-1 pl-3 border-l">
                {bootcampSection?.children?.map((bootcamp) => (
                  <li key={bootcamp.id}>
                    <Link
                      href={bootcamp.url}
                      target={bootcamp.target || '_self'}
                      className="flex items-center gap-3 py-2 px-1 rounded hover:bg-accent transition"
                      onClick={handleLinkClick}
                    >
                      {bootcamp.icon && <SVGIcon svgString={bootcamp.icon} />}
                      <span>{bootcamp.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
