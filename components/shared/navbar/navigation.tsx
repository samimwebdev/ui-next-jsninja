import { Logo } from '@/components/shared/navbar/logo'
import { NavMenu } from '@/components/shared/navbar/nav-menu'
import { NavigationSheet } from '@/components/shared/navbar/navigation-sheet'
import { ThemeSwitcher } from '@/components/shared/navbar/theme-switcher'
import { Button } from '@/components/ui/button'

export const Navigation = () => {
  return (
    <div className="bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            {/* Desktop Menu */}
            <NavMenu className="hidden md:block" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button>Sign Up</Button>
            <ThemeSwitcher />
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
