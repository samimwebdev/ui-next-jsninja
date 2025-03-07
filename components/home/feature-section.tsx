import {
  Blocks,
  Bot,
  ChartPie,
  Film,
  MessageCircle,
  Settings2,
} from 'lucide-react'
import React from 'react'

const features = [
  {
    icon: Settings2,
    title: 'Customizable Layouts',
    description:
      'Design your space with drag-and-drop simplicity—create grids, lists, or galleries in seconds.',
  },
  {
    icon: Blocks,
    title: 'Interactive Widgets',
    description:
      'Embed polls, quizzes, or forms to keep your audience engaged.',
  },
  {
    icon: Bot,
    title: 'AI-Powered Tools',
    description:
      'Generate summaries, auto-format content, or translate into multiple languages seamlessly.',
  },
  {
    icon: Film,
    title: 'Media Integrations',
    description:
      'Connect with Spotify, Instagram, or your own media library for dynamic visuals and sound.',
  },
  {
    icon: ChartPie,
    title: 'Advanced Analytics',
    description:
      'Track engagement, clicks, and user activity with intuitive charts and reports.',
  },
  {
    icon: MessageCircle,
    title: 'Seamless Collaboration',
    description:
      'Comment, tag, and assign tasks directly within your documents.',
  },
]

export const FeatureSection = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div>
        <h2 className="text-4xl md:text-4xl font-black tracking-tight text-center">
          Feature of Our Courses
        </h2>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto px-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col border rounded-xl py-6 px-5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-accent/50"
            >
              <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                {feature.title}
              </span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
