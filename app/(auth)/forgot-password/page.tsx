'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { forgotPasswordAction } from '../actions'

type FormData = {
  email: string
}

type ActionState = {
  message: string
  errors: Record<string, string[]>
  success: boolean
}

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
})

const ForgotPassword = () => {
  const [state, formAction] = useActionState(forgotPasswordAction, {
    message: '',
    errors: {},
    success: false,
  } as ActionState)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setError,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  })

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

  // Reset form on success
  useEffect(() => {
    if (state.success) {
      reset()
    }
  }, [state.success, reset])

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          <p className="mt-4 text-3xl font-bold tracking-tight">
            Forgot Password
          </p>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Enter your email address and we&apos;ll send you a link to reset
            your password
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
            </div>
          )}

          <form
            className="w-full space-y-4 mt-8"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
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

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={isSubmitting || state.success}
            >
              {isSubmitting ? 'Sending link...' : 'Send Reset Link'}
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

export default ForgotPassword
