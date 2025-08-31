// types/notification-types.ts
export interface NotificationData {
  courseId?: string
  courseType?: 'course' | 'bootcamp'
  courseName?: string
  courseSlug?: string
  primaryRecipient?: string
  recipients?: string[]
  [key: string]: unknown // For additional dynamic data
}

export interface Notification {
  id: number
  documentId: string
  title: string
  content: string
  createdAt: string
  type:
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'course'
    | 'assignment'
    | 'certificate'
    | 'security'
    | 'promotion'
    | 'blog'
    | 'bootcamp'
    | 'event'
    | 'progress'
  priority: 'low' | 'medium' | 'high'
  actionUrl: string | null
  data: NotificationData
  isRead: boolean
  userId: string
  userEmail: string
}

// Pusher event data structure
export interface PusherNotificationEvent {
  documentId: string
  id: number
  title: string
  message: string // Note: this is 'message' in Pusher, 'content' in API
  type:
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'course'
    | 'assignment'
    | 'certificate'
    | 'security'
    | 'promotion'
    | 'blog'
    | 'bootcamp'
    | 'event'
    | 'progress'
  priority: 'low' | 'medium' | 'high'
  actionUrl: string
  data: NotificationData
  timestamp: string // ISO timestamp from Pusher
}

export interface NotificationsResponse {
  data: Notification[]
}

export interface MarkReadResponse {
  data: {
    message: string
  }
}

export interface MarkAllReadResponse {
  data: {
    message: string
  }
  meta: Record<string, unknown>
}

export interface NotificationApiError {
  data: null
  error: {
    status: number
    name: string
    message: string
    details: Record<string, unknown>
  }
}
