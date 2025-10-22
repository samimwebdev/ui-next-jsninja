import { withSentryConfig } from '@sentry/nextjs'
import withPWAInit from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  register: true,
  sw: 'sw.js',
  reloadOnOnline: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cloudinary-images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 90 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^https:\/\/backend\.javascript-ninja\.com\/.*/i,
        handler: 'CacheFirst', // Changed from NetworkFirst
        options: {
          cacheName: 'StaleWhileRevalidate',
          networkTimeoutSeconds: 3, // Reduced from 10
          expiration: {
            maxEntries: 30, // Reduced from 50
            maxAgeSeconds: 2 * 60, // Reduced from 5 minutes
          },
        },
      },
      {
        urlPattern: /^https:\/\/i\.pravatar\.cc\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'avatar-images',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^https:\/\/ui-avatars\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'ui-avatar-images',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-fonts-stylesheets',
          expiration: {
            maxAgeSeconds: 90 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-webfonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
})

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: '**.gumlet.io',
      },
      {
        protocol: 'https',
        hostname: '**.gumlet.com',
      },
      {
        protocol: 'https',
        hostname: '**.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'f.vimeocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    // ✅ Pre-compute CSP string
    const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://js.pusher.com
    https://www.googletagmanager.com
    https://browser.sentry-cdn.com;

  style-src 'self' 'unsafe-inline'
    https://fonts.googleapis.com;
  
  img-src 'self' data: blob:
    https://*.cloudinary.com
    https://*.gumlet.io
    https://*.gumlet.com
    https://*.b-cdn.net
    https://*.bunny.net
    https:;
  
  font-src 'self' https://fonts.gstatic.com data:;
  
  connect-src 'self'
    ${process.env.NEXT_PUBLIC_STRAPI_URL}
    https://*.cloudinary.com
    https://*.gumlet.io
    https://*.gumlet.com
    https://*.b-cdn.net
    https://*.bunny.net
    https://*.pusher.com
    https://*.sentry.io
    wss:;
  
  frame-src 'self'
    https://www.youtube.com
    https://youtube-nocookie.com
    https://player.vimeo.com
    https://*.gumlet.io
    https://*.bunny.net;
  
  media-src 'self' blob: https:
    https://*.gumlet.io
    https://*.gumlet.com
    https://*.b-cdn.net
    https://*.bunny.net
    https://*.cloudinary.com;
  
  manifest-src 'self';
  worker-src 'self' blob:;
  frame-ancestors 'none';
  upgrade-insecure-requests;
   `
      .replace(/\s+/g, ' ')
      .trim()

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=()',
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // 🔹 Add this for image assets
      {
        source: '/(.*)\\.(png|jpg|jpeg|svg|gif|ico|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },
}

const configureNextConfig = withSentryConfig(nextConfig, {
  org: 'webdeveloper-bd',
  project: 'ninja-frontend-production',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  disableLogger: true,
  automaticVercelMonitors: true,
})

export default withPWA(configureNextConfig)
