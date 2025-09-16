import { CourseBase } from './../../../types/shared-types'
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

interface StrapiWebhookBody {
  event:
    | 'entry.create'
    | 'entry.update'
    | 'entry.delete'
    | 'entry.publish'
    | 'entry.unpublish'
  createdAt: string
  model: string
  uid: string
  entry: {
    id: number
    documentId: string
    slug?: string
    title?: string
    isRegistrationEnabled?: boolean
    featured?: boolean
    publishedAt?: string
    [key: string]: unknown
    baseContent?: CourseBase
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: StrapiWebhookBody = await request.json()

    // console.log('📬 Webhook payload received:', {
    //   event: body.event,
    //   model: body.model,
    //   entry: {
    //     id: body.entry?.id,
    //     documentId: body.entry?.documentId,
    //     slug: body.entry?.slug || body.entry?.baseContent?.slug,
    //     title: body.entry?.title || body.entry?.baseContent?.title,
    //   },
    // })

    // ✅ Verify webhook secret for security
    const secret = request.headers.get('x-strapi-signature')
    if (secret !== process.env.STRAPI_WEBHOOK_SECRET) {
      console.warn('❌ Unauthorized webhook attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const revalidatedPaths: string[] = []
    const revalidatedTags: string[] = []

    switch (body.model) {
      case 'course':
        await handleCourseRevalidation(body, revalidatedPaths, revalidatedTags)
        break

      case 'bootcamp':
        await handleBootcampRevalidation(
          body,
          revalidatedPaths,
          revalidatedTags
        )
        break

      case 'course-base':
        // ✅ FIXED: Use dedicated course-base handler to avoid duplicates
        await handleCourseBaseRevalidation(
          body,
          revalidatedPaths,
          revalidatedTags
        )
        break

      case 'blog':
        await handleBlogRevalidation(body, revalidatedPaths, revalidatedTags)
        break

      case 'home':
        await handleHomeRevalidation(body, revalidatedPaths, revalidatedTags)
        break

      case 'course-bundle':
        await handleCourseBundleRevalidation(
          body,
          revalidatedPaths,
          revalidatedTags
        )
        break

      case 'category':
        await handleCategoryRevalidation(
          body,
          revalidatedPaths,
          revalidatedTags
        )
        break

      default:
        console.log(`⚠️ Unhandled model: ${body.model}`)
    }

    // ✅ Always revalidate homepage for any content change (with duplicate check)
    if (!revalidatedPaths.includes('/')) {
      revalidatePath('/', 'page')
      revalidatedPaths.push('/')
    }

    // ✅ Add a small delay to ensure all revalidations complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // console.log('✅ Revalidation completed:', {
    //   paths: revalidatedPaths,
    //   tags: revalidatedTags,
    //   timestamp: new Date().toISOString(),
    // })

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      tags: revalidatedTags,
      timestamp: new Date().toISOString(),
      message: 'Cache cleared successfully',
    })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error', revalidated: false },
      { status: 500 }
    )
  }
}

// ✅ NEW: Dedicated Course Base Handler (prevents duplicates)
async function handleCourseBaseRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry } = body
  const slug = entry?.baseContent?.slug || entry?.slug

  // ✅ Since course-base is shared, revalidate BOTH course and bootcamp paths
  if (slug) {
    // Add paths only if not already present
    if (!revalidatedPaths.includes(`/courses/${slug}`)) {
      revalidatePath(`/courses/${slug}`, 'page')
      revalidatedPaths.push(`/courses/${slug}`)
    }

    if (!revalidatedPaths.includes(`/bootcamps/${slug}`)) {
      revalidatePath(`/bootcamps/${slug}`, 'page')
      revalidatedPaths.push(`/bootcamps/${slug}`)
    }

    // Add tags only if not already present
    if (!revalidatedTags.includes(`course-${slug}`)) {
      revalidateTag(`course-${slug}`)
      revalidatedTags.push(`course-${slug}`)
    }

    if (!revalidatedTags.includes(`bootcamp-${slug}`)) {
      revalidateTag(`bootcamp-${slug}`)
      revalidatedTags.push(`bootcamp-${slug}`)
    }
  }

  // ✅ Revalidate shared tags (with duplicate checks)
  const sharedTags = ['courses', 'courses-page', 'home-page']
  sharedTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  // ✅ Revalidate shared paths (with duplicate checks)
  const sharedPaths = ['/courses', '/']
  sharedPaths.forEach((path) => {
    if (!revalidatedPaths.includes(path)) {
      revalidatePath(path, 'page')
      revalidatedPaths.push(path)
    }
  })
}

