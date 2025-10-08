import type { Metadata } from 'next'
import './globals.css'
import { Hind_Siliguri } from 'next/font/google'
import { ThemeProvider } from '@/components/context/theme-provider'
import { Navigation } from '@/components/shared/navbar/navigation'
import { Footer } from '@/components/shared/footer'
import { CookieConsent } from '@/components/shared/cookie-consent'
import { PromotionProvider } from '@/components/shared/promotion-provider'
import { Toaster } from 'sonner'
import AuthProvider from '@/components/context/AuthProvider'
import { getUser } from '@/lib/auth'
import { VideoProvider } from '@/components/context/video-provider'
import { strapiFetch } from '@/lib/strapi'
import { Menu, SEOData, StrapiImage } from '@/types/shared-types'
import ReactQueryProvider from '@/components/context/react-query-provider'
import { Suspense } from 'react'

// Import Analytics Components
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { FacebookPixel } from '@/components/analytics/facebook-pixel'
import { VercelAnalytics } from '@/components/analytics/vercel-analytics'
import { getPromotionData } from '@/lib/actions/promotion-actions'
import { MaintenanceMode } from '@/components/shared/maintenance-mode' // Add this component
import { setGATrackingId, setFBPixelId } from '@/lib/analytics'

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin', 'bengali'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-hind-siliguri',
})

export interface StrapiSettingData {
  id: number
  documentId: string
  userLocationTracking: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  facebookPixelID?: string
  googleAnalyticID?: string
  seo?: SEOData
  logo?: StrapiImage
  maintenanceMode: boolean
}

// Default Seo Metadata
export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: setting } = await strapiFetch<{ data: StrapiSettingData }>(
      '/api/setting?populate=*',
      {
        headers: { 'Content-Type': 'application/json' },
        next: {
          revalidate: 3600, // Cache for 1 hour
          tags: ['settings', 'seo'],
        },
      }
    )
    const seo = setting?.seo

    return {
      title: seo?.metaTitle || 'JavaScript Ninja - Learn Web Development',
      description:
        seo?.metaDescription ||
        'Master modern web development with expert-led courses and tutorials.',
      keywords: seo?.keywords?.split(',').map((k: string) => k.trim()) || [
        'JavaScript',
        'Web Development',
        'React',
        'Node.js',
        'Programming Courses',
        'Coding Bootcamp',
        'Learn to Code',
        'Frontend Development',
        'Backend Development',
        'Full Stack Development',
      ],
      icons: {
        icon: [
          { url: '/favicon.svg', type: 'image/svg+xml' },
          { url: '/apple-touch-icon.png', sizes: '180x180' },
        ],
        apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
      },
      robots: seo?.metaRobots || 'index, follow',
      openGraph: {
        type: 'website',
        url: seo?.canonicalURL || 'https://javascriptninja.com',
        title: seo?.metaTitle || 'JavaScript Ninja - Learn Web Development',
        description:
          seo?.metaDescription ||
          'Master modern web development with expert-led courses and tutorials.',
        images: [
          {
            url:
              seo?.structuredData?.provider?.logo?.url ||
              'https://javascriptninja.com/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: seo?.metaTitle || 'JavaScript Ninja - Learn Web Development',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo?.metaTitle || 'JavaScript Ninja - Learn Web Development',
        description:
          seo?.metaDescription ||
          'Master modern web development with expert-led courses and tutorials.',
        images: [
          seo?.structuredData?.provider?.logo?.url ||
            'https://javascriptninja.com/images/twitter-default.jpg',
        ],
      },
      alternates: {
        canonical: seo?.canonicalURL || 'https://javascriptninja.com',
      },
      metadataBase: new URL('https://javascriptninja.com'),
    }
  } catch (e) {
    // fallback if Strapi fails
    console.log(e)
    return {
      title: 'JavaScript Ninja - Learn Web Development',
      description:
        'Master modern web development with expert-led courses and tutorials.',
    }
  }
}

const headerMenuSlug = process.env.HEADER_MENU_SLUG || 'header_navigation'
const footerMenuSlug = process.env.FOOTER_MENU_SLUG || 'footer_navigation'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currentUser = await getUser()

  // Fetch settings first to check maintenance mode
  const { data: setting } = await strapiFetch<{ data: StrapiSettingData }>(
    '/api/setting?populate=*',
    {
      headers: { 'Content-Type': 'application/json' },
      next: {
        revalidate: 3600,
        tags: ['settings'],
      },
    }
  )

  // If maintenance mode is enabled, show maintenance page
  if (process.env.NODE_ENV === 'production' && setting?.maintenanceMode) {
    return (
      <html lang="en">
        <body
          className={`${hindSiliguri.className} ${hindSiliguri.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <MaintenanceMode logo={setting?.logo} />
          </ThemeProvider>
        </body>
      </html>
    )
  }

  // Set dynamic analytics IDs for utility functions
  if (setting?.googleAnalyticID) {
    setGATrackingId(setting.googleAnalyticID)
  }
  if (setting?.facebookPixelID) {
    setFBPixelId(setting.facebookPixelID)
  }

  // Continue with normal layout if not in maintenance mode
  const promotionData = await getPromotionData()

  // Fetch menus
  const { data: menus } = await strapiFetch<{ data: Menu[] }>(
    '/api/tree-menus/menu',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: {
        revalidate: 3600,
        tags: ['menus'],
      },
    }
  )

  const logo = setting?.logo
  const headerMenu = menus.find((menu) => menu?.slug === headerMenuSlug)
  const footerMenu = menus.find((menu) => menu?.slug === footerMenuSlug)
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <html lang="en">
      <head>
        <Suspense fallback={null}>
          {/* Pass dynamic IDs to components */}
          {isProduction && setting?.googleAnalyticID && (
            <GoogleAnalytics gaId={setting.googleAnalyticID} />
          )}
          {isProduction && setting?.facebookPixelID && (
            <FacebookPixel pixelId={setting.facebookPixelID} />
          )}
        </Suspense>
      </head>
      <body
        className={`${hindSiliguri.className} ${hindSiliguri.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* ✅ OPTIMAL PROVIDER HIERARCHY */}
        <ReactQueryProvider>
          <AuthProvider user={currentUser}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <VideoProvider>
                <PromotionProvider promotionData={promotionData}>
                  {/* ✅ Analytics inside all providers */}
                  <VercelAnalytics />

                  {/* ✅ Toaster at top level for all notifications */}
                  <Toaster position="top-right" richColors />

                  {/* ✅ Navigation with all context available */}
                  <Navigation menuItems={headerMenu?.items || []} logo={logo} />

                  {/* ✅ Main content */}
                  <main className="min-h-screen">{children}</main>

                  {/* ✅ Footer with all context available */}
                  <Footer menuItems={footerMenu?.items || []} logo={logo} />

                  {/* ✅ Cookie Consent at end (fixed position) */}
                  <CookieConsent />
                </PromotionProvider>
              </VideoProvider>
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
