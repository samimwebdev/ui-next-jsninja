import { StrapiImage } from './shared-types'

export interface EnrolledUser {
  id: number
  documentId: string
  courseId: string | null
  courseTitle: string
  userId: string
  userEmail: string
  userName: string
  userProfileImage: StrapiImage | string
}

export interface EnrolledUsersResponse {
  data: EnrolledUser[]
  meta: Record<string, unknown>
}
