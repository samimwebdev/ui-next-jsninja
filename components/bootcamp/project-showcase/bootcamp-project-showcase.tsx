'use client'

import { useEffect, useState } from 'react'
import { ProjectCard } from './bootcamp-project-card'
import Masonry from 'react-masonry-css'

const projects = [
  {
    title: 'TIC-TAC-TOE',
    description:
      'Master the classic game of Tic-Tac-Toe with this step-by-step tutorial. Learn about game state management and AI algorithms for creating unbeatable computer opponents.',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EKCpTqWzjpcoT7RcBQuRqCZtMIIAAA.png',
    technologies: ['React', 'NextJS', 'TypeScript'],
  },
  {
    title: 'TASKER',
    description:
      'A comprehensive task management solution with real-time updates and team collaboration features.',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EKCpTqWzjpcoT7RcBQuRqCZtMIIAAA.png',
    technologies: ['React', 'Redux', 'TailwindCSS'],
  },
  {
    title: 'CINERENTAL',
    description:
      'Movie rental and streaming platform with recommendation engine. Discover new films based on your viewing history and preferences.',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EKCpTqWzjpcoT7RcBQuRqCZtMIIAAA.png',
    technologies: ['NextJS', 'Prisma', 'PostgreSQL'],
  },
  {
    title: 'WEATHER DASHBOARD',
    description:
      'Real-time weather monitoring and forecasting with interactive maps and detailed analytics. Get accurate predictions and historical data visualization.',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EKCpTqWzjpcoT7RcBQuRqCZtMIIAAA.png',
    technologies: ['React', 'OpenWeather API', 'D3.js'],
  },
  {
    title: 'FACEHOOK',
    description:
      'Social media platform with real-time features, chat, and content sharing capabilities. Connect with friends, share moments, and engage in group discussions.',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EKCpTqWzjpcoT7RcBQuRqCZtMIIAAA.png',
    technologies: ['NextJS', 'Socket.io', 'MongoDB'],
  },
  {
    title: 'QUIZ APPLICATION',
    description:
      'A Dynamic Platform for Engaging and Interactive Quizzes with Multiple Participants. Features real-time scoring, leaderboards, and customizable question types to enhance learning and assessment.',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EKCpTqWzjpcoT7RcBQuRqCZtMIIAAA.png',
    technologies: ['React', 'TypeScript', 'Firebase'],
  },
  {
    title: 'EDUCONNECT',
    description:
      'A collaborative platform for dynamic and interactive learning with video conferencing and resource sharing. Facilitate remote education with virtual classrooms, breakout rooms, and integrated assignment submissions.',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EKCpTqWzjpcoT7RcBQuRqCZtMIIAAA.png',
    technologies: ['NextJS', 'WebRTC', 'Firebase'],
  },
]

const breakpointColumns = {
  default: 3,
  1536: 3,
  1280: 3,
  1024: 2,
  768: 2,
  640: 1,
}

export function BootcampProjectShowcase() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <section className="container mx-auto max-w-screen-xl px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-4xl font-black tracking-tight text-center mb-6">
          Projects for the Bootcamp
        </h2>
        <p className="text-muted-foreground text-lg">
          Detail information about the Projects
        </p>
      </div>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-6 w-auto"
        columnClassName="pl-6 bg-clip-padding"
      >
        {projects.map((project) => (
          <div key={project.title} className="mb-6">
            <ProjectCard {...project} />
          </div>
        ))}
      </Masonry>
    </section>
  )
}
