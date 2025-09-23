'use client'

import React, {
  startTransition,
  useActionState,
  useEffect,
  useRef,
} from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { verifyOTPAction } from '../actions'
import { otpSchema } from '@/lib/validation'
import { Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'

type FormData = {
  token: string
}

type ActionState = {
  message: string
  errors: Record<string, string[]>
  success: boolean
}

const VerifyOTP = () => {
  const [state, formAction] = useActionState(verifyOTPAction, {
    message: '',
    errors: {},
    success: false,
  } as ActionState)

  const router = useRouter()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const email = searchParams.get('email')
  const twoFactorEnabled = searchParams.get('twoFactor') === 'true'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setError,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(otpSchema),
    mode: 'onBlur',
  })

  const tokenValue = watch('token')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Redirect if no user ID
  useEffect(() => {
    if (!userId) {
      router.push('/login')
    }
  }, [userId, router])

  const onSubmit = async (data: FormData) => {
    try {
      clearErrors()

      const formData = new FormData()
      formData.append('token', data.token)
      formData.append('userId', userId || '')
      formData.append('email', email || '') // Add email
      formData.append('twoFactorEnabled', twoFactorEnabled.toString()) // Add 2FA status

      startTransition(() => {
        return formAction(formData)
      })
    } catch (err) {
      console.error('Submission error:', err)
    }
  }

  // Handle OTP input changes
  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newToken = tokenValue
        ? tokenValue.split('')
        : ['', '', '', '', '', '']
      newToken[index] = value

      const tokenString = newToken.join('')

      // Move to next input if value entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }

      // Update form value
      register('token').onChange({
        target: { value: tokenString, name: 'token' },
      })
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !e.currentTarget?.value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Set errors from action state
  useEffect(() => {
    if (state?.errors && Object.keys(state.errors).length > 0) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          setError(field as keyof FormData, {
            type: 'server',
            message: messages.join(', '),
          })
        }
      })
    }
  }, [state, setError])

  // Redirect after successful verification
  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
    //disable the exhaustive-deps rule for this useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, router])

  if (!userId) {
    return null // Will redirect
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-bl from-slate-50 via-slate-100 to-slate-200 dark:from-background dark:via-muted dark:to-card">
      <div className="absolute inset-0 bg-gradient-to-r from-ninja-gold/20 via-ninja-orange/10 to-ninja-gold/15 dark:from-ninja-gold/10 dark:via-transparent dark:to-ninja-orange/10" />

      <div className="relative z-10 container px-4 py-12 max-w-md mx-auto min-h-screen flex items-center justify-center">
        <div className="w-full bg-white/90 dark:bg-card/90 backdrop-blur-lg p-8 rounded-2xl border border-slate-200/60 dark:border-border/50 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-ninja-gold/10 dark:bg-ninja-gold/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-ninja-gold" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
              Two-Factor Authentication
            </h2>
            <p className="mt-2 text-slate-600 dark:text-muted-foreground">
              Enter the 6-digit verification code{' '}
              {twoFactorEnabled
                ? 'from your authenticator app'
                : `sent to ${email}`}
            </p>
          </div>

          {/* Success/Error Message */}
          {state.message && (
            <div
              className={`mb-6 p-3 rounded-lg text-sm text-center ${
                state.success
                  ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {state.message}
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label className="text-slate-700 dark:text-foreground font-medium mb-4 block text-center">
                Verification Code
              </Label>

              {/* OTP Input Fields */}
              <div className="flex gap-3 justify-center mb-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-500 focus:border-ninja-gold"
                    value={tokenValue?.[index] || ''}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoComplete="off"
                  />
                ))}
              </div>

              {/* Hidden input for form validation */}
              <input
                type="hidden"
                {...register('token')}
                value={tokenValue || ''}
              />

              {errors.token && (
                <span className="text-sm text-red-500 block text-center">
                  {errors.token.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-ninja-primary hover:bg-gradient-ninja-reverse text-slate-900 font-semibold py-2.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting || !tokenValue || tokenValue.length !== 6}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Code'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-600 dark:text-muted-foreground">
              Didn&apos;t receive the code? Check your spam folder or try
              logging in again.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-ninja-gold-light dark:text-ninja-gold-dark hover:text-ninja-orange transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP
