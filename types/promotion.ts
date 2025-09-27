import { ButtonType, StrapiImage } from './shared-types'

export interface PromotionData {
  id: number
  documentId: string
  title: string
  type: 'topbar' | 'popup' | 'both'
  startDate: string
  endDate: string
  priority: number | null
  audience: 'authenticated' | 'guest' | 'both'
  createdAt: string
  updatedAt: string
  publishedAt: string
  popupEnabled: boolean
  displayPopUpOncePerSession: boolean
  topBarEnabled: boolean
  description: string
  ctaButton: ButtonType
  popupImage: StrapiImage | null
}

export interface PromotionResponse {
  data: PromotionData
  meta: Record<string, unknown>
}

export interface ProcessedPromotionData {
  topBar: {
    enabled: boolean
    message: string
    buttonText: string
    buttonLink: string
    endDate: Date
  }
  popup: {
    enabled: boolean
    title: string
    description: string
    buttonText: string
    buttonLink: string
    imageUrl: string | null
  }
}
