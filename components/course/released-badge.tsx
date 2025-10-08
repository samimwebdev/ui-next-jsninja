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
  console.log('isReleased:', isReleased)
  console.log('releaseDate:', releaseDate)
  if (variant === 'compact') {
    return (
      <Badge
        variant={isReleased ? 'default' : 'secondary'}
        className={cn(
          'text-xs font-medium flex items-center gap-1',
          isReleased
            ? 'bg-ninja-green/10 text-ninja-green border-ninja-green/20 dark:bg-ninja-green/20 dark:text-ninja-green'
            : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
          className
        )}
      >
        {!isReleased && (
          <>
            <Clock className="h-3 w-3" />
            Coming Soon
          </>
        )}
      </Badge>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge
        variant={isReleased ? 'default' : 'secondary'}
        className={cn(
          'text-xs font-medium flex items-center gap-1.5',
          isReleased
            ? 'bg-ninja-green/10 text-ninja-green border-ninja-green/20 dark:bg-ninja-green/20 dark:text-ninja-green'
            : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400'
        )}
      >
        {!isReleased && (
          <>
            <Clock className="h-3.5 w-3.5" />
            Coming Soon
          </>
        )}
      </Badge>

      {releaseDate && (
        <span className="text-xs text-muted-foreground">
          {!isReleased && `Releases on ${formatReleaseDate(releaseDate)}`}
        </span>
      )}
    </div>
  )
}
