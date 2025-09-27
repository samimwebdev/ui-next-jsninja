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
    publishedAt?: string | null
    [key: string]: unknown
    baseContent?: CourseBase
  }
}

// ✅ Helper function to check if entry should trigger revalidation
function shouldRevalidate(body: StrapiWebhookBody): boolean {
  const { event, entry } = body

  // ✅ Always revalidate on delete or unpublish (to remove from cache)
  if (event === 'entry.delete' || event === 'entry.unpublish') {
    console.log(`🔄 Revalidating due to ${event} event`)
    return true
  }

  // ✅ For create, update, publish - check if entry is published
  const isPublished = !!entry.publishedAt

  if (!isPublished) {
    console.log(
      `⏭️ Skipping revalidation - entry not published (publishedAt: ${entry.publishedAt})`
    )
    return false
  }

  // ✅ For publish events, always revalidate
  if (event === 'entry.publish') {
    console.log('🔄 Revalidating due to publish event')
    return true
  }

  // ✅ For create/update, check if it's published
  console.log(`🔄 Revalidating published entry (event: ${event})`)
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body: StrapiWebhookBody = await request.json()

    console.log('📬 Webhook payload received:', {
      event: body.event,
      model: body.model,
      publishedAt: body.entry?.publishedAt,
      entry: {
        id: body.entry?.id,
        documentId: body.entry?.documentId,
        slug: body.entry?.slug || body.entry?.baseContent?.slug,
        title: body.entry?.title || body.entry?.baseContent?.title,
      },
    })

    // ✅ Verify webhook secret for security
    const secret = request.headers.get('x-strapi-signature')
    if (secret !== process.env.STRAPI_WEBHOOK_SECRET) {
      console.warn('❌ Unauthorized webhook attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ✅ Check if we should process this webhook
    if (!shouldRevalidate(body)) {
      return NextResponse.json({
        revalidated: false,
        reason: 'Entry not published - skipping revalidation',
        timestamp: new Date().toISOString(),
      })
    }

    const revalidatedPaths: string[] = []
    const revalidatedTags: string[] = []

    switch (body.model) {
      case 'promotion':
        // Promotions affect multiple pages, so broad revalidation
        revalidateTag('promotion')
        break
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

      case 'page':
        await handlePageRevalidation(body, revalidatedPaths, revalidatedTags)
        break

      case 'menu':
        await handleMenuRevalidation(body, revalidatedPaths, revalidatedTags)
        break

      case 'setting':
        await handleSettingRevalidation(body, revalidatedPaths, revalidatedTags)
        break

      default:
        console.log(`⚠️ Unhandled model: ${body.model}`)
    }

    // ✅ Only revalidate homepage for published content changes
    if (!revalidatedPaths.includes('/')) {
      revalidatePath('/', 'page')
      revalidatedPaths.push('/')
    }

    // ✅ Add a small delay to ensure all revalidations complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    console.log('✅ Revalidation completed:', {
      event: body.event,
      model: body.model,
      publishedAt: body.entry.publishedAt,
      paths: revalidatedPaths,
      tags: revalidatedTags,
      timestamp: new Date().toISOString(),
    })

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

// ✅ Enhanced handlers with publish status awareness
async function handleCourseRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry, event } = body
  const slug = entry?.baseContent?.slug || entry?.slug

  console.log(`🎯 Processing course revalidation: ${slug} (${event})`)

  if (slug) {
    // ✅ For unpublish/delete, remove from cache
    if (event === 'entry.unpublish' || event === 'entry.delete') {
      console.log(`🗑️ Removing course from cache: ${slug}`)
    }

    if (!revalidatedPaths.includes(`/courses/${slug}`)) {
      revalidatePath(`/courses/${slug}`, 'page')
      revalidatedPaths.push(`/courses/${slug}`)
    }

    if (!revalidatedTags.includes(`course-${slug}`)) {
      revalidateTag(`course-${slug}`)
      revalidatedTags.push(`course-${slug}`)
    }
  }

  // Revalidate course lists (to update/remove from listings)
  const courseTags = ['courses', 'course-page', 'home-page']
  courseTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  if (!revalidatedPaths.includes('/courses')) {
    revalidatePath('/courses', 'page')
    revalidatedPaths.push('/courses')
  }
}

async function handleBootcampRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry, event } = body
  const slug = entry.baseContent?.slug || entry?.slug

  console.log(`🏕️ Processing bootcamp revalidation: ${slug} (${event})`)

  if (slug) {
    if (event === 'entry.unpublish' || event === 'entry.delete') {
      console.log(`🗑️ Removing bootcamp from cache: ${slug}`)
    }

    if (!revalidatedPaths.includes(`/bootcamps/${slug}`)) {
      revalidatePath(`/bootcamps/${slug}`, 'page')
      revalidatedPaths.push(`/bootcamps/${slug}`)
    }

    if (!revalidatedTags.includes(`bootcamp-${slug}`)) {
      revalidateTag(`bootcamp-${slug}`)
      revalidatedTags.push(`bootcamp-${slug}`)
    }
  }

  const bootcampTags = ['courses', 'course-page', 'home-page']
  bootcampTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  if (!revalidatedPaths.includes('/courses')) {
    revalidatePath('/courses', 'page')
    revalidatedPaths.push('/courses')
  }
}

