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
import { Project } from '@/types/shared-types'

interface ProjectCardProps extends Project {
  cleanDescription: string
  features: string[]
  technologies: string[]
  className?: string
}

export function ProjectCard({
  title,
  image,
  cleanDescription,
  features,
  technologies,
  className = '',
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
              <Image
                src={image?.url || '/images/placeholder.svg'}
                alt={title}
                fill
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-muted-foreground dark:text-gray-300 text-sm mb-4">
              {cleanDescription.substring(0, 100)}...
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
            src={image?.url || '/images/placeholder.svg'}
            alt={title}
            width={600}
            height={338}
            className="aspect-video object-cover rounded-lg"
          />
          <p className="text-muted-foreground dark:text-gray-400">
            <div>
              <h4 className="font-semibold mb-2">Project Features:</h4>
              <ul className="list-disc pl-4 space-y-1">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
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
