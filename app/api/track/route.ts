import { NextRequest, NextResponse } from 'next/server'
import {
  serverSideGAEvent,
  serverSideFBEvent,
  getClientIP,
  getUserAgent,
  generateClientId,
  hashEmail,
} from '@/lib/analytics'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      event_name,
      event_type = 'both',
      ga_parameters = {},
      fb_user_data = {},
      fb_custom_data = {},
      email,
    } = body

    const user_ip = getClientIP(request)
    const user_agent = getUserAgent(request)

    // Get or generate client ID for GA
    let client_id = request.cookies.get('_ga_client_id')?.value
    if (!client_id) {
      client_id = generateClientId()
    }

    // Generate unique event ID for deduplication
    const event_id = uuidv4()

    // Hash email if provided (for privacy compliance)
    if (email) {
      fb_user_data.em = hashEmail(email)
    }

    let ga_success = false
    let fb_success = false

    // Track with Google Analytics
    if (event_type === 'ga' || event_type === 'both') {
      try {
        await serverSideGAEvent(
          event_name,
          client_id,
          ga_parameters,
          user_ip,
          user_agent
        )
        ga_success = true
      } catch (error) {
        console.error('GA tracking failed:', error)
      }
    }

    // Track with Facebook Pixel
    if (event_type === 'fb' || event_type === 'both') {
      try {
        await serverSideFBEvent(
          event_name,
          event_id,
          fb_user_data,
          fb_custom_data,
          user_ip,
          user_agent
        )
        fb_success = true
      } catch (error) {
        console.error('Facebook tracking failed:', error)
      }
    }

    const response = NextResponse.json({
      success: ga_success || fb_success,
      ga_success,
      fb_success,
      event_id,
      client_id,
      event_name,
    })

    // Set GA client ID cookie if it didn't exist
    if (!request.cookies.get('_ga_client_id')?.value) {
      response.cookies.set('_ga_client_id', client_id, {
        maxAge: 60 * 60 * 24 * 730, // 2 years
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }

    return response
  } catch (error) {
    console.error('Server-side tracking error:', error)
    return NextResponse.json(
      {
        error: 'Tracking failed',
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
