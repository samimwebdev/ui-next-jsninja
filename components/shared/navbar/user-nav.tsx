import type { User } from '@/components/context/AuthProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { profile } from 'console'
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react'
import Link from 'next/link'

interface UserNavProps {
  user: User | null
  onLogout?: () => void
}

export function getProfileImageUrl(user: User | null): string | undefined {
  // First, check if imageUrl exists (direct URL like GitHub avatar)
  if (user?.profile?.imageUrl) {
    return user.profile.imageUrl
  }

  // Then, check if there's a Strapi uploaded image
  if (user?.profile?.image?.formats?.medium?.url) {
    // If it's a relative URL, prepend Strapi base URL
    const imageUrl = user.profile.image.formats.medium.url
    if (imageUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`
    }
    return imageUrl
  }

  // Fallback to original image if medium doesn't exist
  if (user?.profile?.image?.url) {
    const imageUrl = user.profile.image.url
    if (imageUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`
    }
    return imageUrl
  }

  return undefined
}

export function UserNav({ user, onLogout }: UserNavProps) {
  const profileImageUrl = getProfileImageUrl(user)
  console.log(user, 'UserNav user data')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profileImageUrl ? getProfileImageUrl(user) : undefined}
              alt={user?.profile?.firstName}
            />
            <AvatarFallback>
              {user?.profile?.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>
              <Link href="/dashboard">Dashboard</Link>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>
              <Link href="/dashboard/courses">courses</Link>
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
