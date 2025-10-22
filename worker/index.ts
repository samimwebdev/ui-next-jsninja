// service-worker.js

import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  cleanupOutdatedCaches: true,
})

// ✅ Push notification handler
self.addEventListener('push', function (event: PushEvent) {
  console.log('========================================')
  console.log('[SW] 🔔 PUSH EVENT RECEIVED')
  console.log('[SW] Has data:', !!event.data)
  console.log('========================================')

  let notificationData = {
    title: 'Javascript Ninja',
    body: 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    url: '/',
    tag: 'notification',
    timestamp: Date.now(),
  }

  if (event.data) {
    try {
      const payload = event.data.json()

      // Handle FCM format or flat format
      if (payload.notification) {
        notificationData = {
          title: payload.notification.title || notificationData.title,
          body: payload.notification.body || notificationData.body,
          icon: payload.notification.icon || notificationData.icon,
          badge: payload.notification.badge || notificationData.badge,
          url: payload.data?.url || notificationData.url,
          tag: payload.data?.tag || 'notification',
          timestamp: payload.data?.timestamp || Date.now(),
        }
      } else {
        // Flat format - merge with defaults
        notificationData = { ...notificationData, ...payload }
      }

      console.log('[SW] 📋 Final notification data:', notificationData)
    } catch (e) {
      console.error('[SW] ❌ JSON parse error:', e)

      try {
        const text = event.data.text()
        notificationData.body = text
      } catch (textError) {
        console.error('[SW] ❌ Text parse error:', textError)
      }
    }
  } else {
    console.warn('[SW] ⚠️ No data in push event')
  }

  // ✅ Create notification options
  const options: NotificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    data: {
      url: notificationData.url,
      timestamp: notificationData.timestamp,
    },
    requireInteraction: false,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: undefined,
      },
      {
        action: 'close',
        title: 'Close',
        icon: undefined,
      },
    ],
  }

  // ✅ CRITICAL: Use event.waitUntil to show notification
  event.waitUntil(
    self.registration
      .showNotification(notificationData.title, options)
      .then(() => {
        console.log('[SW] ✅✅✅ NOTIFICATION SHOWN SUCCESSFULLY ✅✅✅')
      })
      .catch((error) => {
        console.error('[SW] ❌❌❌ FAILED TO SHOW NOTIFICATION ❌❌❌')
        console.error('[SW] Error:', error)
      })
  )
})

// ✅ Notification click handler
self.addEventListener('notificationclick', function (event: NotificationEvent) {
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const urlToOpen = new URL(
    event.notification.data?.url || '/',
    self.location.origin
  ).href

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if window with URL is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }

        // Open new window
        if (self.clients.openWindow) {
          console.log('[SW] Opening new window')
          return self.clients.openWindow(urlToOpen)
        }
      })
      .catch((error) => {
        console.error('[SW] Error handling click:', error)
      })
  )
})

// ✅ Initialize Serwist
serwist.addEventListeners()

console.log(
  '[SW] ✅ Service Worker initialized with push notification handlers'
)
