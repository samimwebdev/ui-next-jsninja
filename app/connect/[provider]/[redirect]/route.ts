// ./src/app/connect/[provider]/[redirect]/route.ts

import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth'
import { strapiFetch } from '@/lib/strapi'
import qs from 'qs'

interface ProfileData {
  id: number
  firstName: string
  lastName: string
  email: string
  imageUrl: string
  bio: string
  address: string
}

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string; redirect: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('access_token')

    if (!token) return NextResponse.redirect(new URL('/', request.url))

    // Await the params Promise to get the actual params object
    const { provider } = await context.params

    // Exchange access token with Strapi
    const res = await strapiFetch<{
      jwt: string
      user: {
        id: number
        username: string
        email: string
        documentId: string
      }
    }>(`/api/auth/${provider}/callback?access_token=${token}`)

    await setAuthCookie(res.jwt)

    // Check if profile already exists for this user
    const query = qs.stringify({
      filters: {
        user: {
          documentId: {
            $eq: res.user.documentId,
          },
        },
      },
    })

    const existingProfile = await strapiFetch<{
      data: Array<ProfileData>
    }>(`/api/profiles?${query}`, {
      headers: {
        Authorization: `Bearer ${res.jwt}`,
      },
    })

    // Only create profile if it doesn't exist
    if (!existingProfile.data || existingProfile.data.length === 0) {
      // Fetch user details from GitHub
      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'frontend-ninja',
        },
      })

      const githubUser = await githubUserResponse.json()

      // Parse name from GitHub (name field or fallback to username)
      const fullName = githubUser.name || githubUser.login || ''
      const [firstName = '', lastName = ''] = fullName.split(' ')

      const profileData = {
        data: {
          firstName,
          lastName,
          email: res.user.email,
          user: res.user.documentId, // Attach the user ID from the registration response
          imageUrl: githubUser.avatar_url || '',
          bio: githubUser.bio || '',
          address: githubUser.location || '',
        },
      }

      //create a new profile attached to the registered user
      await strapiFetch('/api/profiles', {
        method: 'POST',
        body: JSON.stringify(profileData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${res.jwt}`,
        },
      })
      console.log('New profile created')
    } else {
      console.log('Profile already exists, skipping creation')
    }

    return NextResponse.redirect(new URL('/dashboard/courses', request.url))
  } catch (error) {
    console.error('GitHub auth callback error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
