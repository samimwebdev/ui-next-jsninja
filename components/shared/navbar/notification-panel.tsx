'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import {
  Bell,
  Check,
  Clock,
  Loader2,
  AlertTriangle,
  Wifi,
  WifiOff,
} from 'lucide-react'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/actions/notification'
import { Notification, NotificationsResponse } from '@/types/notification-types'
import {
  formatNotificationTime,
  truncateContent,
} from '@/lib/notification-utils'
import { usePusherNotifications } from '@/hooks/use-pusher-notifications'
import { useCurrentUser } from '@/hooks/use-current-user'

type NotificationType = 'all' | 'unread'

function NotificationSkeleton() {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="h-3 bg-muted rounded w-full animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorMessage({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="p-8 text-center">
      <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-destructive" />
      <p className="text-sm text-destructive mb-4">{message}</p>
      <Button size="sm" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  )
}

function EmptyState({ type }: { type: 'all' | 'unread' }) {
  return (
    <div className="p-8 text-center text-muted-foreground">
      <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
        {type === 'unread' ? (
          <Check className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Bell className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <p>
        {type === 'unread' ? 'No unread notifications' : 'No notifications'}
      </p>
    </div>
  )
}

export function NotificationPanel() {
  const [activeTab, setActiveTab] = React.useState<NotificationType>('all')
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Get current user for Pusher subscription
  const { data: currentUser } = useCurrentUser()

  const userDocumentId = currentUser?.documentId || null

  // Set up Pusher real-time notifications
  const { isConnected } = usePusherNotifications({
    userDocumentId,
    enabled: !!userDocumentId,
  })

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 0,
    refetchOnWindowFocus: true,
  })

  // Mark single notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationDocumentId) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        ['notifications'],
        (oldData: NotificationsResponse | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.map((notification: Notification) =>
              notification.documentId === notificationDocumentId
                ? { ...notification, isRead: true }
                : notification
            ),
          }
        }
      )
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description: error.message || 'Failed to mark notification as read',
      })
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  // Mark all notifications as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Optimistically update the cache
      queryClient.setQueryData(
        ['notifications'],
        (oldData: NotificationsResponse | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.map((notification: Notification) => ({
              ...notification,
              isRead: true,
            })),
          }
        }
      )
      toast.success('Success', {
        description: 'All notifications marked as read',
      })
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description:
          error.message || 'Failed to mark all notifications as read',
      })
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const notifications = notificationsData?.data || []

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const filteredNotifications =
    activeTab === 'all' ? notifications : notifications.filter((n) => !n.isRead)

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.documentId)
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      setIsOpen(false)
      router.push(notification.actionUrl)
    }
  }

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsReadMutation.mutate()
    }
  }

  const getNotificationIcon = (type: string) => {
    const iconClasses = 'w-4 h-4'

    switch (type) {
      case 'course':
      case 'bootcamp':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg
              className={`${iconClasses} text-blue-600 dark:text-blue-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
              className={`${iconClasses} text-yellow-600 dark:text-yellow-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
              className={`${iconClasses} text-green-600 dark:text-green-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
              className={`${iconClasses} text-red-600 dark:text-red-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )
      case 'success':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
            <svg
              className={`${iconClasses} text-emerald-600 dark:text-emerald-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )
      case 'info':
        return (
          <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
            <svg
              className={`${iconClasses} text-sky-600 dark:text-sky-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <svg
              className={`${iconClasses} text-amber-600 dark:text-amber-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
            <svg
              className={`${iconClasses} text-rose-600 dark:text-rose-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <Bell
              className={`${iconClasses} text-purple-600 dark:text-purple-300`}
            />
          </div>
        )
    }
  }

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {/* Real-time connection indicator */}
            <div className="absolute -bottom-1 -right-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      isConnected ? 'bg-green-500' : 'bg-gray-400'
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>
                    {isConnected
                      ? 'Real-time connected'
                      : 'Real-time disconnected'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="end">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-semibold">Notifications</div>
              {/* Connection status indicator */}
              <Tooltip>
                <TooltipTrigger asChild>
                  {isConnected ? (
                    <Wifi className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <WifiOff className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isConnected
                      ? 'Real-time updates active'
                      : 'Real-time updates inactive'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs ml-auto"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 mr-1" />
              )}
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
              <ScrollArea className="h-[350px]" type="hover">
                {isLoading ? (
                  <NotificationSkeleton />
                ) : error ? (
                  <ErrorMessage
                    message={
                      error instanceof Error
                        ? error.message
                        : 'Failed to load notifications'
                    }
                    onRetry={() => refetch()}
                  />
                ) : notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.documentId}
                        className={cn(
                          'p-4 cursor-pointer hover:bg-muted transition-colors',
                          !notification.isRead && 'bg-muted/50'
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p
                                className={cn(
                                  'text-sm font-medium',
                                  !notification.isRead && 'font-semibold'
                                )}
                              >
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {truncateContent(notification.content)}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatNotificationTime(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState type="all" />
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              <ScrollArea className="h-[350px]" type="hover">
                {isLoading ? (
                  <NotificationSkeleton />
                ) : error ? (
                  <ErrorMessage
                    message={
                      error instanceof Error
                        ? error.message
                        : 'Failed to load notifications'
                    }
                    onRetry={() => refetch()}
                  />
                ) : filteredNotifications.length > 0 ? (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.documentId}
                        className="p-4 cursor-pointer hover:bg-muted transition-colors bg-muted/50"
                        onClick={() => handleNotificationClick(notification)}
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
                              {truncateContent(notification.content)}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatNotificationTime(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState type="unread" />
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
