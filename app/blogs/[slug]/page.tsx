'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Calendar, Tag, ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type Blog = {
  slug: string
  Title: string
  Intro: string
  Image: string
  created_at: string
  Tags: string
  Description: string
}
// Static data for the blogs
const data: Blog[] = [
  {
    slug: 'best-places-to-eat-in-hongkong',
    Title: 'Best places to eat in Hong Kong',
    Intro:
      'Discover the top spots for dining in the vibrant city of Hong Kong.',
    Image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png',
    created_at: '2023-09-20',
    Tags: 'Travel, Food, Asia',
    Description:
      '<p>Detailed description about food places in Hong Kong...</p>',
  },
  {
    slug: 'exploring-new-york',
    Title: 'Exploring New York City',
    Intro: 'A guide to the must-see attractions in the Big Apple.',
    Image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png',
    created_at: '2023-08-15',
    Tags: 'Travel, City, USA',
    Description: '<p>Detailed description about exploring New York City...</p>',
  },
  {
    slug: 'hiking-in-the-alps',
    Title: 'Hiking in the Alps',
    Intro:
      'Everything you need to know about trekking through the stunning Alps.',
    Image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png',
    created_at: '2023-07-05',
    Tags: 'Adventure, Hiking, Nature',
    Description: '<p>Detailed description about hiking in the Alps...</p>',
  },
]

const Page = () => {
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

  const Cards = () => {
    return (
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item: Blog, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link href={`/blogs/${item.slug}`}>
              <article className="group overflow-hidden rounded-2xl transition-all duration-300 transform hover:shadow-xl bg-card border border-border h-full">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item?.Image}
                    layout="fill"
                    objectFit="cover"
                    alt={item.Title}
                    className="rounded-t-2xl object-cover transition duration-300 group-hover:opacity-75 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-yellow-500" />
                    <time className="text-gray-300">
                      {new Date(item?.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-yellow-500 transition duration-300">
                    {item?.Title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                    {item?.Intro}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item?.Tags?.split(',').map(
                      (tag: string, tagIndex: number) => (
                        <span
                          key={tagIndex}
                          className="whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1 bg-primary/10 text-primary"
                        >
                          <Tag className="w-3 h-3" />
                          {tag.trim()}
                        </span>
                      )
                    )}
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
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 xl:px-0" ref={sectionRef}>
      {/* Breadcrumb */}
      <motion.div
        className="py-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blogs">Blogs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{data[0].Title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Hero Image with Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl overflow-hidden"
      >
        <div
          className="bg-cover bg-center text-center overflow-hidden relative"
          style={{
            minHeight: '500px',
            backgroundImage: `url('${data[0].Image}')`,
          }}
          title={data[0].Title}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mt-3 bg-card shadow-lg rounded-xl flex flex-col justify-between leading-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-card-client relative top-0 -mt-32 p-5 sm:p-10 rounded-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-white font-bold text-3xl md:text-4xl mb-4 drop-shadow-md">
                {data[0].Title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 px-6 sm:px-8 py-5 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg">
                <div className="flex items-center text-white text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
                  {new Date(data[0].created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                <div className="flex items-center text-white text-sm font-medium">
                  <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>5 min read</span>
                </div>

                <div className="flex items-center text-white text-sm font-medium">
                  <span>Written By:</span>
                  <a
                    href="javascript:void(0)"
                    className="text-yellow-500 font-bold ml-1 hover:underline transition duration-300"
                  >
                    Frontend Ninja
                  </a>
                </div>
              </div>
              <motion.p
                className="text-base leading-8 my-6 text-foreground/90 px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {data[0].Intro}
              </motion.p>

              <motion.div
                className="text-foreground px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-2xl font-bold my-5">
                  #1. What is Lorem Ipsum?
                </h3>

                <p className="text-base leading-8 my-5">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>

                <blockquote className="border-l-4 border-yellow-500 text-base italic leading-8 my-6 p-6 bg-primary/5 rounded-r-md shadow-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s
                </blockquote>

                <p className="text-base leading-8 my-5">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-2 mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {data[0].Tags.split(',').map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3" />
                    {tag.trim()}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Recommended Blogs */}
      <motion.div
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
          Recommended Blogs
        </motion.h2>
        <Cards />
      </motion.div>
    </div>
  )
}

export default Page
