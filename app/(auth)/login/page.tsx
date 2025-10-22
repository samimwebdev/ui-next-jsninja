'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginAction, type FormState } from '../actions' // Import FormState from actions
import { loginSchema } from '@/lib/validation'
import { useQueryClient } from '@tanstack/react-query'
import GitHubAuthButton from '@/components/shared/github-button'
import { AnimatedAvatars } from '@/components/shared/animated-avatars'

import { getEnrolledUsers } from '@/lib/actions/enrolled-users'
import { EnrolledUser } from '@/types/enrolled-users'
import { toast } from 'sonner'

type FormData = {
  identifier: string
  password: string
}

// Remove local ActionState type and use FormState from actions
const Login = () => {
  const [state, formAction] = useActionState(loginAction, {
    message: '',
    errors: {},
    success: false,
    requiresOTP: false,
    userId: undefined,
    userInfo: undefined,
  } as FormState) // Use FormState instead of ActionState

  const [enrolledUsers, setEnrolledUsers] = React.useState<EnrolledUser[]>([])

  const queryClient = useQueryClient()

  const [isVisible, setIsVisible] = React.useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard/courses'
  const registrationMessage = searchParams.get('message')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setError,
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      identifier:
        process.env.NODE_ENV === 'development' ? 'anothertest@gmail.com' : '',
      password: process.env.NODE_ENV === 'development' ? '1234abcdA@' : '',
    },
  })

  useEffect(() => {
    if (searchParams.get('session_expired') === 'true') {
      toast.error('Session Expired', {
        description: 'Your session has expired. Please log in again.',
      })
    }

    if (searchParams.get('session_invalid') === 'true') {
      toast.error('Session Invalid', {
        description: 'Your session is invalid. Please log in again.',
      })
    }
  }, [searchParams])

  const onSubmit = async (data: FormData) => {
    try {
      clearErrors()

      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })

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

  // Handle redirects
  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setTimeout(() => {
        if (redirectPath) {
          window.location.href = redirectPath
        } else {
          router.push('/dashboard/courses')
        }
      }, 200)
    } else if (state.requiresOTP && state.userId) {
      // Redirect to OTP verification with JWT
      const email = getValues('identifier')
      const twoFactorEnabled = state.userInfo?.twoFactorEnabled
      router.push(
        `/verify-otp?userId=${state.userId}&email=${encodeURIComponent(
          email
        )}&twoFactor=${twoFactorEnabled}`
      )
    }
  }, [
    state.success,
    state.requiresOTP,
    state.userId,
    router,
    redirectPath,
    queryClient,
    getValues,
    state.userInfo,
  ])

  //get Enrolled users for animated avatars

  useEffect(() => {
    const fetchEnrolledUsers = async () => {
      const enrolledUsers = await getEnrolledUsers()
      setEnrolledUsers(enrolledUsers.data)
    }

    fetchEnrolledUsers()
  }, [])
  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-bl from-slate-50 via-slate-100 to-slate-200 dark:from-background dark:via-muted dark:to-card">
        <div className="absolute inset-0 bg-gradient-to-r from-ninja-gold/20 via-ninja-orange/10 to-ninja-gold/15 dark:from-ninja-gold/10 dark:via-transparent dark:to-ninja-orange/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-slate-900/10 dark:from-transparent dark:to-transparent" />

        <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 max-w-screen-xl mx-auto">
          <div className="grid items-center lg:grid-cols-2 gap-8 lg:gap-12 min-h-[calc(100vh-6rem)]">
            {/* Left Side - Welcome Content */}
            <div className="relative  lg:order-1">
              <div className="absolute inset-0 -m-8 bg-gradient-to-r from-white/80 via-white/60 to-transparent dark:from-background/80 dark:via-background/60 dark:to-transparent backdrop-blur-sm rounded-3xl" />

              <div className="relative z-10">
                <p className="inline-block text-sm font-medium text-ninja-navy  bg-ninja-gold dark:text-ninja-gold dark:text-gradient-ninja bg-ninja-gold/10 dark:bg-transparent px-3 py-1 rounded-full border border-ninja-gold/20">
                  Welcome Back
                </p>

                <div className="mt-6 md:mb-12 max-w-2xl">
                  <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-foreground leading-tight">
                    Continue your journey with{' '}
                    <span className="text-gradient-ninja">
                      Javascript Ninja
                    </span>
                  </h1>
                  <p className="text-xl text-slate-700 dark:text-muted-foreground font-medium leading-relaxed">
                    Access your courses, track progress, and level up your
                    coding skills.
                  </p>
                </div>

                <div className="hidden lg:block space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ninja-gold rounded-full"></div>
                    <span className="text-slate-700 dark:text-muted-foreground">
                      Access to enrolled courses
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ninja-orange rounded-full"></div>
                    <span className="text-slate-700 dark:text-muted-foreground">
                      Track your learning progress
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ninja-gold rounded-full"></div>
                    <span className="text-slate-700 dark:text-muted-foreground">
                      Connect with the community
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ninja-orange rounded-full"></div>
                    <span className="text-slate-700 dark:text-muted-foreground">
                      Download certificates
                    </span>
                  </div>
                </div>

                <div className="hidden lg:block mt-8 bg-white/80 dark:bg-card/80 backdrop-blur-lg p-4 rounded-2xl border border-slate-200/60 dark:border-border/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <AnimatedAvatars
                        users={enrolledUsers}
                        totalUsers={1500}
                        maxAvatars={4}
                        message="who have successfully advanced their careers"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="relative z-10 order-1 lg:order-2">
              <div className="w-full max-w-sm mx-auto bg-white/90 dark:bg-card/90 backdrop-blur-lg p-8 rounded-2xl border border-slate-200/60 dark:border-border/50 shadow-xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
                    Welcome Back
                  </h2>
                  <p className="mt-2 text-slate-600 dark:text-muted-foreground">
                    Sign in to your account
                  </p>
                </div>

                {/* GitHub Auth */}
                <div className="mb-6">
                  <GitHubAuthButton />
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm text-slate-500 dark:text-muted-foreground bg-white dark:bg-card">
                      OR
                    </span>
                  </div>
                </div>

                {/* Registration Success Message */}
                {registrationMessage && (
                  <div className="mb-4 p-3 rounded-lg text-sm text-center bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                    {registrationMessage}
                  </div>
                )}

                {/* Login Message */}
                {state.message && (
                  <div
                    className={`mb-4 p-3 rounded-lg text-sm text-center ${
                      state.success
                        ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : state.requiresOTP
                        ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    {state.errors.server ? (
                      <span>{state.errors.server.join(', ')}</span>
                    ) : (
                      state.message
                    )}
                  </div>
                )}

                {/* Login Form */}
                <form
                  className="space-y-5"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-slate-700 dark:text-foreground font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register('identifier', {
                        required: 'Email or username is required',
                      })}
                      className={`mt-2 bg-white dark:bg-background border-slate-300 dark:border-border focus:border-ninja-gold dark:focus:border-ninja-gold focus:ring-ninja-gold/20 transition-colors ${
                        errors.identifier
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : ''
                      }`}
                    />
                    {errors.identifier && (
                      <span className="text-sm text-red-500 block mt-1">
                        {errors.identifier.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="password"
                      className="text-slate-700 dark:text-foreground font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={isVisible ? 'text' : 'password'}
                        placeholder="Enter your password"
                        {...register('password')}
                        className={`pr-10 bg-white dark:bg-background border-slate-300 dark:border-border focus:border-ninja-gold dark:focus:border-ninja-gold focus:ring-ninja-gold/20 transition-colors ${
                          errors.password
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setIsVisible((prev) => !prev)}
                        aria-label={
                          isVisible ? 'Hide password' : 'Show password'
                        }
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-slate-400 dark:text-muted-foreground hover:text-slate-600 dark:hover:text-foreground transition-colors"
                      >
                        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-sm text-red-500 block mt-1">
                        {errors.password.message}
                      </span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-ninja-primary hover:bg-gradient-ninja-reverse text-slate-900 font-semibold py-2.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                {/* Footer Links */}
                <div className="mt-6 space-y-4 text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-ninja-gold-light dark:text-ninja-gold-dark hover:text-ninja-orange transition-colors font-medium"
                  >
                    Forgot your password?
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/register"
                      className="text-ninja-gold-light dark:text-ninja-gold-dark hover:text-ninja-orange transition-colors font-medium"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
