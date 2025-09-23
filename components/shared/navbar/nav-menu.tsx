'use client'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { MenuItem } from '@/types/shared-types'
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

// Component to safely render SVG strings from API
const SVGIcon = ({ svgString }: { svgString: string }) => {
  if (!svgString) return null

  const fixedSvgString = svgString.replace(
    /xmlns=" http:\/\/www\.w3\.org\/2000\/svg\`  "/g,
    'xmlns="http://www.w3.org/2000/svg"'
  )

  return (
    <div
      className="mb-4 w-6 h-6 [&>svg]:w-full [&>svg]:h-full [&>svg]:text-ninja-gold-light dark:[&>svg]:text-ninja-gold-dark [&>svg]:fill-current [&>svg]:stroke-current"
      dangerouslySetInnerHTML={{ __html: fixedSvgString }}
    />
  )
}

export const NavMenu = ({
  menuItems = [],
  ...props
}: NavigationMenuProps & { menuItems?: MenuItem[] }) => {
  const pathname = usePathname()

  // Don't render anything if no menu items (prevents layout shift)
  if (!menuItems.length) {
    return null
  }

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-1 space-x-0 text-sm">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.children &&
              item.children.some((child) => pathname === child.url))

          if (item.children && item.children.length > 0) {
            return (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuTrigger
                  className={cn(
                    'text-[15px] font-normal transition-colors',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                >
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background dark:bg-card border border-border">
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {item.children.map((child) => (
                      <DynamicListItem
                        key={child.id}
                        title={child.title}
                        href={child.url}
                        target={child.target}
                        icon={child.icon}
                      >
                        {child?.shortDescription}
                      </DynamicListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }

          const isCurrentPage = pathname === item.url

          return (
            <NavigationMenuItem key={item.id}>
              <Button
                variant="ghost"
                className={cn(
                  'text-[15px] font-normal transition-colors',
                  isCurrentPage && 'bg-accent text-accent-foreground'
                )}
                asChild
              >
                <Link href={item.url} target={item.target || '_self'}>
                  {item.title}
                </Link>
              </Button>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

interface DynamicListItemProps {
  title: string
  href: string
  target?: string
  icon?: string
  className?: string
  children?: React.ReactNode
}

const DynamicListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  DynamicListItemProps
>(({ className, title, children, href, target, icon, ...props }, ref) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'flex flex-col items-center justify-center select-none space-y-2 rounded-md p-4 leading-none no-underline outline-none transition-all duration-200',
            'hover:bg-ninja-gold/10 hover:text-ninja-gold hover:border-ninja-gold/30',
            'dark:hover:bg-ninja-gold/15 dark:hover:text-ninja-gold dark:hover:border-ninja-gold/30',
            'focus:bg-ninja-gold/10 focus:text-slate-800 focus:border-ninja-gold/20',
            'dark:focus:bg-ninja-gold/15 dark:focus:text-ninja-gold dark:focus:border-ninja-gold/30',
            'border border-transparent text-slate-700 dark:text-foreground',
            isActive &&
              'bg-ninja-gold/15 text-ninja-gold border-ninja-gold/30 dark:bg-ninja-gold/20',
            className
          )}
          href={href}
          target={target || '_self'}
          {...props}
        >
          {icon && (
            <div className="mb-2 text-ninja-gold-light dark:text-ninja-gold-dark">
              <SVGIcon svgString={icon} />
            </div>
          )}
          <div className="text-sm font-semibold leading-none text-center transition-colors">
            {title}
          </div>
          {children && (
            <p className="line-clamp-2 text-xs leading-snug text-slate-600 dark:text-muted-foreground text-center transition-colors">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  )
})

DynamicListItem.displayName = 'DynamicListItem'

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { icon: LucideIcon }
>(({ className, title, children, ...props }, ref) => {
  const pathname = usePathname()
  const isActive = pathname === props.href

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors',
            'hover:bg-ninja-gold/10 hover:text-slate-800',
            'dark:hover:bg-ninja-gold/15 dark:hover:text-ninja-gold',
            'focus:bg-ninja-gold/10 focus:text-slate-800',
            'dark:focus:bg-ninja-gold/15 dark:focus:text-ninja-gold',
            'text-slate-700 dark:text-foreground',
            isActive &&
              'bg-ninja-gold/15 text-ninja-gold dark:bg-ninja-gold/20',
            className
          )}
          {...props}
        >
          <props.icon className="mb-4 h-6 w-6 text-slate-700 dark:text-ninja-gold transition-colors" />
          <div className="text-sm font-semibold leading-none text-slate-700 dark:text-foreground transition-colors">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-600 dark:text-muted-foreground transition-colors">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = 'ListItem'
