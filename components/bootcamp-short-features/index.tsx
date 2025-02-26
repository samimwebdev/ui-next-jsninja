import { FileText, Folder, Video } from 'lucide-react'
import React from 'react'

const features = [
  {
    icon: Video,
    title: '400+ Videos',
    description:
      'Design your space with drag-and-drop simplicity—create grids, .',
  },
  {
    icon: Folder,
    title: '12+ Projects',
    description:
      'Embed polls, quizzes, or forms to keep your audience engaged.',
  },
  {
    icon: FileText,
    title: '12+ Assignment',
    description:
      'Embed polls, quizzes, or forms to keep your audience engaged.',
  },
]

const BootcampShortFeature = () => {
  return (
    <div className="flex items-center justify-center py-4 gap-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="flex flex-col border rounded-xl py-6 px-5"
        >
          <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
            <feature.icon className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">{feature.title}</span>
          <p className="mt-1 text-foreground/80 text-[15px]">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default BootcampShortFeature
