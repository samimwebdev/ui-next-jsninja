import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Navigation } from '@/components/shared/navbar/navigation'
import { Footer } from '@/components/shared/footer'
import { Toaster } from '@/components/ui/sonner'
import AuthProvider from '@/components/context/AuthProvider'
import { getUser } from '@/lib/auth'
import { VideoProvider } from '@/components/context/video-provider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

// Default SEO metadata for all pages
export const metadata: Metadata = {
  title: {
    default: 'JavaScript Ninja - Learn Web Development',
    template: '%s | JavaScript Ninja', // This allows pages to override: "Page Title | JavaScript Ninja"
  },
  description:
    'Master modern web development with expert-led courses and tutorials. Learn JavaScript, React, Node.js, and more with hands-on projects.',
  keywords: [
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
  authors: [{ name: 'JavaScript Ninja Team' }],
  creator: 'JavaScript Ninja',
  publisher: 'JavaScript Ninja',
  robots: 'index, nofollow',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://javascriptninja.com',
    siteName: 'JavaScript Ninja',
    title: 'JavaScript Ninja - Learn Web Development',
    description:
      'Master modern web development with expert-led courses and tutorials.',
    images: [
      {
        url: 'https://javascriptninja.com/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'JavaScript Ninja - Learn Web Development',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@JavaScriptNinja',
    creator: '@JavaScriptNinja',
    title: 'JavaScript Ninja - Learn Web Development',
    description:
      'Master modern web development with expert-led courses and tutorials.',
    images: ['https://javascriptninja.com/images/twitter-default.jpg'],
  },

  // Canonical URL
  alternates: {
    canonical: 'https://javascriptninja.com',
  },

  // Additional metadata
  metadataBase: new URL('https://javascriptninja.com'),

  // Manifest and icons
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' },
    ],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currentUser = await getUser()

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider user={currentUser}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <Toaster position="top-right" />
            <VideoProvider>{children}</VideoProvider>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
