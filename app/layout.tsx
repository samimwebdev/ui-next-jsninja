import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Navigation } from '@/components/shared/navbar/navigation'
import { Footer } from '@/components/shared/footer'
import { Toaster } from '@/components/ui/sonner'

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// // })

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <Toaster position="top-right" />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
