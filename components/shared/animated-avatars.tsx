'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface AnimatedAvatarsProps {
  avatarCount?: number
  totalUsers: number
  message?: string
  avatarSize?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AnimatedAvatars({
  avatarCount = 4,
  totalUsers,
  message,
  avatarSize = 'sm',
  className = '',
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

  const defaultMessage = `Join ${totalUsers.toLocaleString()}+ developers who have elevated their skills`

  return (
    <div
      className={`flex items-center gap-4 animate-in slide-in-from-left duration-700 delay-400 ${className}`}
    >
      <div className="flex -space-x-2">
        {Array.from({ length: avatarCount }, (_, i) => i + 1).map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <Image
              src={`https://i.pravatar.cc/${sizeValues[avatarSize].width}?img=${i}`}
              alt={`User avatar ${i}`}
              className={`${sizeClasses[avatarSize]} rounded-full border-2 border-black`}
              width={sizeValues[avatarSize].width}
              height={sizeValues[avatarSize].height}
            />
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        {message || defaultMessage}
      </motion.p>
    </div>
  )
}
