'use client'

import * as React from 'react'
import { Bell, Check, Clock, Loader2 } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

// Generate more notifications for infinite scrolling demo
const generateNotifications = (startId = 1, count = 10) => {
  const types = [
    'course',
    'assignment',
    'certificate',
    'comment',
    'promotion',
    'blog',
    'bootcamp',
    'security',
    'event',
    'progress',
  ]
  const titles = [
    'New Course Available',
    'Assignment Due',
    'Certificate Ready',
    'New Comment',
    'Course Discount',
    'New Blog Post',
    'Bootcamp Registration',
    'Account Security',
    'Webinar Invitation',
    'Course Progress',
  ]
  const messages = [
    'Check out our new React Advanced course with updated content!',
    "Your JavaScript assignment is due tomorrow. Don't forget to submit!",
    'Your certificate is ready to download.',
    'Someone commented on your project: "Great work!"',
    '50% off on all courses this week only!',
    'Check out our latest blog post on Next.js features',
    'Registration for the Developer Bootcamp is now open',
    'We noticed a login from a new device. Please verify if it was you.',
    'Join our webinar on "Building Scalable Applications" this Friday',
    "You've completed 75% of your current course!",
  ]
  const timeUnits = ['minutes', 'hours', 'days', 'weeks']

  return Array.from({ length: count }, (_, i) => {
    const id = startId + i
    const typeIndex = id % types.length
    const timeValue = (id % 12) + 1
    const timeUnit = timeUnits[id % timeUnits.length]

    return {
      id,
      title: titles[typeIndex],
      message: messages[typeIndex],
      time: `${timeValue} ${timeUnit} ago`,
      read: id % 3 === 0, // Make every third notification read
      type: types[typeIndex],
    }
  })
}

// Initial notifications
const initialNotifications = generateNotifications(1, 10)

type NotificationType = 'all' | 'unread'

export function NotificationPanel() {
  const [notifications, setNotifications] = React.useState(initialNotifications)
  const [activeTab, setActiveTab] = React.useState<NotificationType>('all')
  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [hasMore, setHasMore] = React.useState(true)

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications =
    activeTab === 'all' ? notifications : notifications.filter((n) => !n.read)

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const loadMoreNotifications = React.useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const nextPage = page + 1
    const newNotifications = generateNotifications(page * 10 + 1, 10)

    setNotifications((prev) => [...prev, ...newNotifications])
    setPage(nextPage)

    // Stop loading after 5 pages for demo purposes
    if (nextPage >= 5) {
      setHasMore(false)
    }

    setIsLoading(false)
  }, [isLoading, page, hasMore])

  // Handle scroll to bottom
  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement
      const scrollBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight

      // Load more when user scrolls to bottom (within 50px)
      if (scrollBottom < 50 && !isLoading && hasMore) {
        loadMoreNotifications()
      }
    },
    [loadMoreNotifications, isLoading, hasMore]
  )

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course':
      case 'bootcamp':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )
      case 'assignment':
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-yellow-600 dark:text-yellow-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        )
      case 'certificate':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600 dark:text-green-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
      case 'security':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-red-600 dark:text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-600 dark:text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        )
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="end">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">Notifications</div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs ml-auto"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Mark all read
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setActiveTab(value as NotificationType)}
        >
          <div className="border-b px-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all" className="text-xs">
                All
                <Badge variant="secondary" className="ml-2 px-1 py-0 h-5">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread
                <Badge variant="secondary" className="ml-2 px-1 py-0 h-5">
                  {unreadCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            <ScrollArea
              className="h-[350px] hover:overflow-y-auto"
              onScroll={handleScroll}
              type="hover"
              preventScroll={true}
            >
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 cursor-pointer hover:bg-muted transition-colors',
                        !notification.read && 'bg-muted/50'
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p
                              className={cn(
                                'text-sm font-medium',
                                !notification.read && 'font-semibold'
                              )}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="p-4 flex justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {!isLoading && !hasMore && (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No more notifications
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p>No notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="m-0">
            <ScrollArea
              className="h-[350px] hover:overflow-y-auto"
              onScroll={handleScroll}
              type="hover"
              preventScroll={true}
            >
              {filteredNotifications.length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 cursor-pointer hover:bg-muted transition-colors bg-muted/50"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">
                              {notification.title}
                            </p>
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && activeTab === 'unread' && (
                    <div className="p-4 flex justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Check className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p>No unread notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
