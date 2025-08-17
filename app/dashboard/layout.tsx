import type React from 'react'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { UserProfile } from '@/components/dashboard/user-profile'
import { FlashMessageHandler } from '@/components/shared/flash-message-handler'

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/dashboard/profile',
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
  },
  {
    title: 'Enrolled Courses',
    href: '/dashboard/courses',
  },
  {
    title: 'Login History',
    href: '/dashboard/login-history',
  },
  {
    title: 'Course Stats',
    href: '/dashboard/stats',
  },
  {
    title: 'Leaderboard',
    href: '/dashboard/leaderboard',
  },
  {
    title: 'Certificates',
    href: '/dashboard/certificates',
  },
  {
    title: 'Reviews',
    href: '/dashboard/reviews',
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FlashMessageHandler />
      <UserProfile />
      <div className="container flex-1 items-start py-8 md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:block">
          <div className="py-6 pr-6 lg:py-8">
            <SidebarNav items={sidebarNavItems} />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
