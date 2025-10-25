'use client'

import type React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    badge?: string | number
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col space-y-1', className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            pathname === item.href
              ? 'bg-gradient-ninja-primary text-ninja-navy hover:bg-gradient-ninja-reverse'
              : 'text-muted-foreground hover:bg-muted',
            'relative'
          )}
        >
          <div className="flex items-center">
            {pathname === item.href && (
              <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-ninja-navy dark:bg-ninja-gold" />
            )}
            <span className={cn(pathname === item.href && 'ml-2')}>
              {item.title}
            </span>
          </div>
          {item.badge !== undefined && (
            <Badge
              variant={pathname === item.href ? 'secondary' : 'default'}
              className="ml-auto text-xs"
            >
              {item.badge}
            </Badge>
          )}
        </Link>
      ))}
    </nav>
  )
}
