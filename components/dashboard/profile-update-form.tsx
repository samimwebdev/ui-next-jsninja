'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateProfileAction } from '@/app/(auth)/actions'
import { toast } from 'sonner'
import * as yup from 'yup'
import { StrapiImage } from '@/types/shared-types'

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

type ProfileUpdateFormData = yup.InferType<typeof profileUpdateSchema>

interface ProfileUpdateFormProps {
  username?: string
  profile: {
    id: number
    documentId: string
    email?: string
    discordUsername?: string
    bio?: string
    address?: string
    phoneNumber?: string
    image?: StrapiImage
  }
}

export function ProfileUpdateForm({
  profile,
  username,
}: ProfileUpdateFormProps) {
  const [state, formAction] = useActionState(
    updateProfileAction.bind(null, profile.documentId),
    {
      message: '',
      errors: {},
      success: false,
    }
  )

  // Use Strapi image by default, fallback to default image
  const [profileImage, setProfileImage] = useState(
    profile.image?.url || '/images/profile-default.jpg'
  )

  const form = useForm<ProfileUpdateFormData>({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      discordUsername: profile.discordUsername || '',
      bio: profile.bio || '',
      address: profile.address || '',
      phoneNumber: profile.phoneNumber || '',
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Error', {
          description: 'File size exceeds 1MB limit',
        })
        return
      }

      try {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setProfileImage(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error(error)
        toast.error('Error', {
          description: 'Failed to upload image.',
        })
      }
    }
  }

  async function onSubmit(data: ProfileUpdateFormData) {
    try {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value.toString())
        }
      })

      const fileInput = document.getElementById(
        'profile-image'
      ) as HTMLInputElement
      const file = fileInput?.files?.[0]
      if (file) {
        formData.append('image', file)
      }

      formAction(formData)
    } catch (error) {
      console.error(error)
      toast.error('Error', {
        description: 'Failed to update profile.',
      })
    }
  }

  // Handle success/error messages
  useEffect(() => {
    if (state.success) {
      toast.success('Profile Updated', {
        description: 'Your profile has been successfully updated.',
      })
    } else if (state.message && !state.success) {
      toast.error('Error', {
        description: state.message,
      })
    }

    // Set form errors
    if (state?.errors && Object.keys(state.errors).length > 0) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          form.setError(field as keyof ProfileUpdateFormData, {
            type: 'server',
            message: messages.join(', '),
          })
        }
      })
    }
  }, [state, form])

  const getInitials = () => {
    return username?.slice(0, 2).toUpperCase() || 'JD'
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileImage} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <p className="text-sm text-muted-foreground">
                  Recommended size: 256x256px. Max size: 1MB.
                </p>
              </div>
            </div>
          </div>

          {/* Disabled Username and Email Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username || ''}
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed"
                placeholder="Your username"
              />
              <p className="text-sm text-muted-foreground">
                Username cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ''}
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed"
                placeholder="Your email"
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>

          {/* Phone Number and Discord Username */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                {...form.register('phoneNumber')}
                placeholder="+8801712345678"
              />
              <p className="text-sm text-muted-foreground">
                Bangladeshi phone number (e.g., +8801712345678, 01712345678)
              </p>
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discordUsername">Discord Username</Label>
              <Input
                id="discordUsername"
                {...form.register('discordUsername')}
                placeholder="Your Discord username"
              />
              <p className="text-sm text-muted-foreground">
                Optional: Add your Discord username for community access
              </p>
              {form.formState.errors.discordUsername && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.discordUsername.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...form.register('bio')}
              placeholder="Tell us about yourself"
              className="resize-none min-h-[100px]"
            />
            {form.formState.errors.bio && (
              <p className="text-sm text-destructive">
                {form.formState.errors.bio.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...form.register('address')}
              placeholder="Your full address"
            />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
