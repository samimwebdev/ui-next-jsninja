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
  courses: Array<{
    id: number
    documentId: string
    slug: string
    level: string
    price: number
    featured: boolean
    averageRating: number
    totalLessons: number
    duration: number
    featureImage?: StrapiImage
    title: string
    totalStudents: number
  }>
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

export interface Course {
  id: number
  documentId: string
  title: string
  slug: string
  price: number
  level: string
  totalStudents: number
  averageRating: number
  duration: number | string
  totalLessons: number
  courseType?: 'course' | 'bootcamp' | 'workshop'
  featureImage?: StrapiImage
}

export interface CourseSectionData {
  id: number
  __component: 'home-layout.feature-course'
  title: string
  description: string
  courses: Course[]
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
  title: string
  timeToRead: number
  publishedDate: string
  tags: string
  slug: string
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
  video: Video[]
  browseVideosBtn: BrowseVideosBtn
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

export interface HomePageData {
  title: string
  id: number
  documentId: string
  slug: string
  homeSection: HomeSectionData
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