async function handleBlogRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry, event } = body
  const slug = entry?.slug

  console.log(`📝 Processing blog revalidation: ${slug} (${event})`)

  if (slug) {
    if (event === 'entry.unpublish' || event === 'entry.delete') {
      console.log(`🗑️ Removing blog from cache: ${slug}`)
    }

    if (!revalidatedPaths.includes(`/blogs/${slug}`)) {
      revalidatePath(`/blogs/${slug}`, 'page')
      revalidatedPaths.push(`/blogs/${slug}`)
    }

    if (!revalidatedTags.includes(`blog-${slug}`)) {
      revalidateTag(`blog-${slug}`)
      revalidatedTags.push(`blog-${slug}`)
    }
  }

  const blogTags = ['blogs', 'blogs-list', 'related-blogs']
  blogTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  if (!revalidatedPaths.includes('/blogs')) {
    revalidatePath('/blogs', 'page')
    revalidatedPaths.push('/blogs')
  }
}

async function handleSettingRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  // ✅ Settings don't have publishedAt, always revalidate
  console.log('🔄 Revalidating settings...')
  revalidateTag('settings')
  revalidateTag('seo')
  revalidatedTags.push('settings', 'seo')
}

async function handlePageRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  console.log('🔄 Revalidating page...')
  const pageSlug = body.entry.slug || 'unknown-slug'
  revalidatePath(`/pages/${pageSlug}`, 'page')
  revalidateTag('pages')
  revalidateTag(`page-${pageSlug}`)
  revalidatedTags.push('pages', `page-${pageSlug}`)
  revalidatedPaths.push(`/pages/${pageSlug}`)
}

// ✅ Keep other handlers unchanged but with enhanced logging
async function handleCourseBaseRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry, event } = body
  const courseType = entry?.baseContent?.courseType
  const slug = entry?.baseContent?.slug || entry?.slug

  console.log(`📚 Processing course-base revalidation: ${slug} (${event})`)

  if (slug) {
    if (event === 'entry.unpublish' || event === 'entry.delete') {
      console.log(`🗑️ Removing course-base from cache: ${slug}`)
    }

    // Revalidate both course and bootcamp paths since course-base is shared

    if (courseType !== 'course') {
      if (!revalidatedPaths.includes(`/bootcamps/${slug}`)) {
        revalidatePath(`/bootcamps/${slug}`, 'page')
        revalidatedPaths.push(`/bootcamps/${slug}`)
      }
      if (!revalidatedTags.includes(`bootcamp-${slug}`)) {
        revalidateTag(`bootcamp-${slug}`)
        revalidatedTags.push(`bootcamp-${slug}`)
      }
    } else {
      if (!revalidatedPaths.includes(`/courses/${slug}`)) {
        revalidatePath(`/courses/${slug}`, 'page')
        revalidatedPaths.push(`/courses/${slug}`)
      }

      if (!revalidatedTags.includes(`course-${slug}`)) {
        revalidateTag(`course-${slug}`)
        revalidatedTags.push(`course-${slug}`)
      }
    }
  }

  const sharedTags = ['courses', 'courses-page', 'home-page']
  sharedTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  const sharedPaths = ['/courses', '/']
  sharedPaths.forEach((path) => {
    if (!revalidatedPaths.includes(path)) {
      revalidatePath(path, 'page')
      revalidatedPaths.push(path)
    }
  })
}

// Keep other handlers as they are...
async function handleMenuRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  console.log('🔄 Revalidating menu...')
  revalidateTag('menus')
  revalidatedTags.push('menus')
}

async function handleHomeRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  if (!revalidatedPaths.includes('/')) {
    revalidatePath('/', 'page')
    revalidatedPaths.push('/')
  }

  const homeTags = ['home-page']
  homeTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })
}

async function handleCourseBundleRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry, event } = body
  const slug = entry.slug

  console.log(`📦 Processing bundle revalidation: ${slug} (${event})`)

  if (slug) {
    if (event === 'entry.unpublish' || event === 'entry.delete') {
      console.log(`🗑️ Removing bundle from cache: ${slug}`)
    }

    if (!revalidatedPaths.includes(`/bundles/${slug}`)) {
      revalidatePath(`/bundles/${slug}`, 'page')
      revalidatedPaths.push(`/bundles/${slug}`)
    }

    if (!revalidatedTags.includes(`bundle-${slug}`)) {
      revalidateTag(`bundle-${slug}`)
      revalidatedTags.push(`bundle-${slug}`)
    }
  }

  if (!revalidatedTags.includes('course-bundle')) {
    revalidateTag('course-bundle')
    revalidatedTags.push('course-bundle')
  }
}

async function handleCategoryRevalidation(
  body: StrapiWebhookBody,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { entry, event } = body
  const slug = entry.baseContent?.slug || entry?.slug

  console.log(`🏷️ Processing category revalidation: ${slug} (${event})`)

  if (event === 'entry.unpublish' || event === 'entry.delete') {
    console.log(`🗑️ Removing category from cache: ${slug}`)
  }

  // Categories affect multiple pages, so broad revalidation
  const categoryTags = ['courses', 'bootcamps', 'blogs', 'home-page']
  categoryTags.forEach((tag) => {
    if (!revalidatedTags.includes(tag)) {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  })

  const categoryPaths = ['/', '/courses', '/blogs']
  categoryPaths.forEach((path) => {
    if (!revalidatedPaths.includes(path)) {
      revalidatePath(path, 'page')
      revalidatedPaths.push(path)
    }
  })

  console.log(`✅ Category revalidation completed: ${slug}`)
}
