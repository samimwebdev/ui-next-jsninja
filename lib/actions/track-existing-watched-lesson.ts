import { strapiFetch } from '../strapi'
import { getAuthToken } from '../auth'

export async function trackExistingWatchedLesson(
  userId?: string,
  courseId?: string,
  moduleId?: string,
  lessonId?: string
) {
  console.log({ userId, courseId, moduleId, lessonId })
  // Simulate an API call to check if the lesson has been watched
  const token = await getAuthToken()

  if (token) {
    const lessonProgress = await strapiFetch<
      Promise<{
        data: {
          id: string
          lastPosition: number
          timeSpent: number
          lessonStatus: string
          startedAt: string
          completedAt?: string
        }
      }>
    >(`/api/user-progress/${courseId}/${moduleId}/${lessonId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      allowNotFound: true,
    })

    console.log('Fetched data:', lessonProgress)
    if (lessonProgress.data) {
      return lessonProgress.data.lastPosition
    } else {
      return null
    }
  }
}
