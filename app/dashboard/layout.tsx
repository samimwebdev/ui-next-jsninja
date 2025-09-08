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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <FlashMessageHandler />

      {/* User Profile Header */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserProfile />
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 pb-8">
          {/* Sidebar */}
          <aside className="md:sticky md:top-8 md:h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <SidebarNav items={sidebarNavItems} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
