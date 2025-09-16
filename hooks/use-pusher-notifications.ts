// hooks/use-pusher-notifications.ts
import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Pusher, { Channel } from 'pusher-js'
import { getPusherInstance } from '@/lib/pusher'
import {
  PusherNotificationEvent,
  Notification,
  NotificationsResponse,
} from '@/types/notification-types'

interface UsePusherNotificationsProps {
  userDocumentId: string | null
  enabled?: boolean
}

export function usePusherNotifications({
  userDocumentId,
  enabled = true,
}: UsePusherNotificationsProps) {
  const queryClient = useQueryClient()
  const channelRef = useRef<Channel | null>(null)
  const pusherRef = useRef<Pusher | null>(null)

  // // Helper function to determine if user is admin and modify content
  // const processNotificationContent = (
  //   data: PusherNotificationEvent,
  //   currentUserDocumentId: string
  // ): { title: string; content: string } => {
  //   const isAuthorityUser = data.data.primaryRecipient !== currentUserDocumentId

  //   if (!isAuthorityUser) {
  //     // User is the primary recipient, use original content
  //     return {
  //       title: data.title,
  //       content: data.message,
  //     }
  //   }

  //   // User is authority user, modify content to show who performed the action
  //   const authorityUserTitle = getAuthorityUserTitle(data.type, data.title)
  //   const authorityUserContent = getAuthorityUserContent(
  //     data.type,
  //     data.message,
  //     data.data
  //   )

  //   return {
  //     title: authorityUserTitle,
  //     content: authorityUserContent,
  //   }
  // }

  // // Helper function to generate authority user-specific titles
  // const getAuthorityUserTitle = (
  //   type: string,
  //   originalTitle: string
  // ): string => {
  //   switch (type) {
  //     case 'success':
  //       if (originalTitle.includes('Course Enrollment')) {
  //         return 'New Course Enrollment'
  //       }
  //       if (originalTitle.includes('Certificate')) {
  //         return 'Certificate Awarded'
  //       }
  //       if (originalTitle.includes('Assignment')) {
  //         return 'Assignment Submitted'
  //       }
  //       if (originalTitle.includes('Progress')) {
  //         return 'Progress Update'
  //       }
  //       break
  //     case 'course':
  //     case 'bootcamp':
  //       return 'Course Enrollment'
  //     case 'certificate':
  //       return 'Certificate Activity'
  //     case 'assignment':
  //       return 'Assignment Activity'
  //     case 'progress':
  //       return 'Student Progress'
  //     default:
  //       return 'System Notification'
  //   }
  //   return originalTitle
  // }

  // // Helper function to generate authority user-specific content
  // const getAuthorityUserContent = (
  //   type: string,
  //   originalMessage: string,
  //   data: PusherNotificationEvent['data']
  // ): string => {
  //   const courseName = data.courseName || 'a course'
  //   const courseType = data.courseType || 'course'

  //   // Get the actual user who performed the action (primary recipient)
  //   const primaryRecipient = data.primaryRecipient
  //   const userIdentifier = primaryRecipient
  //     ? `User-${primaryRecipient}`
  //     : 'A user'

  //   switch (type) {
  //     case 'success':
  //       if (originalMessage.includes('enrolled')) {
  //         return `${userIdentifier} enrolled in ${courseName} ${courseType}`
  //       }
  //       if (originalMessage.includes('certificate')) {
  //         return `${userIdentifier} received a certificate for ${courseName}`
  //       }
  //       if (originalMessage.includes('assignment')) {
  //         return `${userIdentifier} submitted an assignment for ${courseName}`
  //       }
  //       if (originalMessage.includes('completed')) {
  //         return `${userIdentifier} completed ${courseName}`
  //       }
  //       if (originalMessage.includes('progress')) {
  //         return `${userIdentifier} made progress in ${courseName}`
  //       }
  //       break

  //     case 'course':
  //     case 'bootcamp':
  //       return `${userIdentifier} has enrolled in ${courseName} ${courseType}`

  //     case 'certificate':
  //       return `${userIdentifier} has certificate activity for ${courseName}`

  //     case 'assignment':
  //       return `${userIdentifier} has assignment activity in ${courseName}`

  //     case 'progress':
  //       return `${userIdentifier} made progress in ${courseName}`

  //     case 'info':
  //       if (originalMessage.includes('enrolled')) {
  //         return `${userIdentifier} enrolled in ${courseName}`
  //       }
  //       return `System information regarding ${courseName}`

  //     case 'warning':
  //       return `Warning notification for ${courseName}`

  //     case 'error':
  //       return `Error notification regarding ${courseName}`

  //     default:
  //       // Fallback: try to modify generic messages
  //       if (originalMessage.includes('You have been enrolled')) {
  //         return originalMessage.replace(
  //           'You have been enrolled',
  //           `${userIdentifier} enrolled`
  //         )
  //       }
  //       if (originalMessage.includes('You have')) {
  //         return originalMessage.replace('You have', `${userIdentifier} has`)
  //       }
  //       if (originalMessage.includes('Your')) {
  //         return originalMessage.replace('Your', `${userIdentifier}'s`)
  //       }
  //       return `${userIdentifier}: ${originalMessage}`
  //   }

  //   return originalMessage
  // }

  // Shared notification handler
  const handleNotification = (
    eventType: string,
    data: PusherNotificationEvent,
    toastType: 'success' | 'info' | 'warning' | 'error' | 'success'
  ) => {
    // Process content based on user role
    const { title, message: content } = data

    // Transform Pusher event to notification format
    const newNotification: Notification = {
      id: data.id,
      documentId: data.documentId,
      title,
      content,
      createdAt: data.timestamp,
      type: data.type,
      priority: data.priority,
      actionUrl: data?.actionUrl,
      data: data.data,
      isRead: false,
      userId: userDocumentId!,
      userEmail: '',
    }

    // Update React Query cache with new notification
    queryClient.setQueryData(
      ['notifications'],
      (oldData: NotificationsResponse | undefined) => {
        if (!oldData) {
          return {
            data: [newNotification],
          }
        }

        // Check if notification already exists to prevent duplicates
        const existingNotification = oldData.data.find(
          (n) => n.documentId === newNotification.documentId
        )

        if (existingNotification) {
          return oldData
        }

        // Add new notification to the beginning of the list
        return {
          ...oldData,
          data: [newNotification, ...oldData.data],
        }
      }
    )

    // Show toast notification
    const toastFunction =
      toastType === 'success'
        ? toast.success
        : toastType === 'info'
        ? toast.info
        : toastType === 'warning'
        ? toast.warning
        : toast.error

    toastFunction(title, {
      description: content,
      action: data.actionUrl
        ? {
            label: eventType.includes('assignment') ? 'Assignment' : 'View',
            onClick: () => {
              window.location.href = data.actionUrl
            },
          }
        : undefined,
      duration: 5000,
    })
  }

  useEffect(() => {
    if (!userDocumentId || !enabled) {
      return
    }

    try {
      // Get Pusher instance
      pusherRef.current = getPusherInstance()

      // Subscribe to user channel
      const channelName = `user-${userDocumentId}`
      channelRef.current = pusherRef.current.subscribe(channelName)

      // Handle course enrollment notifications
      channelRef.current.bind(
        'course-enrollment',
        (data: PusherNotificationEvent) => {
          handleNotification('course-enrollment', data, 'success')
        }
      )

      // Handle Bundle enrollment notifications
      channelRef.current.bind(
        'bundle-enrollment',
        (data: PusherNotificationEvent) => {
          handleNotification('bundle-enrollment', data, 'success')
        }
      )

      // Handle Course completion notifications
      channelRef.current.bind(
        'course-completion',
        (data: PusherNotificationEvent) => {
          handleNotification('course-completion', data, 'success')
        }
      )

      // Handle Certificate Issued notifications
      channelRef.current.bind(
        'certificate-issued',
        (data: PusherNotificationEvent) => {
          handleNotification('certificate-issued', data, 'success')
        }
      )
      // Handle assignment notifications
      channelRef.current.bind(
        'assignment-submission',
        (data: PusherNotificationEvent) => {
          handleNotification('assignment-submission', data, 'info')
        }
      )
      // Handle assignment reviewed notifications
      channelRef.current.bind(
        'assignment-reviewed',
        (data: PusherNotificationEvent) => {
          handleNotification('assignment-reviewed', data, 'info')
        }
      )

      // Handle review Submission notifications
      channelRef.current.bind(
        'review-submission',
        (data: PusherNotificationEvent) => {
          handleNotification('review-submission', data, 'info')
        }
      )

      // Handle review Approval notifications
      channelRef.current.bind(
        'review-approval',
        (data: PusherNotificationEvent) => {
          handleNotification('review-approval', data, 'info')
        }
      )

      // Handle Course review delete notifications
      channelRef.current.bind(
        'review-delete',
        (data: PusherNotificationEvent) => {
          handleNotification('review-delete', data, 'info')
        }
      )
      // Handle progress notifications
      channelRef.current.bind(
        'progress-update',
        (data: PusherNotificationEvent) => {
          handleNotification('progress-update', data, 'info')
        }
      )

      // Handle other notification types
      channelRef.current.bind(
        'course-completion',
        (data: PusherNotificationEvent) => {
          handleNotification('course-completion', data, 'info')
        }
      )

      channelRef.current.bind(
        'review-submission',
        (data: PusherNotificationEvent) => {
          handleNotification('review-submission', data, 'success')
        }
      )
      channelRef.current.bind(
        'user-blocked',
        (data: PusherNotificationEvent) => {
          handleNotification('user-blocked', data, 'warning')
        }
      )

      channelRef.current.bind(
        'system-maintenance',
        (data: PusherNotificationEvent) => {
          handleNotification('system-maintenance', data, 'error')
        }
      )

      //handle order placement notification
      channelRef.current.bind(
        'order-placement',
        (data: PusherNotificationEvent) => {
          handleNotification('order-placement', data, 'success')
        }
      )

      // Handle connection state
      if (pusherRef.current.connection) {
        pusherRef.current.connection.bind('connected', () => {
          console.info('Pusher connected')
        })

        pusherRef.current.connection.bind('disconnected', () => {
          console.info('Pusher disconnected')
        })

        pusherRef.current.connection.bind('error', (error?: Error) => {
          console.error('Pusher connection error:', error)
        })
      }
    } catch (error) {
      console.error('Error setting up Pusher:', error)
    }

    // Cleanup function
    return () => {
      if (channelRef.current && pusherRef.current) {
        channelRef.current.unbind_all()
        pusherRef.current.unsubscribe(`user-${userDocumentId}`)
        channelRef.current = null
      }
    }
    //eslint-disable-next-line
  }, [userDocumentId, enabled, queryClient])

  return {
    isConnected: pusherRef.current?.connection?.state === 'connected',
  }
}
