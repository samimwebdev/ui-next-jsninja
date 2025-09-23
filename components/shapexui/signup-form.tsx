'use client'

import React, { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Eye, EyeOff, Info, X } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { PASSWORD_REQUIREMENTS, registerSchema } from '@/lib/validation'
import { registerAction } from '@/app/(auth)/actions'
import { useRouter } from 'next/navigation'
import GitHubAuthButton from '../shared/github-button'

type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5

type checkType = {
  met: boolean
  text: string
}

type PasswordStrength = {
  score: StrengthScore
  check: checkType[]
}

type FormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

const SignUp = () => {
  const [state, formAction] = useActionState(registerAction, {
    message: '',
    errors: {},
    success: false,
  })

  const router = useRouter()

  const [isVisible, setIsVisible] = React.useState<boolean>(false)
  const [isConfirmVisible, setIsConfirmVisible] = React.useState<boolean>(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
    trigger,
    clearErrors,
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const watchedPassword = watch('password')

  const passwordStrength = React.useMemo((): PasswordStrength => {
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      met: req.regex.test(watchedPassword || ''),
      text: req.text,
    }))

    return {
      score: requirements.filter((req) => req.met).length as StrengthScore,
      check: requirements,
    }
  }, [watchedPassword])

  const onSubmit = async (data: FormData) => {
    try {
      clearErrors()

      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Call server action manually
      formAction(formData)
    } catch (err) {
      console.error('Submission error:', err)
    }
  }

  // Handle password change to re-validate confirm password
  const handlePasswordChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.info('Password changed', evt)
    // Trigger validation for confirm password when password changes
    if (touchedFields.confirmPassword) {
      await trigger('confirmPassword')
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

  // Redirect after successful registration - NOW GOES TO LOGIN
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/login?message=Registration successful! Please sign in.')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [state.success, router])

  return (
    <section className="">
      <div className="py-10">
        <Card className="mx-auto max-w-lg rounded-xl">
          <CardHeader>
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold">Create Account</h2>
              <p className="mt-3">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="underline text-primary text-link-light hover:text-ninja-orange dark:text-link-dark font-medium"
                >
                  Sign in
                </Link>
              </p>
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
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter Your First Name."
                      {...register('firstName')}
                      className={`transition-colors ${
                        errors.firstName
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : ''
                      }`}
                    />
                    <div className="min-h-[1.25rem]">
                      {errors.firstName && (
                        <span className="text-sm text-red-500 block">
                          {errors.firstName.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter Your Last Name."
                      {...register('lastName')}
                      className={`transition-colors ${
                        errors.lastName
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : ''
                      }`}
                    />
                    <div className="min-h-[1.25rem]">
                      {errors.lastName && (
                        <span className="text-sm text-red-500 block">
                          {errors.lastName.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="demo@example.com"
                    {...register('email')}
                    className={`transition-colors ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : ''
                    }`}
                  />
                  <div className="min-h-[1.25rem]">
                    {errors.email && (
                      <span className="text-sm text-red-500 block">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid gap-2 relative">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger>
                        <Info
                          size={20}
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                        />
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-background w-80">
                        <ul
                          className="space-y-1.5"
                          aria-label="Password requirements"
                        >
                          {passwordStrength.check.map((req, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              {req.met ? (
                                <Check
                                  size={16}
                                  className="text-emerald-500 flex-shrink-0"
                                />
                              ) : (
                                <X
                                  size={16}
                                  className="text-muted-foreground/80 flex-shrink-0"
                                />
                              )}
                              <span
                                className={`text-xs ${
                                  req.met
                                    ? 'text-emerald-600'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {req.text}
                                <span className="sr-only">
                                  {req.met
                                    ? ' - Requirement met'
                                    : ' - Requirement not met'}
                                </span>
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
                      placeholder="Choose Your Password."
                      type={isVisible ? 'text' : 'password'}
                      aria-invalid={passwordStrength.score < 4}
                      {...register('password', {
                        onChange: handlePasswordChange,
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

                <div className="flex gap-2 w-full justify-between">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={`h-2 rounded-full w-full transition-colors ${
                        passwordStrength.score > index
                          ? index < 2
                            ? 'bg-red-400'
                            : index < 3
                            ? 'bg-yellow-400'
                            : 'bg-green-500'
                          : 'bg-border'
                      }`}
                    />
                  ))}
                </div>

                <div className="grid gap-2 relative">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={isConfirmVisible ? 'text' : 'password'}
                      placeholder="Confirm Your Password."
                      {...register('confirmPassword')}
                      className={`pr-10 transition-colors ${
                        errors.confirmPassword
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setIsConfirmVisible((prev) => !prev)}
                      aria-label={
                        isConfirmVisible ? 'Hide password' : 'Show password'
                      }
                      className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground/80 hover:text-foreground"
                    >
                      {isConfirmVisible ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
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
                  className="w-full bg-gradient-ninja-primary hover:bg-gradient-ninja-reverse text-slate-900 font-semibold py-2.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create an account'}
                </Button>
              </div>
            </form>
            <div className="w-full mt-4">
              <GitHubAuthButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default SignUp
