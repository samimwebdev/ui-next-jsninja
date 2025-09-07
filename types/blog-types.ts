import { StrapiImage } from './shared-types'

export interface BlogAuthor {
  id: number
  documentId: string
  firstName: string
  lastName: string
  address: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
  discordUsername: string
  bio: string
  phoneNumber: string
  email: string
  imageUrl: string | null
  image: StrapiImage | null
}

export interface BlogCategory {
  id: number
  documentId: string
  name: string
  slug: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

export interface BlogPost {
  id: number
  documentId: string
  title: string
  timeToRead: number
  publishedDate: string
  tags: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale?: string | null
  details: string
  slug: string
  categories?: BlogCategory[]
  author?: BlogAuthor
  relatedBlogs?: BlogPost[]
}

export interface BlogApiResponse {
  data: BlogPost
}

export interface BlogsListApiResponse {
  data: BlogPost[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Simple blog post type for listing (without full details)
export interface SimpleBlogPost {
  id: number
  documentId: string
  title: string
  timeToRead: number
  publishedDate: string
  tags: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  details: string
  slug: string
}
