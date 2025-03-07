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
    <div className="flex flex-col md:flex-row items-center justify-center py-6 gap-4 w-full">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="flex flex-col border rounded-xl py-6 px-5 w-full md:w-auto flex-1 hover:shadow-lg transition-all duration-300 hover:border-primary/20 hover:-translate-y-1 bg-card/50"
        >
          <div className="mb-4 h-12 w-12 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30 rounded-full shadow-sm">
            <feature.icon className="h-6 w-6 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">{feature.title}</span>
          <p className="mt-2 text-foreground/70 text-[15px] leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default BootcampShortFeature
