'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Calendar, Tag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BlogPost } from '@/types/blog-types'

interface RelatedBlogsSectionProps {
  blogs: BlogPost[]
}

export const RelatedBlogsSection: React.FC<RelatedBlogsSectionProps> = ({
  blogs,
}) => {
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

  if (!blogs || blogs.length === 0) {
    return null
  }

  return (
    <motion.div
      ref={sectionRef}
      className="py-16"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <motion.h2
        className="text-3xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Related Blogs
      </motion.h2>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((item: BlogPost, index: number) => {
          const authorImage =
            item.author?.image?.formats?.medium?.url ||
            item.author?.image?.url ||
            'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png'

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/blogs/${item.slug}`}>
                <article className="group overflow-hidden rounded-2xl transition-all duration-300 transform hover:shadow-xl bg-card border border-border h-full">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={authorImage}
                      fill
                      className="object-cover transition duration-300 group-hover:opacity-75 group-hover:scale-110"
                      alt={item.title}
                    />
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-yellow-500" />
                      <time className="text-gray-300">
                        {new Date(item.publishedDate).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </time>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-yellow-500 transition duration-300">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                      {item.details
                        ? item.details
                            .replace(/<[^>]*>/g, '')
                            .substring(0, 120) + '...'
                        : 'No description available'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags
                        ?.split(',')
                        .slice(0, 3)
                        .map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1 bg-primary/10 text-primary"
                          >
                            <Tag className="w-3 h-3" />
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center text-yellow-500 font-medium">
                      <span className="text-sm group-hover:underline">
                        Read more
                      </span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition duration-300" />
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
