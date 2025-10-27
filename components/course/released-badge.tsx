// components/ui/released-badge.tsx
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatReleaseDate } from '@/lib/course-utils'

interface ReleasedBadgeProps {
  isReleased: boolean
  releaseDate: Date | null
  className?: string
  variant?: 'default' | 'compact'
}

export function ReleasedBadge({
  isReleased,
  releaseDate,
  className,
  variant = 'default',
}: ReleasedBadgeProps) {
  // Don't show anything if already released
  if (isReleased) return null

  if (variant === 'compact') {
    return (
      <Badge
        variant="secondary"
        className={cn(
          'text-xs font-medium flex items-center gap-1',
          'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
          className
        )}
      >
        <Clock className="h-3 w-3" />
        Coming Soon
      </Badge>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge
        variant="secondary"
        className={cn(
          'text-xs font-medium flex items-center gap-1.5',
          'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400'
        )}
      >
        <Clock className="h-3.5 w-3.5" />
        Coming Soon
      </Badge>

      {releaseDate && (
        <span className="text-xs text-muted-foreground">
          Releases on {formatReleaseDate(releaseDate)}
        </span>
      )}
    </div>
  )
}
