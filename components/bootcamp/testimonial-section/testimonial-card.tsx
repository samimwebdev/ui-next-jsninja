import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from './star-rating'
import type { Testimonial } from './testimonial-types'
import { CheckCircle } from 'lucide-react'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="w-[300px] h-[200px] flex-shrink-0 bg-card dark:bg-card transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <img
              src={testimonial.avatar || '/placeholder.svg?height=40&width=40'}
              alt=""
              className="h-8 w-8 rounded-full"
            />
            <div>
              <div className="flex items-center gap-1">
                <p className="font-semibold text-sm text-foreground">
                  {testimonial.name}
                </p>
                {testimonial.verified && (
                  <CheckCircle className="h-3 w-3 fill-primary text-primary-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {testimonial.handle}
              </p>
            </div>
          </div>
        </div>
        <StarRating rating={testimonial.rating} className="mb-2" />
        <p className="text-sm text-muted-foreground line-clamp-4 flex-grow">
          {testimonial.text}
        </p>
      </CardContent>
    </Card>
  )
}
