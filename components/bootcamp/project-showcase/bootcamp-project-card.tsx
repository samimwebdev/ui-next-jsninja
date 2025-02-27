'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ProjectCardProps {
  title: string
  description: string
  image: string
  technologies: string[]
  fullDescription?: string
  className?: string
}

export function ProjectCard({
  title,
  description,
  image,
  technologies,
  fullDescription,
  className,
}: ProjectCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={cn(
            'group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
            'bg-gradient-to-br from-card/50 to-card dark:from-gray-900 dark:to-gray-800',
            'border border-border/50 dark:border-gray-800',
            className
          )}
        >
          <CardContent className="p-6">
            <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
              <img
                src={image || '/placeholder.svg'}
                alt={title}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-muted-foreground dark:text-gray-300 text-sm mb-4">
              {description}
            </p>
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-0">
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Image
            src={image || '/placeholder.svg'}
            alt={title}
            className="aspect-video object-cover rounded-lg"
          />
          <p className="text-muted-foreground dark:text-gray-400">
            {fullDescription || description}
          </p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
