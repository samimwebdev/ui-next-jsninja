'use client'

import type React from 'react'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

const profileFormSchema = z.object({
  username: z.string().min(2).max(30),
  email: z.string().email(),
  bio: z.string().max(160).min(4),
  discordUsername: z.string().min(2).optional(),
  address: z.string().min(10, 'Address must be at least 10 characters long'),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Mock initial data
const defaultValues: ProfileFormValues = {
  username: 'johndoe',
  email: 'john@example.com',
  bio: 'Frontend developer passionate about React and TypeScript',
  discordUsername: 'johndoe#1234',
  address: '123 Main St, New York, NY 10001, USA',
}

export default function ProfilePage() {
  // const { toast } = useToast()
  const [profileImage, setProfileImage] = useState(
    '/images/profile-default.jpg'
  )
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ProfileFormValues) {
    try {
      // Simulate API call
      console.log(data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('profile Updated', {
        description: 'Your profile has been successfully updated.',
      })
    } catch (error) {
      console.log(error)
      toast.warning('Error', {
        description: 'Failed to update profile.',
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Error', {
          description: 'File size exceeds 5MB limit',
        })
        return
      }

      try {
        // Simulate image upload and update
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setProfileImage(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)

        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast.success('Image uploaded', {
          description: 'Your profile image has been successfully updated.',
        })
      } catch (error) {
        console.log(error)
        toast.error('Error', {
          description: 'Failed to upload image.',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 256x256px. Max size: 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...form.register('username')}
                  placeholder="Your username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="Your email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
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
    </div>
  )
}
