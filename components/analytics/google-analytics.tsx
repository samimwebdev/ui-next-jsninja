'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

interface GoogleAnalyticsProps {
  gaId?: string
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Use dynamic gaId or fallback to environment variable
  const GA_TRACKING_ID = gaId || process.env.NEXT_PUBLIC_GA_TRACKING_ID

  useEffect(() => {
    if (pathname && GA_TRACKING_ID && window.gtag) {
      const url =
        pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : '')

      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams, GA_TRACKING_ID])

  const isProduction = process.env.NODE_ENV === 'production'

  if (!GA_TRACKING_ID) {
    return null
  }

  // Only load in production or when explicitly enabled
  const shouldLoad =
    isProduction || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'

  if (!shouldLoad) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        id="ga-script"
      />
      <Script
        id="ga-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              send_page_view: false,
              custom_map: {
                'custom_parameter': 'course_category'
              }
            });
          `,
        }}
      />
    </>
  )
}
