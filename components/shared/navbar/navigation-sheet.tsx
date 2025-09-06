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
// import { NavMenu } from './nav-menu'

import { MenuItem, StrapiImage, User } from '@/types/shared-types'
import Image from 'next/image'

interface NavigationSheetProps {
  isLoggedIn?: boolean
  logo?: StrapiImage
  user?: User | null
  onLogout?: () => void
  menuItems?: MenuItem[] // <-- Add this prop
}

export const NavigationSheet = ({
  isLoggedIn,
  user,
  onLogout,
  logo,
  menuItems = [],
}: NavigationSheetProps) => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="sr-only">Main Navigation</SheetTitle>
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

        {/* <NavMenu
          orientation="vertical"
          className="mt-12"
          menuItems={menuItems}
        /> */}

        {isLoggedIn && user && (
          <div className="mt-8 border-t pt-6">
            <div className="flex flex-col gap-4">
              <Button variant="ghost" className="justify-start">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" className="justify-start">
                <Link href="/dashboard/courses">Courses </Link>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-destructive"
                onClick={onLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        )}

        <div className="mt-12 text-base space-y-6">
          {/* Render top-level links */}
          <div className="flex flex-col gap-2">
            {topLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target={link.target || '_self'}
                className="py-2 px-1 rounded hover:bg-accent transition"
              >
                {link.title}
              </Link>
            ))}
            {/* Hard-coded Sign In/Sign Up for guests */}
            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="py-2 px-1 rounded hover:bg-accent transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="py-2 px-1 rounded hover:bg-accent transition"
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
