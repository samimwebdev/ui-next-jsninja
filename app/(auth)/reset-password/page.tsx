'use client'

import React, { useActionState, useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Eye, EyeOff, Info, Check, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSearchParams, useRouter } from 'next/navigation'
import * as yup from 'yup'
import { resetPasswordAction } from '../actions'

type FormData = {
  password: string
  confirmPassword: string
}

type ActionState = {
  message: string
  errors: Record<string, string[]>
  success: boolean
}

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!-/:-@[-`{-~]/, text: 'At least 1 special character' },
] as const

type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5

const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least 1 number')
    .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .matches(
      /[!-/:-@[-`{-~]/,
      'Password must contain at least 1 special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], "Passwords don't match")
    .required('Password confirmation is required'),
})

const ResetPassword = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')

  const [state, formAction] = useActionState(resetPasswordAction, {
    message: '',
    errors: {},
    success: false,
  } as ActionState)

  const [isVisible, setIsVisible] = useState(false)
  const [password, setPassword] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setError,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const watchedPassword = watch('password')

  const passwordStrength = useMemo(() => {
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      met: req.regex.test(password),
      text: req.text,
    }))

    return {
      score: requirements.filter((req) => req.met).length as StrengthScore,
      check: requirements,
    }
  }, [password])

  const onSubmit = async (data: FormData) => {
    if (!code) return

    try {
      clearErrors()

      const formData = new FormData()
      formData.append('code', code)
      formData.append('password', data.password)
      formData.append('passwordConfirmation', data.confirmPassword)

      formAction(formData)
    } catch (err) {
      console.error('Submission error:', err)
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

  // Redirect on success
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [state.success, router])

  if (!code) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-full h-full grid lg:grid-cols-2">
          <div className="max-w-xs m-auto w-full flex flex-col items-center">
            <p className="mt-4 text-3xl font-bold tracking-tight text-red-600">
              Invalid Reset Link
            </p>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              This password reset link is invalid or expired.
            </p>
            <div className="mt-8">
              <Link href="/forgot-password">
                <Button variant="outline">Request New Link</Button>
              </Link>
            </div>
          </div>
          <div className="bg-muted hidden lg:block">
            <Image
              src="https://fastly.picsum.photos/id/60/1920/1200.jpg?hmac=fAMNjl4E_sG_WNUjdU39Kald5QAHQMh-_-TsIbbeDNI"
              className="w-full h-full inset-0 object-cover"
              alt="Working Station"
              width={1920}
              height={1200}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          <p className="mt-4 text-3xl font-bold tracking-tight">
            Reset Password
          </p>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Please enter your new password
          </p>

          {/* Success/Error Message */}
          {state.message && (
            <div
              className={`mt-4 mb-4 text-sm text-center ${
                state.success ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {state.errors.server ? (
                <span className="text-red-500">
                  {state.errors.server.join(', ')}
                </span>
              ) : (
                state.message
              )}
              {state.success && (
                <p className="mt-1 text-xs">Redirecting to login page...</p>
              )}
            </div>
          )}

          <form
            className="w-full space-y-4 mt-8"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="password">New Password</Label>
                <HoverCard openDelay={200}>
                  <HoverCardTrigger>
                    <Info size={20} className="cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-background">
                    <ul
                      className="space-y-1.5"
                      aria-label="Password requirements"
                    >
                      {passwordStrength.check.map((req, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          {req.met ? (
                            <Check size={16} className="text-emerald-500" />
                          ) : (
                            <X size={16} className="text-muted-foreground/80" />
                          )}
                          <span
                            className={`text-xs ${
                              req.met
                                ? 'text-emerald-600'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {req.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={isVisible ? 'text' : 'password'}
                  placeholder="Enter new password"
                  {...register('password', {
                    onChange: (e) => setPassword(e.target.value),
                  })}
                  className={`pr-10 transition-colors ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsVisible((prev) => !prev)}
                  aria-label={isVisible ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground/80 hover:text-foreground"
                >
                  {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="min-h-[1.25rem]">
                {errors.password && (
                  <span className="text-sm text-red-500 block">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="flex gap-2 w-full justify-between">
              {[1, 2, 3, 4, 5].map((score) => (
                <span
                  key={score}
                  className={`${
                    passwordStrength.score >= score
                      ? score <= 3
                        ? 'bg-red-400'
                        : 'bg-green-500'
                      : 'bg-border'
                  } p-1 rounded-full w-full`}
                />
              ))}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={isVisible ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  {...register('confirmPassword')}
                  className={`pr-10 transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsVisible((prev) => !prev)}
                  aria-label={isVisible ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground/80 hover:text-foreground"
                >
                  {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="min-h-[1.25rem]">
                {errors.confirmPassword && (
                  <span className="text-sm text-red-500 block">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={isSubmitting || state.success}
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>

          <div className="mt-5 space-y-5">
            <p className="text-sm text-center">
              Remember your password?
              <Link
                href="/login"
                className="ml-1 underline text-muted-foreground"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-muted hidden lg:block">
          <Image
            src="https://fastly.picsum.photos/id/60/1920/1200.jpg?hmac=fAMNjl4E_sG_WNUjdU39Kald5QAHQMh-_-TsIbbeDNI"
            className="w-full h-full inset-0 object-cover"
            alt="Working Station"
            width={1920}
            height={1200}
          />
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
