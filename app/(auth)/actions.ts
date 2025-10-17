'use server'

import { redirect } from 'next/navigation'
import { strapiFetch } from '@/lib/strapi'
import { setAuthCookie, clearAuthCookie, getAuthToken } from '@/lib/auth'
import { registerSchema, loginSchema, otpSchema } from '@/lib/validation'
import { ValidationError } from 'yup'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import * as yup from 'yup'
import { cookies } from 'next/headers'

// Beautiful adjectives for username generation
const coolAdjectives = [
  'swift',
  'brave',
  'wise',
  'cool',
  'pro',
  'epic',
  'ace',
  'prime',
  'stellar',
  'cosmic',
  'bright',
  'clever',
  'smart',
  'super',
  'mega',
  'ultra',
  'turbo',
  'alpha',
  'beta',
  'sigma',
  'delta',
  'quantum',
  'ninja',
  'master',
  'expert',
  'legend',
  'titan',
  'phoenix',
  'storm',
]

// Fun suffixes for username generation
const coolSuffixes = [
  'dev',
  'coder',
  'tech',
  'geek',
  'wizard',
  'guru',
  'sensei',
  'pro',
  'master',
  'ninja',
  'hacker',
  'boss',
  'king',
  'queen',
  'star',
  'hero',
]

/**
 * Generates a beautiful, unique, and readable username
 * Patterns:
 * 1. firstname_adjective_number (e.g., john_swift_42)
 * 2. firstname_lastname_number (e.g., john_doe_99)
 * 3. adjective_firstname_suffix (e.g., cool_john_dev)
 * 4. firstname_suffix_number (e.g., john_ninja_7)
 */
function generateBeautifulUsername(
  firstName: string,
  lastName: string
): string {
  // Clean and normalize names
  const cleanFirst = firstName
    .toLowerCase()
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 12)
  const cleanLast = lastName
    .toLowerCase()
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 12)

  // Generate a short unique identifier (4 characters)
  const uniqueId = nanoid(4)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

  // Random number between 1-999
  const randomNum = Math.floor(Math.random() * 999) + 1

  // Choose a random pattern
  const patterns = [
    // Pattern 1: firstname_adjective_number
    () => {
      const adj =
        coolAdjectives[Math.floor(Math.random() * coolAdjectives.length)]
      return `${cleanFirst}_${adj}_${randomNum}`
    },

    // Pattern 2: firstname_lastname_number (if last name exists)
    () => {
      if (cleanLast.length > 2) {
        return `${cleanFirst}_${cleanLast}_${randomNum}`
      }
      return `${cleanFirst}_${uniqueId}`
    },

    // Pattern 3: adjective_firstname_suffix
    () => {
      const adj =
        coolAdjectives[Math.floor(Math.random() * coolAdjectives.length)]
      const suffix =
        coolSuffixes[Math.floor(Math.random() * coolSuffixes.length)]
      return `${adj}_${cleanFirst}_${suffix}`
    },

    // Pattern 4: firstname_suffix_number
    () => {
      const suffix =
        coolSuffixes[Math.floor(Math.random() * coolSuffixes.length)]
      return `${cleanFirst}_${suffix}_${randomNum}`
    },

    // Pattern 5: firstname.lastname (professional style)
    () => {
      if (cleanLast.length > 2) {
        return `${cleanFirst}.${cleanLast}${randomNum}`
      }
      return `${cleanFirst}.${uniqueId}`
    },

    // Pattern 6: firstLast_uniqueId (camelCase style)
    () => {
      const camelName =
        cleanFirst + cleanLast.charAt(0).toUpperCase() + cleanLast.slice(1)
      return `${camelName}_${uniqueId}`
    },
  ]

  // Randomly select a pattern
  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)]
  const username = selectedPattern()

  // Ensure username is within reasonable length (3-30 characters)
  return username.substring(0, 30)
}

