// Shared Image types
export interface StrapiImage {
  id: number
  documentId: string
  name: string
  url: string
  alternativeText?: string | null
  caption?: string | null
  width: number
  height: number
  formats?: {
    thumbnail?: ImageFormat
    small?: ImageFormat
    medium?: ImageFormat
    large?: ImageFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  previewUrl?: string | null
  provider: string
  provider_metadata?: {
    public_id: string
    resource_type: string
  }
  folderPath: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale?: string | null
}

export interface ImageFormat {
  name: string
  hash: string
  ext: string
  mime: string
  path: string | null
  width: number
  height: number
  size: number
  sizeInBytes: number
  url: string
  provider_metadata?: {
    public_id: string
    resource_type: string
  }
}

// Shared Icon type
export interface StrapiIcon {
  iconName: string
  iconData: string
  width: number
  height: number
}

// Shared Category type
export interface Category {
  id: number
  documentId: string
  name: string
  description: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

// Shared Button type
export interface ButtonType {
  id: number
  btnLabel: string
  btnLink: string | null
  btnIcon?: StrapiIcon
}

// Shared Profile type
export interface Profile {
  id: number
  documentId: string
  firstName: string
  lastName: string
  address?: string
  bio?: string
  discordUsername?: string
  phoneNumber?: string | null
  email?: string | null
  imageUrl?: string | null
  image?: StrapiImage
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
}

// Shared Review type
export interface Review {
  id: number
  documentId: string
  rating: number
  reviewApproved: boolean
  reviewDetails: string
  reviewerName: string
  profile?: Profile
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

export interface Video {
  id: number
  title: string
  shortDescription: string
  videoURL: string
}
export interface Instructor {
  id: number
  documentId: string
  name: string
  title: string
  bio: string
  profile: Profile
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

export interface Lesson {
  id: number
  documentId: string
  title: string
  order: number
  duration: number
  type: 'Video' | 'Text' | 'Quiz' | 'Assignment'
  content?: string | null
  videoUrl?: string
  isFree: boolean
  icon?: StrapiIcon | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

export interface Module {
  id: number
  documentId: string
  title: string
  description?: string | null
  order: number
  duration: number
  lessons: Lesson[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
}

export interface Curriculum {
  id: number
  title: string
  description: string
  modules: Module[]
}

// Shared SEO types
export interface MetaSocial {
  id: number
  socialNetwork: string
  title: string
  description: string
  image?: StrapiImage
}

export interface SEOData {
  id: number
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  metaRobots?: string
  structuredData?: Record<string, unknown> | string | null
  metaViewport?: string
  canonicalURL?: string
  metaSocial?: MetaSocial[]
  metaImage?: StrapiImage
}

// Shared Course Base type
export interface CourseBase {
  id: number
  documentId: string
  title: string
  slug: string
  price: number
  level: string
  featured?: boolean
  totalStudents: number
  averageRating: number
  totalLessons: number
  shortDescription?: string
  longDescription?: string
  duration: number | string
  startingFrom?: string
  courseType?: 'course' | 'bootcamp' | 'workshop'
  categories: Category[]
  featureImage?: StrapiImage
  seo?: SEOData
}

export interface Project {
  id: number
  documentId: string
  title: string
  description: string
  technology: string
  image: StrapiImage
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

export interface Feature {
  id: number
  feature: string
}

export interface HighlightFeature {
  id: number
  title: string
  icon: StrapiIcon | null
  features: Feature[]
}

// Shared Strapi Response type
export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}
