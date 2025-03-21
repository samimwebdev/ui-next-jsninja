'use client'
import React, { ReactNode, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { CircleX } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useOutsideClick } from '@/hooks/user-outside-click'
import Link from 'next/link'

interface bootcamp {
  title: string
  description: string
  image: string
  date: string
  category: string[]
  content: () => ReactNode
}

const bootcampList: bootcamp[] = [
  {
    title: 'Lorem, ipsum dolor',
    description: 'An introduction to soilless farming techniques.',
    category: ['Snippet', 'JavaScript'],
    image:
      'https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I',
    date: 'Dec-24-2024',
    content: () => (
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        repudiandae architecto inventore? Temporibus iure in corrupti, quia
        obcaecati quaerat illo modi est voluptatum facere explicabo excepturi
        corporis animi, aperiam veniam.
      </p>
    ),
  },
  {
    title: 'React Hooks Deep Dive',
    description: 'Understanding advanced patterns with hooks.',
    category: ['Snippet', 'JavaScript'],
    image:
      'https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I',
    date: 'Dec-24-2024',
    content: () => (
      <p>
        React hooks revolutionized how developers manage state and lifecycle
        events in functional components. Learn how to create custom hooks to
        encapsulate complex logic and improve reusability across your projects.
      </p>
    ),
  },
  {
    title: 'CSS Grid Mastery',
    description: 'Building modern and clean layouts with ease.',
    category: ['JavaScript', '13 weeks'],
    image:
      'https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I',
    date: 'Dec-24',
    content: () => (
      <p>
        CSS Grid is a powerful layout system available in CSS. It allows you to
        design responsive and flexible web layouts with minimal code. Unlock its
        potential with real-world examples and best practices.
      </p>
    ),
  },
]

export const BootcampList = () => {
  const [activePost, setActivePost] = useState<bootcamp | null>(null)
  const ref = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)
  const id = useId()
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActivePost(null)
      }
    }

    if (activePost) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activePost])

  useOutsideClick(ref, () => setActivePost(null))

  return (
    <div className="px-4 py-12 w-full" aria-label="Customer testimonials" ref={sectionRef}>
      <motion.h2 
        className="text-4xl font-bold text-center mb-4 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        Live BootCamp
      </motion.h2>
      <motion.p 
        className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Intensive, hands-on training programs designed to transform beginners into job-ready developers
      </motion.p>
      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 grid place-items-center z-20 p-1">
            <motion.div
              layoutId={`card-${activePost.title}-${id}`}
              ref={ref}
              className="w-full max-w-xl bg-background rounded-lg shadow-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="relative">
                <Image
                  src={activePost.image}
                  alt={activePost.title}
                  width={600}
                  height={300}
                  className="w-full h-60 object-cover"
                />
                <motion.button
                  onClick={() => setActivePost(null)}
                  className="absolute top-4 right-4 p-1 rounded-full"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <CircleX size={24} />
                </motion.button>
              </div>

              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2 text-neutral-800 dark:text-neutral-200">
                  {activePost.title}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {activePost.description}
                </p>
                <div className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                  {activePost.content()}
                </div>
                <div className="flex justify-center mt-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size={'sm'} variant={'outline'}>
                      <Link
                        href="/bootcamps/[slug]"
                        as={`/bootcamps/${activePost.title}`}
                      >
                        Learn More...
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {bootcampList.map((post, index) => (
          <motion.div
            layoutId={`card-${post.title}-${id}`}
            key={post.title}
            onClick={() => setActivePost(post)}
            className="p-2 group flex flex-col rounded-xl cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card key={post.title} className="overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={300}
                  className="object-cover max-w-full transition-all duration-200 group-hover:scale-105"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold mb-2">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {post.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4">
                <div className="flex flex-wrap gap-2">
                  {post.category?.map((category, indx) => (
                    <Badge key={indx} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
