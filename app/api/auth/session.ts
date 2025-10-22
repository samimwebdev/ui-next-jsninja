import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE } from '@/middleware'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  // Middleware will handle token refresh if needed
  return NextResponse.json({ authenticated: true }, { status: 200 })
}
