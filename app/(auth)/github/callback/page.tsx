'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { githubCallbackAction, type FormState } from '@/app/(auth)/actions'

const initialState: FormState = {
  message: '',
  errors: {},
  success: false,
}

export default function GitHubCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<FormState>(initialState)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token')
        const error = searchParams.get('error')

        if (error) {
          setState({
            message: 'GitHub authentication was cancelled or failed',
            errors: { auth: [error] },
            success: false,
          })
          setIsProcessing(false)
          return
        }

        if (!accessToken) {
          setState({
            message: 'No access token received from GitHub',
            errors: { auth: ['Missing access token'] },
            success: false,
          })
          setIsProcessing(false)
          return
        }

        const formData = new FormData()
        formData.append('access_token', accessToken)

        const result = await githubCallbackAction(initialState, formData)
        setState(result)
        setIsProcessing(false)

        if (result.success) {
          setTimeout(() => router.push('/dashboard'), 1500)
        } else {
          setTimeout(() => router.push('/login'), 3000)
        }
      } catch (error) {
        setState({
          message: 'An unexpected error occurred',
          errors: { auth: ['Processing failed'] },
          success: false,
        })
        setIsProcessing(false)
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    processCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {isProcessing && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">
                Processing GitHub Authentication...
              </h2>
              <p className="text-gray-600 mt-2">
                Please wait while we verify your credentials
              </p>
            </>
          )}

          {!isProcessing && state.success && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 text-green-600">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-900">
                Authentication Successful!
              </h2>
              <p className="text-green-700 mt-2">{state.message}</p>
            </>
          )}

          {!isProcessing && !state.success && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 text-red-600">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-900">
                Authentication Failed
              </h2>
              <p className="text-red-700 mt-2">{state.message}</p>
              <p className="text-gray-500 text-sm mt-2">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
