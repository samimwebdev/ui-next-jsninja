'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { AlertCircle, Home, BookOpen } from 'lucide-react'

interface CourseAccessDeniedProps {
  message: string
}

export function CourseAccessDenied({ message }: CourseAccessDeniedProps) {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gray-50 dark:bg-gradient-auth-dark">
      {/* Animated background gradient - Light mode only */}
      <div className="absolute inset-0 bg-gradient-auth-light dark:bg-transparent" />

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-amber-400/20 dark:bg-ninja-gold/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-400/20 dark:bg-ninja-orange/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/10 dark:bg-ninja-blue/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content container with glass effect */}
      <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 max-w-2xl w-full border border-amber-200 dark:border-ninja-gold/20 shadow-2xl animate-fade-in-scale">
        <div className="text-center space-y-8">
          {/* Icon with glow effect */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/30 dark:bg-ninja-gold/20 rounded-full blur-xl animate-pulse-glow" />
              <div className="relative rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-ninja-gold dark:to-ninja-orange p-6 shadow-lg dark:shadow-glow-ninja-gold">
                <AlertCircle className="h-16 w-16 text-white dark:text-ninja-dark-navy" />
              </div>
            </div>
          </div>

          {/* Title with gradient */}
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-ninja-gold dark:to-ninja-orange bg-clip-text text-transparent">
              Access Denied
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-amber-500 to-orange-500 dark:from-ninja-gold dark:to-ninja-orange rounded-full" />
          </div>

          {/* Message */}
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
            {message}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 dark:from-ninja-gold dark:to-ninja-orange dark:hover:from-amber-400 dark:hover:to-orange-400 text-white dark:text-ninja-dark-navy font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              onClick={() => router.push('/dashboard')}
            >
              <span className="flex items-center gap-2">
                <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
                Go to Dashboard
              </span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-amber-400 dark:border-ninja-gold/40 hover:border-amber-500 dark:hover:border-ninja-gold/60 hover:bg-amber-50 dark:hover:bg-ninja-gold/10 text-amber-700 dark:text-ninja-gold transition-all duration-300 hover:scale-105 group"
              onClick={() => router.push('/courses')}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 transition-transform group-hover:scale-110" />
                Browse Courses
              </span>
            </Button>
          </div>

          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-2 pt-8 opacity-50">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400 dark:via-ninja-gold/30 to-transparent" />
            <div className="h-2 w-2 rounded-full bg-amber-500 dark:bg-ninja-gold/40 animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-amber-400 dark:via-ninja-gold/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* Additional decorative grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)] pointer-events-none" />
    </div>
  )
}
