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
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { MenuItem } from '@/app/layout'

// Component to safely render SVG strings from API
const SVGIcon = ({ svgString }: { svgString: string }) => {
  if (!svgString) return null

  // Fix potential namespace issues in SVG
  const fixedSvgString = svgString.replace(
    /xmlns=" http:\/\/www\.w3\.org\/2000\/svg\`  "/g,
    'xmlns="http://www.w3.org/2000/svg"'
  )

  return (
    <div
      className="mb-4 w-6 h-6"
      dangerouslySetInnerHTML={{ __html: fixedSvgString }}
    />
  )
}

export const NavMenu = ({
  menuItems = [],
  ...props
}: NavigationMenuProps & { menuItems?: MenuItem[] }) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-0 space-x-0 text-sm">
      <>
        {menuItems.map((item) => {
          // If the menu item has children, render a dropdown
          if (item.children && item.children.length > 0) {
            return (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuTrigger className="text-[15px] font-normal">
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
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

          // If the menu item has no children, render a simple link
          return (
            <NavigationMenuItem key={item.id}>
              <Button
                variant="ghost"
                className="text-[15px] font-normal"
                asChild
              >
                <Link href={item.url} target={item.target || '_self'}>
                  {item.title}
                </Link>
              </Button>
            </NavigationMenuItem>
          )
        })}
      </>
    </NavigationMenuList>
  </NavigationMenu>
)

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
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'flex flex-col items-center justify-center select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          href={href}
          target={target || '_self'}
          {...props}
        >
          {icon
            ? SVGIcon({ svgString: icon }) // Render SVG icon if provided
            : null}
          <div className="text-sm font-semibold leading-none text-center">
            {title}
          </div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground text-center">
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
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <props.icon className="mb-4 h-6 w-6" />
          <div className="text-sm font-semibold leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