export type FormState = {
  message: string
  errors: Record<string, string[]>
  success: boolean
  requiresOTP?: boolean
  userId?: number
  userInfo?: {
    email: string
    twoFactorEnabled: boolean
    jwt: string
    verifyType: string
  }
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

    // Generate a beautiful username
    const username = generateBeautifulUsername(
      validated.firstName,
      validated.lastName
    )

    const registrationData = {
      username: username,
      email: validated.email,
      password: validated.password,
    }

    const res = await strapiFetch<{
      jwt: string
      data: {
        jwt: string
        user: {
          id: number
          username: string
          email: string
          documentId: string
        }
      }
    }>('/api/auth/local/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    })

    // Create profile
    const profileData = {
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        user: res.data.user.documentId,
      },
    }

    await strapiFetch('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${res.data.jwt}`,
      },
    })

    return {
      message: 'Registration successful! Please sign in to continue.',
      errors: {},
      success: true,
    }
  } catch (error) {
    console.error('Registration error:', error)

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
      message: 'Registration failed. Please try again.',
      errors: error instanceof Error ? { server: [error.message] } : {},
      success: false,
    }
  }
}

export async function githubAuthAction() {
  const githubAuthUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/connect/github`
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

    const res = await strapiFetch<{
      jwt: string
      refreshToken: string
      user: {
        id: number
        username: string
        email: string
        enableTotp: boolean | null
      }
    }>('/api/auth/local', {
      method: 'POST',
      body: JSON.stringify(validated),
    })

    const cookieStore = await cookies()

    // Store temporary tokens for OTP verification
    cookieStore.set('temp_jwt', res.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300, // 5 minutes
    })

    cookieStore.set('temp_refresh', res.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300, // 5 minutes
    })

    // OTP is ALWAYS required after login
    return {
      message: res.user.enableTotp
        ? 'Please enter the code from your authenticator app.'
        : 'Please check your email for the verification code.',
      errors: {},
      success: false,
      requiresOTP: true,
      userId: res.user.id,
      userInfo: {
        email: res.user.email,
        twoFactorEnabled: !!res.user.enableTotp,
        jwt: res.jwt,
        verifyType: res.user.enableTotp ? 'totp' : 'email',
      },
    }
  } catch (error) {
    console.log('Login error:', error)
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
      message: 'Login failed. Please check your credentials.',
      errors:
        error instanceof Error
          ? { server: ['Login Failed, check your Email or Password'] }
          : {},
      success: false,
    }
  }
}

export async function verifyOTPAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData)

  try {
    const validated = await otpSchema.validate(data, {
      abortEarly: false,
    })

    const cookieStore = await cookies()
    const tempToken = cookieStore.get('temp_jwt')?.value
    const tempRefresh = cookieStore.get('temp_refresh')?.value

    if (!tempToken || !tempRefresh) {
      return {
        message: 'Your verification session has expired. Please log in again.',
        errors: { server: ['Session expired'] },
        success: false,
      }
    }

    const userId = data.userId as string
    const email = data.email as string

    const twoFactorEnabled = data.twoFactorEnabled === 'true'

    if (!userId || !email) {
      return {
        message: 'Session expired. Please login again.',
        errors: {},
        success: false,
      }
    }

    const verificationType = twoFactorEnabled ? 'totp' : 'email'

    // Verify OTP with Strapi - expecting new token format
    const res = await strapiFetch<{
      jwt: string
      refreshToken: string
      user: {
        id: number
        username: string
        email: string
        documentId: string
      }
    }>('/api/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tempToken}`,
      },
      body: JSON.stringify({
        code: validated.token,
        email: email,
        type: verificationType,
      }),
    })

    // Delete temporary cookies
    cookieStore.delete('temp_jwt')
    cookieStore.delete('temp_refresh')

    // Set permanent auth cookies with both tokens
    const { setAuthCookies } = await import('@/lib/auth')

    await setAuthCookies(res.jwt, res.refreshToken)

    return {
      message: 'Login successful. Redirecting to dashboard...',
      errors: {},
      success: true,
    }
  } catch (error) {
    console.error('OTP Verification error:', error)
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
      message: 'Invalid or expired verification code. Please try again.',
      errors: error instanceof Error ? { server: [error.message] } : {},
      success: false,
    }
  }
}

