'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: unknown
  }
}

interface FacebookPixelProps {
  pixelId?: string
}

export function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Use dynamic pixelId or fallback to environment variable
  const FB_PIXEL_ID = pixelId || process.env.NEXT_PUBLIC_FB_PIXEL_ID

  useEffect(() => {
    // Track page view on route change
    if (pathname && FB_PIXEL_ID && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams, FB_PIXEL_ID])

  if (!FB_PIXEL_ID) {
    return null
  }

  // Only load in production or when explicitly enabled
  const shouldLoad = process.env.NODE_ENV === 'production'

  if (!shouldLoad) {
    return null
  }

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <Image
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt="Facebook Pixel"
        />
      </noscript>
    </>
  )
}
