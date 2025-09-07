'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { calculateReadingTime, cn } from '@/lib/utils'
import { Calendar, ChevronRight, ClockIcon } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BlogPost } from '@/types/blog-types'
import { formatDate } from '@/lib/bootcamp-utils'

interface BlogsListClientProps {
  initialBlogs: BlogPost[]
  categories: Array<{ name: string; totalPosts: number; slug: string }>
}

export const BlogsListClient: React.FC<BlogsListClientProps> = ({
  initialBlogs,
  categories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(initialBlogs)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Filter blogs by category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = initialBlogs.filter((blog) =>
        blog.categories?.some((cat) => cat.name === selectedCategory)
      )
      setFilteredBlogs(filtered)
    } else {
      setFilteredBlogs(initialBlogs)
    }
  }, [selectedCategory, initialBlogs])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const categoryVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  }

  // Intersection observer for animations
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

  // Get fallback image for blogs
  const getImageUrl = (blog: BlogPost) => {
    return (
      blog.author?.image?.formats?.medium?.url ||
      blog.author?.image?.url ||
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png'
    )
  }

  const getCategoryColors = (index: number) => {
    const colors = [
      { background: 'bg-indigo-500', color: 'text-indigo-500' },
      { background: 'bg-amber-500', color: 'text-amber-500' },
      { background: 'bg-emerald-500', color: 'text-emerald-500' },
      { background: 'bg-rose-500', color: 'text-rose-500' },
      { background: 'bg-cyan-500', color: 'text-cyan-500' },
      { background: 'bg-teal-500', color: 'text-teal-500' },
      { background: 'bg-purple-500', color: 'text-purple-500' },
      { background: 'bg-pink-500', color: 'text-pink-500' },
    ]
    return colors[index % colors.length]
  }

  return (
    <div
      ref={sectionRef}
      className="max-w-screen-xl mx-auto py-10 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-4 flex flex-col lg:flex-row items-start gap-12"
    >
      <div className="w-full lg:w-2/3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight">
            {selectedCategory ? `${selectedCategory} Posts` : 'All Posts'}
          </h2>
          {selectedCategory && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-primary flex items-center gap-1 hover:underline"
              onClick={() => setSelectedCategory(null)}
            >
              View all posts
            </motion.button>
          )}
        </motion.div>

        <motion.div
          className="mt-4 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <motion.div key={blog.id} variants={itemVariants}>
                <Link href={`/blogs/${blog.slug}`} className="block group">
                  <motion.div
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="flex flex-col sm:flex-row sm:items-center shadow-sm border border-border/50 overflow-hidden rounded-lg hover:shadow-md hover:border-border transition-all duration-300 p-4 sm:p-6">
                      <CardHeader className="px-0 pb-4 sm:pb-0 sm:pr-6 sm:p-0 lg:mr-4">
                        <div className="overflow-hidden rounded-lg">
                          <Image
                            src={getImageUrl(blog)}
                            width={600}
                            height={600}
                            alt={blog.title}
                            className="aspect-video sm:w-56 sm:aspect-square object-cover rounded-lg transition-transform duration-300"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="px-0 py-0 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          {blog.categories?.slice(0, 2).map((category) => (
                            <Badge
                              key={category.id}
                              className="bg-primary/10 text-primary hover:bg-primary/15 shadow-none text-xs"
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>

                        <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="mt-3 text-muted-foreground line-clamp-3 text-sm sm:text-base leading-relaxed">
                          {blog.details
                            ? blog.details
                                .replace(/<[^>]*>/g, '')
                                .substring(0, 150) + '...'
                            : 'No description available'}
                        </p>
                        <div className="mt-4 flex items-center gap-4 sm:gap-6 text-muted-foreground text-xs sm:text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-4 w-4" />
                            {calculateReadingTime(blog.details) ||
                              blog.timeToRead}{' '}
                            min read
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </div>
                        </div>
                        <motion.div
                          className="mt-4 text-primary flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          Read more <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl text-muted-foreground">
                No posts found in this category.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <aside className="sticky top-8 shrink-0 lg:max-w-sm w-full lg:w-1/3">
        <motion.h3
          className="text-3xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Categories
        </motion.h3>
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {categories.map((category, index) => {
            const colors = getCategoryColors(index)
            return (
              <motion.div
                key={category.name}
                variants={categoryVariants}
                custom={index}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  'flex items-center justify-between gap-2 bg-muted/30 p-4 rounded-lg bg-opacity-15 dark:bg-opacity-25 cursor-pointer transition-all duration-300 hover:bg-muted/50',
                  colors.background,
                  selectedCategory === category.name
                    ? 'ring-2 ring-primary shadow-sm'
                    : ''
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge className="px-2 py-1 rounded-full text-xs">
                    {category.totalPosts}
                  </Badge>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </aside>
    </div>
  )
}
