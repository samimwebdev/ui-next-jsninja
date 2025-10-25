import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/checkout/',
          '/app-setup/',
          '/app-setup-success/',
          '/success/',
          '/cancel/',
          '/course-view/',
          '/forgot-password/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-otp',
          '/_next/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
