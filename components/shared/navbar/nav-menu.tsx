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
import { courses, bootCamps } from './config'

export const NavMenu = (props: NavigationMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-0 space-x-0 text-sm">
      <NavigationMenuItem>
        <Button variant="ghost" className="text-[15px] font-normal" asChild>
          <Link href="/">Home</Link>
        </Button>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Button variant="ghost" className="text-[15px] font-normal" asChild>
          <Link href="/generic">Generic</Link>
        </Button>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="text-[15px] font-normal">
          Course
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {courses.map((course) => (
              <ListItem
                key={course.title}
                title={course.title}
                icon={course.icon}
                href="/courses/mastering-java-script-1"
              >
                {course.description}
              </ListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="text-[15px] font-normal">
          Bootcamp
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {bootCamps.map((bootcamp) => (
              <ListItem
                key={bootcamp.title}
                title={bootcamp.title}
                icon={bootcamp.icon}
                href="/bootcamps/mastering-java-script-bootcamp"
              >
                {bootcamp.description}
              </ListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
)

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
