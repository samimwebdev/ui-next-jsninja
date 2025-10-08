// lib/actions/promotion-actions.ts
'use server'

import { strapiFetch } from '@/lib/strapi'
import { PromotionResponse, ProcessedPromotionData } from '@/types/promotion'
import { getUser } from '@/lib/auth'

export async function getPromotionData(): Promise<ProcessedPromotionData | null> {
  try {
    // Get current user to determine audience targeting
    const user = await getUser()

    const response = await strapiFetch<PromotionResponse>(
      '/api/promotion?populate=*',
      {
        method: 'GET',
        next: {
          revalidate: 300, // Cache for 5 minutes
          tags: ['promotion'],
        },
        allowNotFound: true,
      }
    )

    // Handle case where no promotion is found
    if (!response.data) {
      return null
    }

    const promotion = response.data

    // Check if promotion is active (within date range)
    const now = new Date()
    const startDate = new Date(promotion.startDate)
    const endDate = new Date(promotion.endDate)

    if (now < startDate || now > endDate) {
      return null
    }

    // Check audience targeting
    const isAuthenticated = !!user
    if (promotion.audience === 'authenticated' && !isAuthenticated) {
      return null
    }
    if (promotion.audience === 'guest' && isAuthenticated) {
      return null
    }

    // Process and return the data
    return {
      topBar: {
        enabled:
          promotion.topBarEnabled &&
          (promotion.type === 'topbar' || promotion.type === 'both'),
        message: promotion.title,
        buttonText: promotion.ctaButton.btnLabel,
        buttonLink: promotion.ctaButton.btnLink || '#',
        endDate: new Date(promotion.endDate),
      },
      popup: {
        enabled:
          promotion.popupEnabled &&
          (promotion.type === 'popup' || promotion.type === 'both'),
        title: promotion.title,
        description: promotion.description,
        buttonText: promotion.ctaButton.btnLabel,
        buttonLink: promotion.ctaButton.btnLink || '#',
        imageUrl: promotion.popupImage?.url || null,
      },
    }
  } catch (error) {
    console.error('Failed to fetch promotion data:', error)
    return null
  }
}
