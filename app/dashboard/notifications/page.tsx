import PushSubscribeButton from '@/components/push-subscription/push-subscriber-button'

export default function PushNotificationsPage() {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Push Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Manage your push notification preferences
        </p>
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Enable Push Notifications</h4>
          <p className="text-sm text-muted-foreground">
            Receive real-time notifications about course updates, achievements,
            and more.
          </p>
        </div>

        <PushSubscribeButton vapidPublicKey={vapidPublicKey} />
      </div>
    </div>
  )
}
