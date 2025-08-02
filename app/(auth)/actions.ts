'use server'

import { redirect } from 'next/navigation'
import { strapiFetch } from '@/lib/strapi'
import { setAuthCookie, clearAuthCookie, getAuthToken } from '@/lib/auth'
import { registerSchema, loginSchema } from '@/lib/validation'
import { ValidationError } from 'yup'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import * as yup from 'yup'

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
export async function githubAuthAction() {
  const githubAuthUrl = `${process.env.STRAPI_URL}/api/connect/github`
  redirect(githubAuthUrl)
}

export async function githubCallbackAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData)

  try {
    const accessToken = data.access_token as string

    if (!accessToken) {
      return {
        message: 'GitHub authentication failed',
        errors: { auth: ['No access token received'] },
        success: false,
      }
    }

    // Exchange access token with Strapi
    const res = await strapiFetch<{
      jwt: string
      user: {
        id: number
        username: string
        email: string
        documentId: string
      }
    }>(`/github/callback?access_token=${accessToken}`)

    await setAuthCookie(res.jwt)

    return {
      message: 'GitHub authentication successful. Redirecting to dashboard...',
      errors: {},
      success: true,
    }
  } catch (error) {
    console.error('GitHub auth callback error:', error)

    return {
      message: 'GitHub authentication failed',
      errors: error instanceof Error ? { auth: [error.message] } : {},
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
  await clearAuthCookie()
  revalidatePath('/')
  redirect('/login')
}

// Add validation schemas for password reset
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
})

const resetPasswordSchema = yup.object({
  code: yup.string().required('Reset code is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
})

export async function forgotPasswordAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData)

  try {
    const validated = await forgotPasswordSchema.validate(data, {
      abortEarly: false,
    })

    const res = await strapiFetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(validated),
    })

    console.log('Forgot password response:', res)
    return {
      message: 'Password reset link has been sent to your email address.',
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

    console.error('Forgot password error:', error)

    return {
      message: 'Failed to send reset email. Please check your email address.',
      errors: {},
      success: false,
    }
  }
}

export async function resetPasswordAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData)

  try {
    const validated = await resetPasswordSchema.validate(data, {
      abortEarly: false,
    })

    await strapiFetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(validated),
    })

    return {
      message: 'Password has been reset successfully!',
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

    console.error('Reset password error:', error)

    return {
      message:
        'Failed to reset password. The reset link may be invalid or expired.',
      errors: {},
      success: false,
    }
  }
}

const profileUpdateSchema = yup.object({
  discordUsername: yup.string().optional(),
  bio: yup.string().max(500, 'Bio must be less than 500 characters').optional(),
  address: yup.string().optional(),
  phoneNumber: yup
    .string()
    .matches(
      /^(\+880|880|0)?(1[3-9]\d{8})$/,
      'Please enter a valid Bangladeshi phone number'
    )
    .optional(),
})

//Update Profile Action
export async function updateProfileAction(
  profileId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return {
        message: 'You must be logged in to update your profile',
        errors: { auth: ['Authentication required'] },
        success: false,
      }
    }

    const data = Object.fromEntries(formData)
    const avatarFile = formData.get('image') as File

    const validated = await profileUpdateSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    })

    let requestBody: FormData | string
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    }

    if (avatarFile && avatarFile.size > 0) {
      const formDataForUpload = new FormData()
      formDataForUpload.append('data', JSON.stringify(validated))
      // Change from 'files.image' to just 'image' to match your Strapi controller
      formDataForUpload.append('image', avatarFile)
      requestBody = formDataForUpload
    } else {
      requestBody = JSON.stringify({ data: validated })
      headers['Content-Type'] = 'application/json'
    }

    await strapiFetch(`/api/profiles/${profileId}?populate=image`, {
      method: 'PUT',
      headers,
      body: requestBody,
    })

    // console.log({ response }, 'Profile update response')

    revalidatePath('/dashboard')

    return {
      message: 'Profile updated successfully!',
      errors: {},
      success: true,
    }
  } catch (error) {
    console.error('Profile update error:', error)

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

    return {
      message: 'Failed to update profile. Please try again.',
      errors: error instanceof Error ? { server: [error.message] } : {},
      success: false,
    }
  }
}
