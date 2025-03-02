'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Check, Eye, EyeOff, Info, X } from 'lucide-react'
import { useState, useMemo } from 'react'

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!-/:-@[-`{-~]/, text: 'At least 1 special character' },
] as const

type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[0-9]/, { message: 'Password must contain at least 1 number' })
    .regex(/[a-z]/, {
      message: 'Password must contain at least 1 lowercase letter',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least 1 uppercase letter',
    })
    .regex(/[!-/:-@[-`{-~]/, {
      message: 'Password must contain at least 1 special character',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof formSchema>

const ResetPassword = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [password, setPassword] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

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

  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Password reset successful', {
        description: 'Your password has been successfully reset.',
      })
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to reset password. Please try again.',
      })
    }
  }

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Please enter your new password
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2 relative">
                    <div className="flex justify-between">
                      <FormLabel>New Password</FormLabel>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger>
                          <Info size={20} className={`cursor-pointer`} />
                        </HoverCardTrigger>
                        <HoverCardContent className="bg-background">
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
                                    className="text-emerald-500"
                                  />
                                ) : (
                                  <X
                                    size={16}
                                    className="text-muted-foreground/80"
                                  />
                                )}
                                <span
                                  className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
                                >
                                  {req.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isVisible ? 'text' : 'password'}
                          placeholder="Enter new password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setPassword(e.target.value)
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setIsVisible((prev) => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {isVisible ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 w-full justify-between">
                {[1, 2, 3, 4, 5].map((score) => (
                  <span
                    key={score}
                    className={`${passwordStrength.score >= score ? score <= 3 ? 'bg-red-400' : 'bg-green-500' : 'bg-border'} p-1 rounded-full w-full`}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isVisible ? 'text' : 'password'}
                          placeholder="Confirm new password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setIsVisible((prev) => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {isVisible ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Resetting Password...'
                  : 'Reset Password'}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-primary underline"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword