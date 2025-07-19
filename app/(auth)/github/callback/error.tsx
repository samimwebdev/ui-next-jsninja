'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('GitHub callback error:', error)
    setTimeout(() => router.push('/login'), 3000)
  }, [error, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-900 mb-4">
          Authentication Error
        </h2>
        <p className="text-red-700 mb-4">
          Something went wrong during GitHub authentication
        </p>
        <button
          onClick={() => reset()}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mr-2"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push('/login')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}