export async function generateSecret() {
  const token = await getAuthToken()

  const result = await strapiFetch<Promise<{ secret: string; url: string }>>(
    `/api/auth/generate-totp-secret`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return result
}

export async function saveTotpSecret(
  prevState: {
    message: string
    success?: boolean
    errors?: Record<string, string[]>
  },
  formData: FormData
) {
  const data = {
    code: formData.get('code'),
    secret: formData.get('secret'),
  }

  if (!data.code) {
    return {
      message: 'Verification code is required',
      success: false,
      errors: { code: ['Code is required'] },
    }
  }

  if (data.code.toString().length !== 6) {
    return {
      message: 'Please enter a valid 6-digit code',
      success: false,
      errors: { code: ['Code must be 6 digits'] },
    }
  }

  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        message: 'You must be logged in to setup 2FA',
        success: false,
        errors: { auth: ['Authentication required'] },
      }
    }

    await strapiFetch(`/api/auth/save-totp-secret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code: data.code,
        secret: data.secret,
      }),
    })

    // Return success instead of redirecting
    return {
      message: 'Two-factor authentication has been successfully enabled!',
      success: true,
      errors: {},
    }
  } catch (error) {
    console.error('TOTP setup failed:', error)

    return {
      message:
        'Invalid verification code. Please check the code from your authenticator app and try again.',
      success: false,
      errors: { code: ['Invalid or expired code'] },
    }
  }
}

export async function checkTotpStatus() {
  const token = await getAuthToken()

  if (!token) {
    return {
      message: 'You must be logged in to check 2FA status',
      success: false,
      errors: { auth: ['Authentication required'] },
    }
  }
  try {
    const result = await strapiFetch<{ enabled: boolean }>(
      `/api/auth/totp-enabled`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return {
      message: '2FA status retrieved successfully',
      success: true,
      twoFactorEnabled: (result as { enabled: boolean }).enabled,
      errors: {},
    }
  } catch (err) {
    console.error('Error checking TOTP status:', err)
    return {
      message: 'Failed to check 2FA status. Please try again later.',
      success: false,
      errors: { server: ['Failed to check 2FA status'] },
    }
  }
}

export async function logoutAction() {
  'use server'
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

    await strapiFetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(validated),
    })

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

// Add this function to your existing actions.ts file

export async function disableTotpAction() {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        message: 'You must be logged in to disable 2FA',
        success: false,
        errors: { auth: ['Authentication required'] },
      }
    }

    const res = await strapiFetch(`/api/auth/disable-totp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('TOTP disable successful:', res)

    return {
      message: 'Two-factor authentication has been successfully disabled.',
      success: true,
      errors: {},
    }
  } catch (error) {
    console.error('TOTP disable failed:', error)

    return {
      message: 'Failed to disable two-factor authentication. Please try again.',
      success: false,
      errors: { server: ['Failed to disable 2FA'] },
    }
  }
}

export async function resendOTPAction(): Promise<FormState> {
  try {
    // Get the temporary JWT from cookies
    const tempToken = (await cookies()).get('temp_jwt')?.value

    if (!tempToken) {
      return {
        message: 'Session expired. Please log in again.',
        errors: { server: ['Session expired'] },
        success: false,
      }
    }

    // Call your Strapi resend OTP endpoint
    const res = await strapiFetch<{
      message: string
      success: boolean
    }>('/api/auth/resend-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tempToken}`,
      },
    })

    return {
      message: res.message,
      errors: {},
      success: res.success,
    }
  } catch (error) {
    console.error('Resend OTP error:', error)

    return {
      message: 'Failed to resend OTP. Please try again.',
      errors: error instanceof Error ? { server: [error.message] } : {},
      success: false,
    }
  }
}