// 🎯 Enhanced Course Revalidation (with duplicate prevention)
async function handleCourseRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry } = body
  const slug = entry?.baseContent?.slug || entry?.slug

  // Revalidate course-specific pages with duplicate check
  if (slug && !revalidatedPaths.includes(`/courses/${slug}`)) {
    revalidatePath(`/courses/${slug}`, 'page')
    revalidatedPaths.push(`/courses/${slug}`)
  }

  if (slug && !revalidatedTags.includes(`course-${slug}`)) {
    revalidateTag(`course-${slug}`)
    revalidatedTags.push(`course-${slug}`)
  }

  // Revalidate course lists and related pages (with duplicate checks)
  const courseTags = ['courses', 'course-page', 'home-page']
  courseTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  // Revalidate courses listing page (with duplicate check)
  if (!revalidatedPaths.includes('/courses')) {
    revalidatePath('/courses', 'page')
    revalidatedPaths.push('/courses')
  }
}

// 🏕️ Enhanced Bootcamp Revalidation (with duplicate prevention)
async function handleBootcampRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry } = body
  const slug = entry.baseContent?.slug || entry?.slug

  // Revalidate bootcamp-specific pages with duplicate check
  if (slug && !revalidatedPaths.includes(`/bootcamps/${slug}`)) {
    revalidatePath(`/bootcamps/${slug}`, 'page')
    revalidatedPaths.push(`/bootcamps/${slug}`)
  }

  if (slug && !revalidatedTags.includes(`bootcamp-${slug}`)) {
    revalidateTag(`bootcamp-${slug}`)
    revalidatedTags.push(`bootcamp-${slug}`)
  }

  // Revalidate bootcamp lists and home page (with duplicate checks)
  const bootcampTags = ['courses', 'course-page', 'home-page']
  bootcampTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  // Revalidate courses listing page (with duplicate check)
  if (!revalidatedPaths.includes('/courses')) {
    revalidatePath('/courses', 'page')
    revalidatedPaths.push('/courses')
  }
}

// 📝 Enhanced Blog Revalidation (with duplicate prevention)
async function handleBlogRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry } = body
  const slug = entry?.slug

  if (slug && !revalidatedPaths.includes(`/blogs/${slug}`)) {
    revalidatePath(`/blogs/${slug}`, 'page')
    revalidatedPaths.push(`/blogs/${slug}`)
  }

  if (slug && !revalidatedTags.includes(`blog-${slug}`)) {
    revalidateTag(`blog-${slug}`)
    revalidatedTags.push(`blog-${slug}`)
  }

  // Revalidate blog lists and related content (with duplicate checks)
  const blogTags = ['blogs', 'blogs-list', 'related-blogs']
  blogTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  // Revalidate blogs listing page (with duplicate check)
  if (!revalidatedPaths.includes('/blogs')) {
    revalidatePath('/blogs', 'page')
    revalidatedPaths.push('/blogs')
  }
}

// 🏠 Enhanced Home Page Revalidation (with duplicate prevention)
async function handleHomeRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  // Force complete homepage revalidation (with duplicate check)
  if (!revalidatedPaths.includes('/')) {
    revalidatePath('/', 'page')
    revalidatedPaths.push('/')
  }

  const homeTags = ['home-page', 'courses', 'course-page']
  homeTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })
}

// 📦 Enhanced Course Bundle Revalidation (with duplicate prevention)
async function handleCourseBundleRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry } = body
  const slug = entry.slug

  if (slug && !revalidatedPaths.includes(`/bundles/${slug}`)) {
    revalidatePath(`/bundles/${slug}`, 'page')
    revalidatedPaths.push(`/bundles/${slug}`)
  }

  if (slug && !revalidatedTags.includes(`bundle-${slug}`)) {
    revalidateTag(`bundle-${slug}`)
    revalidatedTags.push(`bundle-${slug}`)
  }

  if (!revalidatedTags.includes('course-bundle')) {
    revalidateTag('course-bundle')
    revalidatedTags.push('course-bundle')
  }
}

// 🏷️ Enhanced Category Revalidation (with duplicate prevention)
async function handleCategoryRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry } = body
  const slug = entry.baseContent?.slug || entry?.slug

  console.log(
    `🏷️ Processing category revalidation for: ${slug || entry.documentId}`
  )

  // Categories affect multiple pages, so broad revalidation (with duplicate checks)
  const categoryTags = ['courses', 'bootcamps', 'blogs', 'home-page']
  categoryTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  // Force revalidation of major pages (with duplicate checks)
  const categoryPaths = ['/', '/courses', '/blogs']
  categoryPaths.forEach((path) => {
    if (!revalidatedPaths.includes(path)) {
      revalidatePath(path, 'page')
      revalidatedPaths.push(path)
    }
  })

  console.log(
    `✅ Category revalidation completed for: ${slug || entry.documentId}`
  )
}
