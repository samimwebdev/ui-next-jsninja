'use client'

import { useEffect, useRef } from 'react'
import DOMPurify from 'isomorphic-dompurify'

interface HtmlContentRendererProps {
  content: string
  className?: string
}

export function HtmlContentRenderer({
  content,
  className = '',
}: HtmlContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && content) {
      // Sanitize the HTML content
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          'div',
          'p',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'strong',
          'em',
          'b',
          'i',
          'u',
          'br',
          'ul',
          'ol',
          'li',
          'a',
          'img',
          'blockquote',
          'code',
          'pre',
          'span',
        ],
        ALLOWED_ATTR: [
          'href',
          'src',
          'alt',
          'title',
          'width',
          'height',
          'target',
          'rel',
          'class',
          'id',
        ],
      })

      contentRef.current.innerHTML = sanitizedContent

      // Apply modern styling to rendered elements
      const elements = contentRef.current.querySelectorAll('*')
      elements.forEach((element) => {
        const tagName = element.tagName.toLowerCase()

        // Remove inline styles that conflict with dark mode
        element.removeAttribute('style')

        switch (tagName) {
          case 'h1':
            element.className =
              'text-4xl font-bold tracking-tight mb-6 text-foreground'
            break
          case 'h2':
            element.className =
              'text-3xl font-semibold tracking-tight mb-4 mt-8 text-foreground'
            break
          case 'h3':
            element.className = 'text-2xl font-medium mb-3 mt-6 text-foreground'
            break
          case 'h4':
            element.className = 'text-xl font-medium mb-2 mt-4 text-foreground'
            break
          case 'h5':
            element.className = 'text-lg font-medium mb-2 mt-3 text-foreground'
            break
          case 'h6':
            element.className =
              'text-base font-medium mb-2 mt-3 text-foreground'
            break
          case 'p':
            element.className = 'text-base leading-7 mb-4 text-muted-foreground'
            break
          case 'strong':
          case 'b':
            element.className = 'font-semibold text-foreground'
            break
          case 'em':
          case 'i':
            element.className = 'italic'
            break
          case 'ul':
            element.className =
              'list-disc list-inside mb-4 space-y-2 text-muted-foreground'
            break
          case 'ol':
            element.className =
              'list-decimal list-inside mb-4 space-y-2 text-muted-foreground'
            break
          case 'li':
            element.className = 'text-base leading-7'
            break
          case 'a':
            element.className =
              'text-primary hover:text-primary/80 underline transition-colors'
            break
          case 'img':
            element.className = 'max-w-full h-auto rounded-lg my-4'
            break
          case 'blockquote':
            element.className =
              'border-l-4 border-primary pl-4 italic my-4 text-muted-foreground'
            break
          case 'code':
            element.className =
              'bg-muted px-1.5 py-0.5 rounded text-sm font-mono'
            break
          case 'pre':
            element.className = 'bg-muted p-4 rounded-lg overflow-x-auto my-4'
            break
          case 'div':
            // Remove problematic float styles and apply modern layout
            element.className = 'mb-4'
            break
        }
      })
    }
  }, [content])

  return (
    <div
      ref={contentRef}
      className={`prose prose-slate dark:prose-invert max-w-none ${className}`}
    />
  )
}
