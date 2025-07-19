'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginAction } from '../actions'
import { loginSchema } from '@/lib/validation'

type FormData = {
  identifier: string
  password: string
}

type ActionState = {
  message: string
  errors: Record<string, string[]>
  success: boolean
}

const Login = () => {
  const [state, formAction] = useActionState(loginAction, {
    message: '',
    errors: {},
    success: false,
  } as ActionState)

  const [isVisible, setIsVisible] = React.useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard' //

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      identifier: 'pamkor@gmail.com',
      password: 'sfazlu123',
    },
  })

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

  // Redirect after successful login
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push(redirectPath)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [state.success, router, redirectPath])

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          <p className="mt-4 text-3xl font-bold tracking-tight">Log in</p>

          <Button className="mt-8 w-full gap-3" type="button">
            <GoogleLogo />
            Continue with Google
          </Button>

          <div className="my-7 w-full flex items-center justify-center overflow-hidden">
            <Separator />
            <span className="text-sm px-2">OR</span>
            <Separator />
          </div>
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
            </div>
          )}

          <form
            className="w-full space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register('identifier', {
                  required: 'Email or username is required',
                })}
                className={`transition-colors ${
                  errors.identifier
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : ''
                }`}
              />
              <div className="min-h-[1.25rem]">
                {errors.identifier && (
                  <span className="text-sm text-red-500 block">
                    {errors.identifier.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isVisible ? 'text' : 'password'}
                  placeholder="Password"
                  {...register('password')}
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

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Continue with Email'}
            </Button>
          </form>

          <div className="mt-5 space-y-5">
            <Link
              href="/forgot-password"
              className="text-sm block underline text-muted-foreground text-center"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-center">
              Don&apos;t have an account?
              <Link
                href="/register"
                className="ml-1 underline text-muted-foreground"
              >
                Create account
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

const GoogleLogo: React.FC = () => (
  <svg
    width="1.2em"
    height="1.2em"
    id="icon-google"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0 align-sub text-[inherit] size-lg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M15.6823 8.18368C15.6823 7.63986 15.6382 7.0931 15.5442 6.55811H7.99829V9.63876H12.3194C12.1401 10.6323 11.564 11.5113 10.7203 12.0698V14.0687H13.2983C14.8122 12.6753 15.6823 10.6176 15.6823 8.18368Z"
        fill="#4285F4"
      />
      <path
        d="M7.99812 16C10.1558 16 11.9753 15.2915 13.3011 14.0687L10.7231 12.0698C10.0058 12.5578 9.07988 12.8341 8.00106 12.8341C5.91398 12.8341 4.14436 11.426 3.50942 9.53296H0.849121V11.5936C2.2072 14.295 4.97332 16 7.99812 16Z"
        fill="#34A853"
      />
      <path
        d="M3.50665 9.53295C3.17154 8.53938 3.17154 7.4635 3.50665 6.46993V4.4093H0.849292C-0.285376 6.66982 -0.285376 9.33306 0.849292 11.5936L3.50665 9.53295Z"
        fill="#FBBC04"
      />
      <path
        d="M7.99812 3.16589C9.13867 3.14825 10.241 3.57743 11.067 4.36523L13.3511 2.0812C11.9048 0.723121 9.98526 -0.0235266 7.99812 -1.02057e-05C4.97332 -1.02057e-05 2.2072 1.70493 0.849121 4.40932L3.50648 6.46995C4.13848 4.57394 5.91104 3.16589 7.99812 3.16589Z"
        fill="#EA4335"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="15.6825" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Login
