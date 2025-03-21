'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  BadgeDollarSign,
  Bike,
  BookHeart,
  BriefcaseBusiness,
  Calendar,
  ChevronRight,
  ClockIcon,
  Cpu,
  FlaskRound,
  HeartPulse,
  Scale,
} from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const categories = [
  {
    name: 'Technology',
    totalPosts: 10,
    icon: Cpu,
    background: 'bg-indigo-500',
    color: 'text-indigo-500',
  },
  {
    name: 'Business',
    totalPosts: 5,
    icon: BriefcaseBusiness,
    background: 'bg-amber-500',
    color: 'text-amber-500',
  },
  {
    name: 'Finance',
    totalPosts: 8,
    icon: BadgeDollarSign,
    background: 'bg-emerald-500',
    color: 'text-emerald-500',
  },
  {
    name: 'Health',
    totalPosts: 12,
    icon: HeartPulse,
    background: 'bg-rose-500',
    color: 'text-rose-500',
  },
  {
    name: 'Lifestyle',
    totalPosts: 15,
    icon: BookHeart,
    background: 'bg-cyan-500',
    color: 'text-cyan-500',
  },
  {
    name: 'Politics',
    totalPosts: 20,
    icon: Scale,
    background: 'bg-teal-500',
    color: 'text-teal-500',
  },
  {
    name: 'Science',
    totalPosts: 25,
    icon: FlaskRound,
    background: 'bg-purple-500',
    color: 'text-purple-500',
  },
  {
    name: 'Sports',
    totalPosts: 30,
    icon: Bike,
    background: 'bg-cyan-500',
    color: 'text-cyan-500',
  },
]

const blogPosts = [
  {
    title: 'The Future of Artificial Intelligence in Software Development',
    category: 'Technology',
    description:
      'Explore how AI is revolutionizing the way we write code and build applications, from automated testing to intelligent code completion.',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    readTime: '6 min read',
    date: 'Feb 15, 2024',
  },
  {
    title: 'Sustainable Business Practices for the Modern Enterprise',
    category: 'Business',
    description:
      'Learn how companies are incorporating environmental responsibility into their business models while maintaining profitability.',
    image:
      'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&auto=format&fit=crop&q=60',
    readTime: '4 min read',
    date: 'Feb 18, 2024',
  },
  {
    title: 'Cryptocurrency Investment Strategies for 2024',
    category: 'Finance',
    description:
      'A comprehensive guide to navigating the cryptocurrency market, including risk management and portfolio diversification strategies.',
    image:
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=60',
    readTime: '8 min read',
    date: 'Feb 20, 2024',
  },
  {
    title: 'Mindfulness and Mental Health in the Digital Age',
    category: 'Health',
    description:
      'Discover practical techniques for maintaining mental wellness while navigating the challenges of our increasingly connected world.',
    image:
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60',
    readTime: '5 min read',
    date: 'Feb 22, 2024',
  },
  {
    title: 'Modern Home Organization: A Minimalist Approach',
    category: 'Lifestyle',
    description:
      'Transform your living space with these minimalist organization techniques that promote clarity and reduce stress.',
    image:
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=60',
    readTime: '7 min read',
    date: 'Feb 24, 2024',
  },
  {
    title: "Global Climate Policy: What's Next?",
    category: 'Politics',
    description:
      'An analysis of current climate policies and their potential impact on international relations and economic development.',
    image:
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&auto=format&fit=crop&q=60',
    readTime: '9 min read',
    date: 'Feb 25, 2024',
  },
  {
    title: 'Breakthrough Discoveries in Quantum Computing',
    category: 'Science',
    description:
      'Recent advances in quantum computing that could revolutionize data processing and cryptography in the coming decades.',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60',
    readTime: '6 min read',
    date: 'Feb 26, 2024',
  },
  {
    title: 'The Evolution of E-Sports and Competitive Gaming',
    category: 'Sports',
    description:
      'How competitive gaming has transformed from a niche hobby into a billion-dollar industry with professional leagues and global tournaments.',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
    readTime: '5 min read',
    date: 'Feb 27, 2024',
  },
]

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Filter posts by category if one is selected
  const filteredPosts = selectedCategory
    ? blogPosts.filter((post) => post.category === selectedCategory)
    : blogPosts

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

  // Intersection observer to trigger animations when content is in view
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
      ref={sectionRef}
      className="max-w-screen-xl mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-start gap-12"
    >
      <div className="w-full lg:w-2/3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
          {selectedCategory && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-primary flex items-center gap-1"
              onClick={() => setSelectedCategory(null)}
            >
              View all posts
            </motion.button>
          )}
        </motion.div>

        <motion.div
          className="mt-4 space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {filteredPosts.map((blog, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link href={`/blogs/${i + 1}`} className="block">
                <motion.div
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="flex flex-col sm:flex-row sm:items-center shadow-none overflow-hidden rounded-md border-none hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="px-0 sm:p-0">
                      <motion.div
                        className="overflow-hidden rounded-lg"
                        whileHover={{
                          scale: 1.05,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <Image
                          src={blog.image || '/placeholder.svg'}
                          width={600}
                          height={600}
                          alt={blog.title}
                          className="aspect-video sm:w-56 sm:aspect-square object-cover rounded-lg transition-transform duration-300"
                        />
                      </motion.div>
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6 py-0 flex flex-col">
                      <motion.div
                        className="flex items-center gap-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
                          {blog.category}
                        </Badge>
                      </motion.div>

                      <h3 className="mt-4 text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
                        {blog.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground line-clamp-3 text-ellipsis">
                        {blog.description}
                      </p>
                      <div className="mt-4 flex items-center gap-6 text-muted-foreground text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" /> {blog.readTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {blog.date}
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
          ))}
        </motion.div>
      </div>
      <aside className="sticky top-8 shrink-0 lg:max-w-sm w-full lg:w-1/3">
        <motion.h3
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Categories
        </motion.h3>
        <motion.div
          className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={categoryVariants}
              custom={index}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory(category.name)}
              className={cn(
                'flex items-center justify-between gap-2 bg-muted p-3 rounded-md bg-opacity-15 dark:bg-opacity-25 cursor-pointer transition-all duration-300',
                category.background,
                selectedCategory === category.name ? 'ring-2 ring-primary' : ''
              )}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <category.icon className={cn('h-5 w-5', category.color)} />
                </motion.div>
                <span className="font-medium">{category.name}</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Badge className="px-1.5 rounded-full">
                  {category.totalPosts}
                </Badge>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </aside>
    </div>
  )
}

export default Blog
