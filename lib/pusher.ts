// lib/pusher.ts
import Pusher from 'pusher-js'

let pusher: Pusher | null = null

export function getPusherInstance(): Pusher {
  if (!pusher) {
    pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    // Enable logging in development
    // if (process.env.NODE_ENV === 'development') {
    //   Pusher.logToConsole = true
    // }
  }

  return pusher
}

export function disconnectPusher() {
  if (pusher) {
    pusher.disconnect()
    pusher = null
  }
}
