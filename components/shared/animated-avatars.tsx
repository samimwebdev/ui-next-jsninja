'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { EnrolledUser } from '@/types/enrolled-users'
import { getUserAvatarUrl } from '@/lib/actions/enrolled-users'

interface AnimatedAvatarsProps {
  users: EnrolledUser[] // Replace avatarCount with actual users
  totalUsers: number | string
  message?: string
  avatarSize?: 'sm' | 'md' | 'lg'
  className?: string
  maxAvatars?: number // Maximum avatars to display
}

export function AnimatedAvatars({
  users,
  totalUsers,
  message,
  avatarSize = 'sm',
  className = '',
  maxAvatars = 4,
}: AnimatedAvatarsProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const sizeValues = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  }

  const messageContent = `Join ${totalUsers.toLocaleString()} ${
    totalUsers === 1 ? '+ user' : '+ users'
  } ${message ? message : 'who Elevate their skills with us'}`

  // Get unique users (in case of duplicates) and limit to maxAvatars
  const uniqueUsers = users
    .filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.userId === user.userId)
    )
    .slice(0, maxAvatars)

  // If no users, don't render anything
  if (uniqueUsers.length === 0) {
    return null
  }

  return (
    <div
      className={`flex items-center gap-4 animate-in slide-in-from-left duration-700 delay-400 ${className}`}
    >
      <div className="flex -space-x-2">
        {uniqueUsers.map((user, index) => {
          const avatarUrl = getUserAvatarUrl(user.userProfileImage)
          const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.userName
          )}&size=${sizeValues[avatarSize].width}&background=random`

          return (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="relative"
            >
              <Image
                src={avatarUrl || fallbackUrl}
                alt={user.userName || `User ${index + 1}`}
                className={`${sizeClasses[avatarSize]} rounded-full border-2 border-background ring-2 ring-primary/20 object-cover`}
                width={sizeValues[avatarSize].width}
                height={sizeValues[avatarSize].height}
                onError={(e) => {
                  // Fallback to UI Avatars on error
                  const target = e.target as HTMLImageElement
                  target.src = fallbackUrl
                }}
              />
            </motion.div>
          )
        })}
      </div>
      <motion.p
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        {messageContent}
      </motion.p>
    </div>
  )
}
