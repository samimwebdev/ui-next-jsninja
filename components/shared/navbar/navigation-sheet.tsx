import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Logo } from './logo'
import { NavMenu } from './nav-menu'
import { User } from '@/components/context/AuthProvider'
interface NavigationSheetProps {
  isLoggedIn?: boolean
  user?: User | null
  onLogout?: () => void
}

export const NavigationSheet = ({}: NavigationSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Link href="/">
          <Logo />
          <NavMenu orientation="vertical" className="mt-12" />

          {/* {isLoggedIn && user && (
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
          )} */}
        </Link>

        {/* <div className="mt-12 text-base space-y-4">
          <Link href="/">Home</Link>
          <div>
            <div className="font-bold">courses</div>
            <ul className="mt-2 space-y-3 ml-1 pl-4 border-l">
              {courses.map((course) => (
                <li key={course.title}>
                  <Link
                    href="/courses/random"
                    className="flex items-center gap-2"
                  >
                    <course.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-bold">Bootcamps</div>
            <ul className="mt-2 space-y-3 ml-1 pl-4 border-l">
              {bootCamps.map((bootcamp) => (
                <li key={bootcamp.title}>
                  <Link
                    href="/bootcamps/random"
                    className="flex items-center gap-2"
                  >
                    <bootcamp.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                    {bootcamp.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </SheetContent>
    </Sheet>
  )
}
