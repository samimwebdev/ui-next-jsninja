import {
  StrapiImage,
  StrapiIcon,
  Category,
  ButtonType,
  Profile,
  Review,
  SEOData,
  CourseBase,
  StrapiResponse,
  Project,
  Instructor,
  Video,
  HighlightFeature,
} from './shared-types'

export interface AssessmentOption {
  id: string
  text: string
  correct?: boolean
}

export interface AssessmentQuestion {
  id: number
  documentId: string
  title: string
  points: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  text: string
  questionType: 'multipleChoice' | 'singleChoice' | 'trueFalse' | 'essay'
  tags: string
  timeLimit: number
  options: AssessmentOption[]
  explanation?: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

export interface AssessmentQuiz {
  id: number
  documentId: string
  title: string
  passingScore: number
  instructions: string
  questions: AssessmentQuestion[]
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

export interface QuizSubmissionResponse {
  score: number
  totalScore: number
  percentage: number
  passed: boolean
  answers: Array<{
    questionId: number
    userAnswer: string[]
    correct: boolean
    correctAnswers: string[]
    explanation?: string
    points: number
  }>
}

export interface CallToActionContent {
  id: number
  title: string
  details: string
  icon: StrapiIcon
}

export interface TechIconContent {
  id: number
  name: string
  alt: string
  icon: StrapiIcon | null
}

export interface SpecialitySection {
  id: number
  title: string
  details: string
  icon: StrapiIcon | null
}

export interface StepSection {
  id: number
  title: string
  details: string
  icon: StrapiIcon | null
}

export interface SectionContent {
  id: number
  title: string
  details: string
  icon: StrapiIcon | null
}

export interface OverviewSection {
  id: number
  primaryLabel: string
  secondaryHeading: string
  primaryLabelIcon: StrapiIcon
  sectionContent: SectionContent[]
}

export interface Package {
  id: number
  name: string
  shortDescription: string
  isPreferred?: boolean | null
  details: string
  price: number
  packageIcon: StrapiIcon | null
  btn: ButtonType | null
}

// Bootcamp content section types
export interface BootcampOverviewContentSection {
  __component: 'bootcamp-layout.overview'
  id: number
  title: string
  description: string
  sections: OverviewSection[]
}

export interface BootcampSpecialityContentSection {
  __component: 'bootcamp-layout.bootcamp-speciality'
  id: number
  title: string
  description: string
  specialitySection: SpecialitySection[]
}

export interface BootcampStepsContentSection {
  __component: 'bootcamp-layout.bootcamp-steps'
  id: number
  title: string
  description: string
  secondaryHeading: string
  secondaryDescription: string
  stepSection: StepSection[]
  btn: ButtonType | null
}

export interface TechnologyLayoutContentSection {
  __component: 'technology-layout.technology-layout'
  id: number
  title: string
  techIconContent: TechIconContent[]
}

export interface PricingPackageContentSection {
  __component: 'bootcamp-layout.pricing-package'
  id: number
  title: string
  description: string
  package: Package[]
}

export interface BatchScheduleContentSection {
  __component: 'bootcamp-layout.batch-schedule'
  id: number
  enrollmentStart: string
  enrollmentEnd: string
  orientationStart: string
  classStart: string
  batchNumber: number
  title: string
  enrollStartBtn: StrapiIcon
  enrollEndBtn: StrapiIcon
  orientationStartBtn: StrapiIcon
  classStartBtn: StrapiIcon
}

export interface CallToActionContentSection {
  __component: 'bootcamp-layout.call-to-action'
  id: number
  title: string
  description: string
  btnLabel: string
  callToActionContent: CallToActionContent[]
}

export interface ProjectShowcaseContentSection {
  __component: 'project-layout.project-layout'
  id: number
  title: string
  description: string
  projects: Project[]
}

export interface HeroLayoutContentSection {
  __component: 'hero-layout.hero-layout'
  id: number
  shortLabel: string
  title: string
  shortDescription: string
  promoVideo: string
  highlightedFeature: HighlightFeature[]
  btn: ButtonType[]
  promoImage: StrapiImage | null
  assessmentQuiz?: AssessmentQuiz | null
}

export interface FAQLayoutContentSection {
  __component: 'faq-layout.faq-section'
  id: number
  title: string
  description: string
  faqItems: Array<{
    question: string
    answer: string
  }>
}

export interface ReviewLayoutContentSection {
  __component: 'review-layout.review-layout'
  id: number
  title: string
  description: string
  reviews: Review[]
}

export interface AuthorLayoutContentSection {
  __component: 'author-layout.author-layout'
  id: number
  title: string
  description: string
  instructor: Instructor
}

export interface DemoVideosLayoutContentSection {
  __component: 'demo-videos-layout.demo-videos'
  id: number
  title: string
  description: string
  videos: Video[]
}

// Union type for all bootcamp content sections
export type BootcampContentSection =
  | BootcampOverviewContentSection
  | BootcampSpecialityContentSection
  | BootcampStepsContentSection
  | TechnologyLayoutContentSection
  | PricingPackageContentSection
  | BatchScheduleContentSection
  | CallToActionContentSection
  | ProjectShowcaseContentSection
  | HeroLayoutContentSection
  | FAQLayoutContentSection
  | ReviewLayoutContentSection
  | AuthorLayoutContentSection
  | DemoVideosLayoutContentSection

// Main bootcamp page data type
export interface BootcampPageData {
  id: number
  documentId: string
  title: string
  baseContent: CourseBase & {
    seo: SEOData
    courseBundle: {
      id: number
      documentId: string
      title: string
      shortDescription: string
      price: number
      helperText?: string | null
      courseBases: CourseBase[]
    }
    curriculum: {
      id: number
      title: string
      description: string
      modules: Array<{
        id: number
        documentId: string
        title: string
        description?: string | null
        order: number
        duration: number
        lessons: Array<{
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
        }>
        createdAt: string
        updatedAt: string
        publishedAt: string
        locale: string | null
      }>
    }
    contentSection: BootcampContentSection[]
  }
  assessmentQuiz: AssessmentQuiz
  contentBlock: BootcampContentSection[]
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

// Component type mapping for type safety
export type BootcampComponentType =
  | 'bootcamp-layout.overview'
  | 'bootcamp-layout.bootcamp-speciality'
  | 'bootcamp-layout.bootcamp-steps'
  | 'technology-layout.technology-layout'
  | 'bootcamp-layout.pricing-package'
  | 'bootcamp-layout.batch-schedule'
  | 'bootcamp-layout.call-to-action'
  | 'project-layout.project-layout'
  | 'hero-layout.hero-layout'
  | 'faq-layout.faq-section'
  | 'review-layout.review-layout'
  | 'author-layout.author-layout'
  | 'demo-videos-layout.demo-videos'

export type BootcampComponentDataMap = {
  'bootcamp-layout.overview': BootcampOverviewContentSection
  'bootcamp-layout.bootcamp-speciality': BootcampSpecialityContentSection
  'bootcamp-layout.bootcamp-steps': BootcampStepsContentSection
  'technology-layout.technology-layout': TechnologyLayoutContentSection
  'bootcamp-layout.pricing-package': PricingPackageContentSection
  'bootcamp-layout.batch-schedule': BatchScheduleContentSection
  'bootcamp-layout.call-to-action': CallToActionContentSection
  'project-layout.project-layout': ProjectShowcaseContentSection
  'hero-layout.hero-layout': HeroLayoutContentSection
  'faq-layout.faq-section': FAQLayoutContentSection
  'review-layout.review-layout': ReviewLayoutContentSection
  'author-layout.author-layout': AuthorLayoutContentSection
  'demo-videos-layout.demo-videos': DemoVideosLayoutContentSection
}

// Helper type for content section extraction
export function getBootcampContentSection<T extends BootcampComponentType>(
  bootcampData: BootcampPageData,
  componentType: T
): BootcampComponentDataMap[T] | undefined {
  return bootcampData.contentBlock?.find(
    (section): section is BootcampComponentDataMap[T] =>
      section.__component === componentType
  )
}

// Re-export shared types for convenience
export type {
  StrapiImage,
  StrapiIcon,
  Category,
  ButtonType,
  Profile,
  Review,
  SEOData,
  CourseBase,
  StrapiResponse,
}
