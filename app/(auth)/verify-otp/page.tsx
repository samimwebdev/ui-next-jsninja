'use client'

import React, {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { verifyOTPAction, resendOTPAction } from '../actions'
import { otpSchema } from '@/lib/validation'
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react'
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

  const [resendState, resendAction] = useActionState(resendOTPAction, {
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

  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [resendAttempts, setResendAttempts] = useState(0)
  const [isResending, setIsResending] = useState(false)

  const MAX_RESEND_ATTEMPTS = 2
  const RESEND_COOLDOWN = 90

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setError,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(otpSchema),
    mode: 'onBlur',
  })

  const tokenValue = watch('token')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // ✅ Redirect to login if resend OTP fails
  useEffect(() => {
    if (resendState && !resendState.success && resendState.message) {
      // Check if the error is session-related
      const isSessionError =
        resendState.message.includes('Session expired') ||
        resendState.message.includes('expired') ||
        resendState.errors?.server?.some((err) => err.includes('expired'))

      if (isSessionError) {
        // Show message briefly before redirect
        const timer = setTimeout(() => {
          router.push('/login')
        }, 2000) // 2 second delay to show the message

        return () => clearTimeout(timer)
      }
    }
  }, [resendState, router])

  // Timer countdown effect - only for email OTP
  useEffect(() => {
    // Skip timer logic for TOTP
    if (twoFactorEnabled) return

    let interval: NodeJS.Timeout

    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendTimer, canResend, twoFactorEnabled])

  // Initialize resend functionality - only for email OTP
  useEffect(() => {
    // Skip resend logic for TOTP
    if (twoFactorEnabled || !userId || !email) return

    // Use userId as the primary key for tracking attempts across sessions
    const attemptKey = `otp_attempts_${userId}`
    const lastSentKey = `otp_last_sent_${userId}`
    const blockedUntilKey = `otp_blocked_until_${userId}`

    // Check if user is currently blocked
    const blockedUntil = localStorage.getItem(blockedUntilKey)
    if (blockedUntil) {
      const blockedTime = parseInt(blockedUntil, 10)
      const now = Date.now()

      if (now < blockedTime) {
        // User is still blocked
        setResendAttempts(MAX_RESEND_ATTEMPTS)
        setCanResend(false)
        setResendTimer(0)
        return
      } else {
        // Block period has expired, clear the block
        localStorage.removeItem(blockedUntilKey)
        localStorage.removeItem(attemptKey)
        localStorage.removeItem(lastSentKey)
      }
    }

    // Check localStorage for previous attempts
    const storedAttempts = localStorage.getItem(attemptKey)
    const storedLastSent = localStorage.getItem(lastSentKey)

    if (storedAttempts) {
      const attempts = parseInt(storedAttempts, 10)
      setResendAttempts(attempts)

      if (attempts >= MAX_RESEND_ATTEMPTS) {
        // Block user for 15 minutes
        const blockUntil = Date.now() + 15 * 60 * 1000 // 15 minutes
        localStorage.setItem(blockedUntilKey, blockUntil.toString())
        setCanResend(false)
        setResendTimer(0)
        return
      }
    }

    if (storedLastSent) {
      const lastSentTime = parseInt(storedLastSent, 10)
      const timePassed = Math.floor((Date.now() - lastSentTime) / 1000)
      const remainingTime = RESEND_COOLDOWN - timePassed

      if (remainingTime > 0) {
        // Still in cooldown period
        setResendTimer(remainingTime)
        setCanResend(false)
      } else {
        // Cooldown period has passed
        setCanResend(true)
        setResendTimer(0)
      }
    } else {
      // First time visiting - show timer immediately (OTP was sent during login)
      setResendTimer(RESEND_COOLDOWN)
      setCanResend(false)
    }
  }, [userId, email, twoFactorEnabled])

  // Handle resend OTP - only for email OTP
  const handleResendOTP = async () => {
    // Prevent resend for TOTP
    if (
      twoFactorEnabled ||
      !canResend ||
      resendAttempts >= MAX_RESEND_ATTEMPTS ||
      isResending
    ) {
      return
    }

    setIsResending(true)

    try {
      await startTransition(() => {
        return resendAction()
      })

      // Update attempts and timer
      const newAttempts = resendAttempts + 1
      setResendAttempts(newAttempts)
      setResendTimer(RESEND_COOLDOWN)
      setCanResend(false)

      // Use userId-based keys for persistent tracking
      const attemptKey = `otp_attempts_${userId}`
      const lastSentKey = `otp_last_sent_${userId}`

      localStorage.setItem(attemptKey, newAttempts.toString())
      localStorage.setItem(lastSentKey, Date.now().toString())

      // If max attempts reached, set a block period
      if (newAttempts >= MAX_RESEND_ATTEMPTS) {
        const blockUntil = Date.now() + 15 * 60 * 1000 // Block for 15 minutes
        localStorage.setItem(
          `otp_blocked_until_${userId}`,
          blockUntil.toString()
        )
      }
    } catch (error) {
      console.error('Resend error:', error)
    } finally {
      setIsResending(false)
    }
  }

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
      formData.append('email', email || '')
      formData.append('twoFactorEnabled', twoFactorEnabled.toString())

      startTransition(() => {
        return formAction(formData)
      })
    } catch (err) {
      console.error('Submission error:', err)
    }
  }

  // ✅ Enhanced paste handler
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()

    // Extract only digits from pasted content
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)

    if (digits.length > 0) {
      // Update form value
      setValue('token', digits.padEnd(6, ''))

      // Focus on the last filled input or the first empty one
      const nextIndex = Math.min(digits.length, 5)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  // ✅ Enhanced OTP input handler
  const handleOTPChange = (index: number, value: string) => {
    // Only allow digits
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const currentToken = tokenValue || ''
      const tokenArray = currentToken.padEnd(6, '').split('')
      tokenArray[index] = value

      const newToken = tokenArray.join('')
      setValue('token', newToken)

      // Auto-focus next input if value entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
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

      // Clear resend attempts on successful verification using userId-based keys
      if (userId) {
        localStorage.removeItem(`otp_attempts_${userId}`)
        localStorage.removeItem(`otp_last_sent_${userId}`)
        localStorage.removeItem(`otp_blocked_until_${userId}`)
      }

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
  }, [state.success, router, queryClient, userId])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  const getRemainingAttempts = () => MAX_RESEND_ATTEMPTS - resendAttempts

  const getBlockedStatus = () => {
    if (!userId) return null

    const blockedUntil = localStorage.getItem(`otp_blocked_until_${userId}`)
    if (!blockedUntil) return null

    const blockedTime = parseInt(blockedUntil, 10)
    const now = Date.now()

    if (now < blockedTime) {
      const remainingMinutes = Math.ceil((blockedTime - now) / 1000 / 60)
      return remainingMinutes
    }

    return null
  }

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

            {/* Additional instruction for TOTP */}
            {twoFactorEnabled && (
              <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
                Codes refresh every 30 seconds in your authenticator app
              </p>
            )}
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

          {/* Resend Message - only for email OTP */}
          {!twoFactorEnabled && resendState.message && (
            <div
              className={`mb-6 p-3 rounded-lg text-sm text-center ${
                resendState.success
                  ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {resendState.message}
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label className="text-slate-700 dark:text-foreground font-medium mb-4 block text-center">
                Verification Code
              </Label>

              {/* ✅ OTP Input Fields with paste support */}
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
                    onPaste={handlePaste} // ✅ Add paste handler to all inputs
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

          {/* Resend OTP Section - Only show for email-based OTP */}
          {!twoFactorEnabled && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-border">
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600 dark:text-muted-foreground">
                  Didn&apos;t receive the code?
                </p>

                {/* Check if user is blocked */}
                {(() => {
                  const blockedMinutes = getBlockedStatus()
                  if (blockedMinutes) {
                    return (
                      <div className="text-center">
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                          Too many attempts. Please try again later.
                        </p>
                        {/* <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1">
                          Please wait {blockedMinutes} minutes before trying
                          again
                        </p> */}
                      </div>
                    )
                  }

                  // Show normal resend logic if not blocked
                  if (canResend && resendAttempts < MAX_RESEND_ATTEMPTS) {
                    return (
                      <Button
                        variant="outline"
                        onClick={handleResendOTP}
                        disabled={isResending}
                        className="w-full border-ninja-gold text-ninja-gold hover:bg-ninja-gold hover:text-slate-900"
                      >
                        {isResending ? (
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Sending...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Send Code Again
                          </div>
                        )}
                      </Button>
                    )
                  } else if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
                    return (
                      <div className="text-center">
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                          Maximum attempts reached
                        </p>
                        <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1">
                          Account temporarily locked. Try again in 15 minutes
                        </p>
                      </div>
                    )
                  } else {
                    return (
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-muted-foreground mb-2">
                          You can request a new code in:
                        </p>
                        <div className="text-lg font-mono font-bold text-ninja-gold">
                          {formatTime(resendTimer)}
                        </div>
                      </div>
                    )
                  }
                })()}

                {/* Attempts remaining - only show if not blocked and has attempts */}
                {!getBlockedStatus() &&
                  resendAttempts > 0 &&
                  resendAttempts < MAX_RESEND_ATTEMPTS && (
                    <p className="text-xs text-slate-500 dark:text-muted-foreground">
                      {getRemainingAttempts()} attempt
                      {getRemainingAttempts() !== 1 ? 's' : ''} remaining
                    </p>
                  )}

                {/* Show current attempt count - only if not blocked */}
                {!getBlockedStatus() && resendAttempts > 0 && (
                  <div className="text-xs text-slate-500 dark:text-muted-foreground">
                    Resend requests: {resendAttempts}/{MAX_RESEND_ATTEMPTS}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TOTP Helper Section - Show for TOTP only */}
          {twoFactorEnabled && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-border">
              <div className="text-center space-y-3">
                <p className="text-sm text-slate-600 dark:text-muted-foreground">
                  Having trouble with your authenticator?
                </p>
                <div className="text-xs text-slate-500 dark:text-muted-foreground space-y-1">
                  <p>• Make sure your device time is synchronized</p>
                  <p>• Try waiting for the next code (refreshes every 30s)</p>
                  <p>• Check that you&apos;re using the correct app</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
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
