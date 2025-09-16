'use client'

import { useEffect } from 'react'
import { fbEvent } from '@/lib/analytics'
import { CourseItem, CourseBundleItem } from '@/types/courses-page-types'

interface CoursesListingTrackingProps {
  coursesData: {
    course: CourseItem[]
    bootcamp: CourseItem[]
    workshop?: CourseItem[]
    courseBundle: CourseBundleItem[]
  }
}

export function CoursesListingTracking({
  coursesData,
}: CoursesListingTrackingProps) {
  useEffect(() => {
    const trackCoursesPageView = async () => {
      try {
        const totalItems =
          coursesData.course.length +
          coursesData.bootcamp.length +
          (coursesData.workshop?.length || 0) +
          coursesData.courseBundle.length

        // Enhanced GA tracking with all items
        if (typeof window !== 'undefined' && window.gtag) {
          const allItems = [
            ...coursesData.course.map((course, index) => ({
              item_id: course.slug,
              item_name: course.title,
              item_category: 'course',
              item_list_position: index + 1,
              price: course.price,
            })),
            ...coursesData.bootcamp.map((bootcamp, index) => ({
              item_id: bootcamp.slug,
              item_name: bootcamp.title,
              item_category: 'bootcamp',
              item_list_position: coursesData.course.length + index + 1,
              price: bootcamp.price,
            })),
            ...(coursesData.workshop || []).map((workshop, index) => ({
              item_id: workshop.slug,
              item_name: workshop.title,
              item_category: 'workshop',
              item_list_position:
                coursesData.course.length +
                coursesData.bootcamp.length +
                index +
                1,
              price: workshop.price,
            })),
            ...coursesData.courseBundle.map((bundle, index) => ({
              item_id: bundle.slug,
              item_name: bundle.title,
              item_category: 'bundle',
              item_list_position:
                coursesData.course.length +
                coursesData.bootcamp.length +
                (coursesData.workshop?.length || 0) +
                index +
                1,
              price: bundle.price,
            })),
          ]

          window.gtag('event', 'view_item_list', {
            item_list_id: 'courses_listing',
            item_list_name: 'All Courses & Programs',
            items: allItems,
          })
        }

        // ✅ Using your fbEvent utility function
        fbEvent('ViewContent', {
          content_type: 'product_group',
          content_category: 'courses',
          content_ids: [
            ...coursesData.course.map((course) => course.slug),
            ...coursesData.bootcamp.map((bootcamp) => bootcamp.slug),
            ...(coursesData.workshop || []).map((workshop) => workshop.slug),
            ...coursesData.courseBundle.map((bundle) => bundle.slug),
          ],
          num_items: totalItems,
          custom_data: {
            courses_count: coursesData.course.length,
            bootcamps_count: coursesData.bootcamp.length,
            workshops_count: coursesData.workshop?.length || 0,
            bundles_count: coursesData.courseBundle.length,
          },
        })

        // Server-side tracking
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_name: 'view_item_list',
            event_type: 'both',
            ga_parameters: {
              item_list_id: 'courses_listing',
              item_list_name: 'All Courses & Programs',
              items: [
                ...coursesData.course.map((course, index) => ({
                  item_id: course.slug,
                  item_name: course.title,
                  item_category: 'course',
                  item_list_position: index + 1,
                  price: course.price,
                })),
                ...coursesData.bootcamp.map((bootcamp, index) => ({
                  item_id: bootcamp.slug,
                  item_name: bootcamp.title,
                  item_category: 'bootcamp',
                  item_list_position: coursesData.course.length + index + 1,
                  price: bootcamp.price,
                })),
                ...(coursesData.workshop || []).map((workshop, index) => ({
                  item_id: workshop.slug,
                  item_name: workshop.title,
                  item_category: 'workshop',
                  item_list_position:
                    coursesData.course.length +
                    coursesData.bootcamp.length +
                    index +
                    1,
                  price: workshop.price,
                })),
                ...coursesData.courseBundle.map((bundle, index) => ({
                  item_id: bundle.slug,
                  item_name: bundle.title,
                  item_category: 'courseBundle',
                  item_list_position:
                    coursesData.course.length +
                    coursesData.bootcamp.length +
                    (coursesData.workshop?.length || 0) +
                    index +
                    1,
                  price: bundle.price,
                })),
                // Add other item types...
              ],
            },
            fb_custom_data: {
              content_type: 'product_group',
              content_category: 'courses',
              content_ids: [
                ...coursesData.course.map((course) => course.slug),
                ...coursesData.bootcamp.map((bootcamp) => bootcamp.slug),
                ...(coursesData.workshop || []).map(
                  (workshop) => workshop.slug
                ),
                ...coursesData.courseBundle.map((bundle) => bundle.slug),
              ],
              num_items: totalItems,
            },
          }),
        })
      } catch (error) {
        console.error('Courses listing tracking error:', error)
      }
    }

    trackCoursesPageView()
  }, [coursesData])

  return null
}
