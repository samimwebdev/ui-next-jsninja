'use server'

import { fetchEnrolledCourses } from '@/lib/actions/enrolled-courses'

export async function checkEnrollmentStatus(
  courseSlug: string
): Promise<boolean> {
  try {
    const enrolledCourses = await fetchEnrolledCourses({ isPublicPage: true })

    // Safely extract courses - default to empty array if no data
    const courses = enrolledCourses?.data
      ? [...enrolledCourses.data.courses, ...enrolledCourses.data.bootcamps]
      : []

    // Check if the user is enrolled in this course
    return courses.some(
      (course) => course.slug === courseSlug && course.isExpired === false
    )
  } catch (error) {
    console.error('Error checking enrollment status:', error)
    return false
  }
}
