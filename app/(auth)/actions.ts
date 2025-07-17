'use server'

import { redirect } from 'next/navigation'
import { strapiFetch } from '@/lib/strapi'
import { setAuthCookie, clearAuthCookie } from '@/lib/auth'
import { registerSchema, loginSchema } from '@/lib/validation'
import { ValidationError } from 'yup'
import { nanoid } from 'nanoid'

function generateReadableUsernameWithSeparator(
  firstName: string,
  lastName: string
): string {
  const cleanFirst = firstName.toLowerCase().replace(/[^a-zA-Z]/g, '')
  const cleanLast = lastName.toLowerCase().replace(/[^a-zA-Z]/g, '')

  // Use first name + last initial + short nanoID for better readability
  const firstPart = cleanFirst.substring(0, Math.min(6, cleanFirst.length))
  const lastInitial = cleanLast.charAt(0)
  const uniqueId = nanoid(4)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

  return `${firstPart}${lastInitial}${uniqueId}`
}

export type FormState = {
  message: string
  errors: Record<string, string[]>
  success: boolean
}

export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData)
  try {
    const validated = await registerSchema.validate(data, {
      abortEarly: false,
    })

    const registrationData = {
      username: generateReadableUsernameWithSeparator(
        validated.firstName,
        validated.lastName
      ),
      email: validated.email,
      password: validated.password,
    }

    console.log({ validated })

    const res = await strapiFetch<{
      jwt: string
      user: {
        id: number
        username: string
        email: string
        documentId: string // Assuming this is the user ID in your Strapi setup
      }
    }>('/api/auth/local/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    })

    await setAuthCookie(res.jwt)

    const profileData = {
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        user: res.user.documentId, // Attach the user ID from the registration response
      },
    }

    //create a new profile attached to the registered user
    await strapiFetch('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${res.jwt}`,
      },
    })

    return {
      message: 'Registration successful. Redirecting to dashboard...',
      errors: {},
      success: true,
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const fieldErrors: Record<string, string[]> = {}
      error.inner.forEach((err) => {
        if (!err.path) return
        if (!fieldErrors[err.path]) fieldErrors[err.path] = []
        fieldErrors[err.path].push(err.message)
      })

      return {
        message: 'Invalid input',
        errors: fieldErrors,
        success: false,
      }
    }

    // Handle other errors (e.g., network issues, server errors)

    return {
      message: 'Registration failed. Please try again.',
      errors: error instanceof Error ? { server: [error.message] } : {},
      success: false,
    }
  }
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData)

  try {
    const validated = await loginSchema.validate(data, {
      abortEarly: false,
    })

    const res = await strapiFetch<{ jwt: string }>('/api/auth/local', {
      method: 'POST',
      body: JSON.stringify(validated),
    })

    await setAuthCookie(res.jwt)

    return {
      message: 'Login successful. Redirecting to dashboard...',
      errors: {},
      success: true,
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const fieldErrors: Record<string, string[]> = {}
      error.inner.forEach((err) => {
        if (!err.path) return
        if (!fieldErrors[err.path]) fieldErrors[err.path] = []
        fieldErrors[err.path].push(err.message)
      })

      return {
        message: 'Invalid input',
        errors: fieldErrors,
        success: false,
      }
    }

    console.error('Login action error:', error)

    return {
      message: 'Login failed. Please check your credentials.',
      errors:
        error instanceof Error
          ? { server: ['Login Failed, check your Email or Password'] }
          : {},
      success: false,
    }
  }
}

export async function logoutAction() {
  clearAuthCookie()
  redirect('/login')
}
