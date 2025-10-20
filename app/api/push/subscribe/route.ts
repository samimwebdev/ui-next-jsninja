import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subscription, userAgent } = body

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      )
    }

    // Forward to Strapi
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/push-subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription,
          userAgent,
          endpoint: subscription.endpoint,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Strapi error:', errorData)
      throw new Error(errorData.error?.message || 'Failed to save subscription')
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error saving push subscription:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to save subscription',
      },
      { status: 500 }
    )
  }
}
