'use client'

import React from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Eye, EyeOff, Info, X, AlertCircle } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!-/:-@[-`{-~]/, text: 'At least 1 special characters' },
] as const

type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5

type PasswordStrength = {
  score: StrengthScore
  check: Array<{
    met: boolean
    text: string
  }>
}

// Define the form schema with Zod
const formSchema = z
  .object({
    fname: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters' }),
    lname: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters' }),
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof formSchema>

const SignUpForm = () => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false)
  const [password, setPassword] = React.useState<string>('')

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: '',
      lname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordStrength = React.useMemo((): PasswordStrength => {
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      met: req.regex.test(password),
      text: req.text,
    }))

    return {
      score: requirements.filter((req) => req.met).length as StrengthScore,
      check: requirements,
    }
  }, [password])

  const onSubmit = (data: FormValues) => {
    console.log(data)
    // Handle form submission here
  }

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
                  className="underline text-primary hover:text-primary font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fname"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <Label htmlFor="fname">First Name</Label>
                        <FormControl>
                          <Input
                            id="fname"
                            placeholder="Enter Your First Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.fname && (
                            <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                              <AlertCircle size={16} />
                              <span>{form.formState.errors.fname.message}</span>
                            </div>
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lname"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <Label htmlFor="lname">Last Name</Label>
                        <FormControl>
                          <Input
                            id="lname"
                            placeholder="Enter Your Last Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.lname && (
                            <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                              <AlertCircle size={16} />
                              <span>{form.formState.errors.lname.message}</span>
                            </div>
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <FormControl>
                          <Input
                            id="username"
                            placeholder="Choose Your Username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.username && (
                            <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                              <AlertCircle size={16} />
                              <span>
                                {form.formState.errors.username.message}
                              </span>
                            </div>
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="demo@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.email && (
                            <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                              <AlertCircle size={16} />
                              <span>{form.formState.errors.email.message}</span>
                            </div>
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 relative">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
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
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={isVisible ? 'text' : 'password'}
                            placeholder="Choose Your Password"
                            aria-invalid={passwordStrength.score < 4}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setPassword(e.target.value)
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setIsVisible((prev) => !prev)}
                            aria-label={
                              isVisible ? 'Hide password' : 'Show password'
                            }
                            className="absolute inset-y-0 right-0 outline-none flex items-center justify-center w-9 text-muted-foreground/80 hover:text-foreground"
                          >
                            {isVisible ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.password && (
                          <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                            <AlertCircle size={16} />
                            <span>
                              {form.formState.errors.password.message}
                            </span>
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 w-full justify-between">
                  <span
                    className={`${
                      passwordStrength.score >= 1 ? 'bg-red-200' : 'bg-border'
                    }  p-1 rounded-full w-full`}
                  ></span>
                  <span
                    className={`${
                      passwordStrength.score >= 2 ? 'bg-red-300' : 'bg-border'
                    }  p-1 rounded-full w-full`}
                  ></span>
                  <span
                    className={`${
                      passwordStrength.score >= 3 ? 'bg-red-400' : 'bg-border'
                    }  p-1 rounded-full w-full`}
                  ></span>
                  <span
                    className={`${
                      passwordStrength.score >= 4 ? 'bg-green-500' : 'bg-border'
                    }  p-1 rounded-full w-full`}
                  ></span>
                  <span
                    className={`${
                      passwordStrength.score >= 5 ? 'bg-green-600' : 'bg-border'
                    }  p-1 rounded-full w-full`}
                  ></span>
                </div>

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-4 relative">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={isVisible ? 'text' : 'password'}
                            placeholder="Confirm Your Password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setIsVisible((prev) => !prev)}
                            aria-label={
                              isVisible ? 'Hide password' : 'Show password'
                            }
                            className="absolute inset-y-0 right-0 outline-none flex items-center justify-center w-9 text-muted-foreground/80 hover:text-foreground"
                          >
                            {isVisible ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.confirmPassword && (
                          <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                            <AlertCircle size={16} />
                            <span>
                              {form.formState.errors.confirmPassword.message}
                            </span>
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Create an account
                </Button>
                <div className="relative ">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm ">
                    <span className="px-2 bg-white dark:text-black rounded-md">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button className="w-full gap-3">
                  <GoogleLogo />
                  Continue with Google
                </Button>

                <p className="text-xs text-center mt-2">
                  By creating an account, you agree to our{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

const GoogleLogo = () => (
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
      ></path>
      <path
        d="M7.99812 16C10.1558 16 11.9753 15.2915 13.3011 14.0687L10.7231 12.0698C10.0058 12.5578 9.07988 12.8341 8.00106 12.8341C5.91398 12.8341 4.14436 11.426 3.50942 9.53296H0.849121V11.5936C2.2072 14.295 4.97332 16 7.99812 16Z"
        fill="#34A853"
      ></path>
      <path
        d="M3.50665 9.53295C3.17154 8.53938 3.17154 7.4635 3.50665 6.46993V4.4093H0.849292C-0.285376 6.66982 -0.285376 9.33306 0.849292 11.5936L3.50665 9.53295Z"
        fill="#FBBC04"
      ></path>
      <path
        d="M7.99812 3.16589C9.13867 3.14825 10.241 3.57743 11.067 4.36523L13.3511 2.0812C11.9048 0.723121 9.98526 -0.0235266 7.99812 -1.02057e-05C4.97332 -1.02057e-05 2.2072 1.70493 0.849121 4.40932L3.50648 6.46995C4.13848 4.57394 5.91104 3.16589 7.99812 3.16589Z"
        fill="#EA4335"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="15.6825" height="16" fill="white"></rect>
      </clipPath>
    </defs>
  </svg>
)

export default SignUpForm
