'use client'

import React, { createContext, useContext } from 'react'
import { PromoTopBar } from '@/components/shared/promo-top-bar'
import { PromoPopup } from '@/components/shared/promo-popup'
import { ProcessedPromotionData } from '@/types/promotion'

// Create context to manage promotion state across components
type PromotionContextType = {
  showTopBar: boolean
  hideTopBar: () => void
}

const PromotionContext = createContext<PromotionContextType>({
  showTopBar: false,
  hideTopBar: () => {},
})

export const usePromotion = () => useContext(PromotionContext)

interface PromotionProviderProps {
  children: React.ReactNode
  promotionData: ProcessedPromotionData | null
}

export function PromotionProvider({
  children,
  promotionData,
}: PromotionProviderProps) {
  const [showTopBar, setShowTopBar] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!promotionData?.topBar.enabled) {
      setIsLoaded(true)
      return
    }

    // Check localStorage for top bar dismissed state
    const topBarDismissed = localStorage.getItem('promoTopBarDismissed')
    const dismissedTimestamp = localStorage.getItem('promoTopBarDismissedAt')

    // Check if dismissal is still valid (you can adjust this logic)
    let isDismissalValid = false
    if (topBarDismissed === 'true' && dismissedTimestamp) {
      const dismissedAt = new Date(dismissedTimestamp)
      const now = new Date()
      const hoursSinceDismissed =
        (now.getTime() - dismissedAt.getTime()) / (1000 * 60 * 60)

      // Keep dismissal for 24 hours
      isDismissalValid = hoursSinceDismissed < 24
    }

    // Only show the top bar if it's enabled and not recently dismissed
    setShowTopBar(!isDismissalValid)
    setIsLoaded(true)
  }, [promotionData])

  const hideTopBar = () => {
    setShowTopBar(false)
    // Save dismissal to localStorage with timestamp
    localStorage.setItem('promoTopBarDismissed', 'true')
    localStorage.setItem('promoTopBarDismissedAt', new Date().toISOString())
  }

  // Only render content after client-side hydration to prevent mismatch
  if (!isLoaded) return <>{children}</>

  return (
    <PromotionContext.Provider value={{ showTopBar, hideTopBar }}>
      {/* Promo Top Bar */}
      {showTopBar && promotionData?.topBar.enabled && (
        <PromoTopBar
          message={promotionData.topBar.message}
          buttonText={promotionData.topBar.buttonText}
          buttonLink={promotionData.topBar.buttonLink}
          endDate={promotionData.topBar.endDate}
          onClose={hideTopBar}
        />
      )}

      {/* Main Content */}
      <div className={showTopBar ? 'pt-0' : ''}>{children}</div>

      {/* Promo Popup */}
      {promotionData?.popup.enabled && (
        <PromoPopup
          title={promotionData.popup.title}
          description={promotionData.popup.description}
          buttonText={promotionData.popup.buttonText}
          buttonLink={promotionData.popup.buttonLink}
          imageUrl={promotionData.popup.imageUrl}
        />
      )}
    </PromotionContext.Provider>
  )
}
