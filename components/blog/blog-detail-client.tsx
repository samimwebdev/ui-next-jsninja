'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Tag,
  Clock,
  User,
  Share2,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { BlogPost } from '@/types/blog-types'
import { formatDate } from '@/lib/bootcamp-utils'
import { toast } from 'sonner'
import { calculateReadingTime } from '@/lib/utils'

interface BlogDetailClientProps {
  blog: BlogPost
}

export const BlogDetailClient: React.FC<BlogDetailClientProps> = ({ blog }) => {
  const [isSaved, setIsSaved] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  const authorName = blog.author
    ? `${blog.author.firstName} ${blog.author.lastName}`
    : 'Javascript Ninja'

  const authorImage =
    blog.author?.image?.formats?.medium?.url || blog.author?.image?.url
  const publishedDate = formatDate(blog.publishedDate)

  // Create a fallback hero image from author image or default
  const heroImage =
    authorImage ||
    'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png'

  // Get current URL on client side
  useEffect(() => {
    setCurrentUrl(window.location.href)

    // Check if blog is saved in localStorage
    const savedBlogs = JSON.parse(localStorage.getItem('savedBlogs') || '[]')
    setIsSaved(savedBlogs.includes(blog.slug))
  }, [blog.slug])

  // Share functions
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnTwitter = () => {
    const text = `Check out this article: ${blog.title}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(currentUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.log(error)
      toast.warning('Failed to copy link')
    }
  }

  // Save/Bookmark functions
  const toggleSave = () => {
    const savedBlogs = JSON.parse(localStorage.getItem('savedBlogs') || '[]')
    let updatedSavedBlogs

    if (isSaved) {
      // Remove from saved
      updatedSavedBlogs = savedBlogs.filter(
        (slug: string) => slug !== blog.slug
      )
      toast.warning('Article removed from your saved list.')
    } else {
      // Add to saved
      updatedSavedBlogs = [...savedBlogs, blog.slug]
      toast.success('Article saved!')
    }

    localStorage.setItem('savedBlogs', JSON.stringify(updatedSavedBlogs))
    setIsSaved(!isSaved)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <motion.div
        className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 py-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/blogs"
                className="text-muted-foreground hover:text-foreground"
              >
                Blogs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-foreground font-medium">
                {blog.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 py-12 relative">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Categories */}
            <motion.div
              className="flex justify-center gap-2 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {blog.categories?.slice(0, 2).map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20 text-sm px-3 py-1"
                >
                  {category.name}
                </Badge>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {blog.title}
            </motion.h1>

            {/* Meta Information */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{publishedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {calculateReadingTime(blog.details) || blog.timeToRead} min
                  read
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">By {authorName}</span>
              </div>
            </motion.div>

            {/* Author Info */}
            <motion.div
              className="flex justify-center items-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Avatar className="w-12 h-12 border-2 border-primary/20">
                <AvatarImage src={authorImage} alt={authorName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {authorName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-semibold text-foreground">{authorName}</p>
                {blog.author?.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {blog.author.bio}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex justify-center gap-3 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Share Button with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuItem
                    onClick={shareOnFacebook}
                    className="gap-2 cursor-pointer"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={shareOnTwitter}
                    className="gap-2 cursor-pointer"
                  >
                    <Twitter className="w-4 h-4 text-sky-500" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={shareOnLinkedIn}
                    className="gap-2 cursor-pointer"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={copyToClipboard}
                    className="gap-2 cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? 'Copied!' : 'Copy link'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsShareDialogOpen(true)}
                    className="gap-2 cursor-pointer"
                  >
                    <LinkIcon className="w-4 h-4" />
                    More options
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Save/Bookmark Button */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={toggleSave}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-primary" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this article</DialogTitle>
            <DialogDescription>
              Share this article with your friends and colleagues
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Social Media Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="gap-2 h-16 flex-col"
                onClick={shareOnFacebook}
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-16 flex-col"
                onClick={shareOnTwitter}
              >
                <Twitter className="w-5 h-5 text-sky-500" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-16 flex-col"
                onClick={shareOnLinkedIn}
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
                <span className="text-xs">LinkedIn</span>
              </Button>
            </div>

            {/* Copy Link */}
            <div className="flex gap-2">
              <Input
                value={currentUrl}
                readOnly
                className="flex-1"
                placeholder="Article URL"
              />
              <Button onClick={copyToClipboard} size="sm" className="shrink-0">
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Featured Image */}
      <motion.div
        className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <Image
            src={heroImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.article
        className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-12 xl:p-16">
              {/* Content */}
              <motion.div
                className="prose prose-lg lg:prose-xl max-w-none 
                prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-3xl prose-h1:lg:text-4xl prose-h1:mb-6
                prose-h2:text-2xl prose-h2:lg:text-3xl prose-h2:mb-5 prose-h2:mt-8
                prose-h3:text-xl prose-h3:lg:text-2xl prose-h3:mb-4 prose-h3:mt-6
                prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:text-base prose-p:lg:text-lg prose-p:mb-6
                prose-strong:text-foreground prose-strong:font-semibold
                prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 
                prose-blockquote:text-foreground/90 prose-blockquote:font-medium prose-blockquote:not-italic
                prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:my-8
                prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded 
                prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2 prose-li:text-foreground/90
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                dangerouslySetInnerHTML={{ __html: blog.details }}
              />

              {/* Tags Section */}
              <motion.div
                className="pt-12 mt-12 border-t border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Tag className="w-6 h-6 text-primary" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {blog.tags?.split(',').map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="outline"
                      className="px-4 py-2 text-sm font-medium hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer"
                    >
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Categories Section */}
              {blog.categories && blog.categories.length > 0 && (
                <motion.div
                  className="pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {blog.categories.map((category) => (
                      <Badge
                        key={category.id}
                        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 text-sm font-medium cursor-pointer transition-colors"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Author Card */}
              {blog.author && (
                <motion.div
                  className="pt-12 mt-12 border-t border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex items-start gap-6 p-8 bg-muted/30 rounded-xl border border-border/50">
                    <Avatar className="w-20 h-20 border-2 border-primary/20">
                      <AvatarImage src={authorImage} alt={authorName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                        {authorName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        About {authorName}
                      </h3>
                      {blog.author.bio && (
                        <p className="text-muted-foreground leading-relaxed text-base lg:text-lg mb-3">
                          {blog.author.bio}
                        </p>
                      )}
                      {blog.author.email && (
                        <p className="text-sm text-primary font-medium">
                          {blog.author.email}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
