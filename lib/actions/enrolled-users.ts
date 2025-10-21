import { strapiFetch } from '@/lib/strapi'
import { EnrolledUsersResponse } from '@/types/enrolled-users'

export async function getEnrolledUsers(
  courseId?: string
): Promise<EnrolledUsersResponse> {
  try {
    const path = courseId
      ? `/api/enrolled-users?courseId=${courseId}`
      : '/api/enrolled-users'

    const response = await strapiFetch<EnrolledUsersResponse>(path, {
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: ['enrolled-users', `course-${courseId}`],
      },
      cache: 'force-cache',
    })

    return response
  } catch (error) {
    console.error('Error fetching enrolled users:', error)
    // Return empty data on error
    return {
      data: [],
      meta: {},
    }
  }
}

// Helper function to get user avatar URL
export function getUserAvatarUrl(
  userProfileImage:
    | string
    | { url: string; formats?: { thumbnail?: { url: string } } }
): string {
  // If it's a string (external URL like GitHub avatar)
  if (typeof userProfileImage === 'string') {
    return userProfileImage
  }

  // If it's an object (Strapi media), prefer thumbnail
  if (userProfileImage?.formats?.thumbnail?.url) {
    return userProfileImage.formats.thumbnail.url
  }

  // Fallback to main URL
  return userProfileImage?.url || ''
}
