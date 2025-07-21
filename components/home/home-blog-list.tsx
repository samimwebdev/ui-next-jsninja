'use client'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { BlogSectionData } from '@/types/homePage'
import { calculateReadingTime, formatDuration, getExcerpt } from '@/lib/utils'

const HomeBlogList: React.FC<{ data: BlogSectionData }> = ({
  data: blogSectionData,
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

  return (
    <div
      className="max-w-screen-xl mx-auto py-16 px-6 xl:px-0"
      ref={sectionRef}
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight">
          {blogSectionData.title}
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          {blogSectionData.description}
        </p>
      </motion.div>

      <motion.div
        className="flex justify-end mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button variant="outline" className="shadow-none group" asChild>
          <Link href="/blogs">
            View all posts{' '}
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogSectionData.blogs.map((blog, i) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="shadow-none overflow-hidden rounded-md group h-full">
              <CardHeader className="p-0">
                <Image
                  src={blog.thumbnail.url || '/images/placeholder.png'}
                  alt={`Blog thumbnail for ${blog.title}`}
                  width={500}
                  height={250}
                  className="group-hover:scale-105 group-focus:scale-105 transition-transform duration-300 ease-in-out rounded-xl w-full object-cover"
                />
              </CardHeader>
              <CardContent className="py-6">
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
                    {`${blog.categories[0]?.name || 'General'}`}
                  </Badge>
                  <span className="font-medium text-xs text-muted-foreground">
                    {calculateReadingTime(blog.details) ||
                      formatDuration(blog.timeToRead)}{' '}
                    min read
                  </span>
                </motion.div>

                <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight">
                  {blog.title}
                </h3>
                <p className="mt-2 text-muted-foreground line-clamp-3">
                  {getExcerpt(blog.details, 18)}
                </p>

                <Button className="mt-6 shadow-none group" asChild>
                  <Link href={`/blogs/${blog.slug}`}>
                    Read more{' '}
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default HomeBlogList
