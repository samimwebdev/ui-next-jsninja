// components/shared/maintenance-mode.tsx
import Image from 'next/image'
import { StrapiImage } from '@/types/shared-types'

interface MaintenanceModeProps {
  logo?: StrapiImage | null
}

export function MaintenanceMode({ logo }: MaintenanceModeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ninja-navy via-ninja-dark-navy to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        {logo && (
          <div className="mb-8">
            <Image
              src={logo.url}
              alt="Logo"
              width={120}
              height={60}
              className="mx-auto"
            />
          </div>
        )}

        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-ninja-gold/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-ninja-gold animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Maintenance Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Site Under Maintenance
        </h1>
        <p className="text-gray-300 mb-8 leading-relaxed">
          We are currently performing scheduled maintenance to improve your
          experience. We will be back online shortly.
        </p>

        {/* Contact Info */}
        <div className="text-sm text-gray-400">
          <p>Need immediate assistance?</p>
          <p>
            Email us at{' '}
            <a
              href={`mailto:${
                process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
                'support@javascript-ninja.com'
              }`}
              className="text-ninja-gold hover:text-ninja-orange transition-colors"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
                'support@javascript-ninja.com'}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
