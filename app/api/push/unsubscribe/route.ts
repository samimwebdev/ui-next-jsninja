import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { endpoint } = await request.json()

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint required' }, { status: 400 })
    }

    // Find subscription(s) by endpoint from Strapi
    const findResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_STRAPI_URL
      }/api/push-subscriptions?filters[endpoint][$eq]=${encodeURIComponent(
        endpoint
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!findResponse.ok) {
      throw new Error('Failed to find subscription')
    }

    const { data } = await findResponse.json()

    // Delete each matching subscription
    if (data && data.length > 0) {
      await Promise.all(
        data.map((sub) =>
          fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/push-subscriptions/${sub.documentId}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing push subscription:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to remove subscription',
      },
      { status: 500 }
    )
  }
}
