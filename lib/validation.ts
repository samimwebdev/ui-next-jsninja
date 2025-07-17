import * as yup from 'yup'

export const PASSWORD_REQUIREMENTS = [
  { regex: /[a-z]/, text: 'At least one lowercase letter' },
  { regex: /[A-Z]/, text: 'At least one uppercase letter' },
  { regex: /\d/, text: 'At least one number' },
  { regex: /[@$!%*?&]/, text: 'At least one special character' },
  { regex: /.{8,}/, text: 'At least 8 characters' },
]

// Define the form schema with Zod
export const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be no more than 20 characters')
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    )
    .test(
      'no-leading-number',
      'Username cannot start with a number',
      (value) => {
        return value ? !/^[0-9]/.test(value) : true
      }
    ),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  password: yup
    .string()
    .required('Password is required')
    .test(
      'password-strength',
      'Password does not meet security requirements',
      (value) => {
        if (!value) return false
        const requirements = PASSWORD_REQUIREMENTS.map((req) =>
          req.regex.test(value)
        )
        const score = requirements.filter(Boolean).length
        return score >= 4
      }
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
})

export const loginSchema = yup.object().shape({
  identifier: yup
    .string()
    .test(
      'is-email-or-username',
      'Must be a valid email or valid username',
      function (value) {
        if (!value) return false
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        return isEmail || value.length >= 3
      }
    )
    .required('Identifier is required'),

  password: yup.string().required('Password is required'),
})
