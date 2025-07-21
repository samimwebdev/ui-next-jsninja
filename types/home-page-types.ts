export interface StrapiImage {
  id: number
  documentId: string
  name: string
  url: string
  alternativeText?: string
  caption?: string
  width: number
  height: number
  formats?: {
    thumbnail?: {
      name: string
      hash: string
      ext: string
      mime: string
      width: number
      height: number
      size: number
      url: string
    }
    small?: {
      name: string
      hash: string
      ext: string
      mime: string
      width: number
      height: number
      size: number
      url: string
    }
    medium?: {
      name: string
      hash: string
      ext: string
      mime: string
      width: number
      height: number
      size: number
      url: string
    }
    large?: {
      name: string
      hash: string
      ext: string
      mime: string
      width: number
      height: number
      size: number
      url: string
    }
  }
}

export interface StrapiIcon {
  iconName: string
  iconData: string
  width: number
  height: number
}

export interface HeroSectionData {
  id: number
  __component: 'hero-layout.hero-layout'
  shortLabel: string
  title: string
  shortDescription: string
  promoVideo: string
  courses: Course
}

export interface FeatureSectionData {
  id: number
  __component: 'home-layout.platform-feature'
  title: string
  description: string
  feature: Array<{
    id: number
    title: string
    icon: StrapiIcon
    features: Array<{
      id: number
      feature: string
    }>
  }>
}

export interface TechSectionData {
  id: number
  documentId: string
  __component: 'technology-layout.technology-layout'
  title: string
  techIconContent: Array<{
    id: number
    name: string
    alt: string
    icon: StrapiIcon
  }>
}

interface Category {
  id: number
  documentId: string
  name: string
  description: string
  slug: string
}

interface ButtonType {
  id: number
  btnLabel: string
  btnLink: string
  btnIcon?: StrapiIcon
}
export interface Course {
  id: number
  documentId: string
  title: string
  shortDescription?: string
  longDescription?: string
  startingFrom?: string
  slug: string
  price: number
  level: string
  totalStudents: number
  averageRating: number
  duration: number | string
  totalLessons: number
  courseType?: 'course' | 'bootcamp' | 'workshop'
  featureImage?: StrapiImage
  categories: Category[]
  browseCoursesBtn: ButtonType
}

export interface CourseSectionData {
  id: number
  __component: 'home-layout.feature-course'
  title: string
  description: string
  courseBases: Course[]
}

export interface BootcampSectionData {
  id: number
  __component: 'home-layout.feature-bootcamp'
  title: string
  description: string
  browseCoursesBtn: ButtonType
  courseBases: Course[]
}

export interface Profile {
  id: number
  firstName: string
  lastName: string
  bio?: string
  discordUsername?: string
  documentId: string
  image: StrapiImage
  imageUrl?: string
}

export interface Review {
  id: number
  rating: number
  reviewApproved: boolean
  reviewDetails: string
  reviewerName: string
  course: Course
  profile: Profile
}

export interface ReviewSectionData {
  id: number
  __component: 'review-layout.review-layout'
  title: string
  description: string
  reviews: Review[]
}
export interface StatsCounter {
  id: number
  statsLabel: string
  statsCount: number
  icon: StrapiIcon
}

export interface StatsSectionData {
  id: number
  __component: 'home-layout.home-stats'
  title: string
  description: string
  statsCounter: StatsCounter[]
}

export interface Blog {
  id: number
  documentId: string
  timeToRead: number
  title: string
  publishedDate: string
  tags: string
  slug: string
  details: string
  categories: Category[]
  thumbnail: StrapiImage
}

export interface BlogSectionData {
  id: number
  __component: 'home-layout.feature-post'
  title: string
  description: string
  blogs: Blog[]
}

export interface Video {
  id: number
  title: string
  shortDescription: string
  videoURL: string
}

export interface BrowseVideosBtn {
  id: number
  btnLabel: string
  btnIcon: StrapiIcon
  btnLink: string
}

export interface VideoSectionData {
  id: number
  __component: 'demo-videos-layout.demo-videos'
  title: string
  description: string
  videos: Video[]
  browseVideosBtn: ButtonType
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

export interface MetaImage {
  id: number
  documentId?: string
  name: string
  alternativeText?: string | null
  caption?: string | null
  width?: number
  height?: number
  formats?: {
    large?: ImageFormat
    medium?: ImageFormat
    small?: ImageFormat
    thumbnail?: ImageFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
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

export interface MetaSocial {
  id: number
  socialNetwork: string
  title: string
  description: string
  image?: MetaImage
}

export interface StructuredData {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  provider: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
    }
    sameAs: string[]
  }
}

export interface SEOData {
  id: number
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  metaRobots?: string
  structuredData?: string | StructuredData
  metaViewport?: string
  canonicalURL?: string
  metaSocial?: MetaSocial[]
  metaImage?: MetaImage
}

export interface HomePageData {
  id: number
  seo?: SEOData
  homeSection: HomeSectionData[]
}

export type HomeSectionData =
  | HeroSectionData
  | FeatureSectionData
  | TechSectionData
  | CourseSectionData
  | ReviewSectionData
  | StatsSectionData
  | BlogSectionData
  | VideoSectionData
  | BootcampSectionData

// Define component types and mapping (same as before)
export type ComponentType =
  | 'hero-layout.hero-layout'
  | 'home-layout.platform-feature'
  | 'technology-layout.technology-layout'
  | 'home-layout.feature-course'
  | 'home-layout.feature-bootcamp'
  | 'review-layout.review-layout'
  | 'home-layout.home-stats'
  | 'home-layout.feature-post'
  | 'demo-videos-layout.demo-videos'

export type ComponentDataMap = {
  'hero-layout.hero-layout': HeroSectionData
  'home-layout.platform-feature': FeatureSectionData
  'technology-layout.technology-layout': TechSectionData
  'home-layout.feature-course': CourseSectionData
  'home-layout.feature-bootcamp': BootcampSectionData
  'review-layout.review-layout': ReviewSectionData
  'home-layout.home-stats': StatsSectionData
  'home-layout.feature-post': BlogSectionData
  'demo-videos-layout.demo-videos': VideoSectionData
}

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
