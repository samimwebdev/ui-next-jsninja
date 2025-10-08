'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CourseCard } from '@/components/courses/course-card'
import { CourseBundleCard } from '@/components/courses/course-bundle-card'

import {
  FilterType,
  CourseItem,
  CourseBundleItem,
} from '@/types/courses-page-types'
import { event, fbEvent } from '@/lib/analytics' // ✅ Using your utilities
import { CoursesListingTracking } from './courses-listing-tracking'

interface CoursesClientProps {
  coursesData: {
    course: CourseItem[]
    bootcamp: CourseItem[]
    workshop?: CourseItem[]
    courseBundle: CourseBundleItem[]
  }
}

export const CoursesClient: React.FC<CoursesClientProps> = ({
  coursesData,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<
    'title' | 'price' | 'rating' | 'students'
  >('title')

  // Combine all items for filtering and searching
  const allItems = useMemo(() => {
    const items: Array<(CourseItem | CourseBundleItem) & { type: FilterType }> =
      []

    // Add courses
    coursesData.course.forEach((item) =>
      items.push({ ...item, type: 'course' })
    )

    // Add bootcamps
    coursesData.bootcamp.forEach((item) =>
      items.push({ ...item, type: 'bootcamp' })
    )

    // Add workshops (if they exist)
    if (coursesData.workshop) {
      coursesData.workshop.forEach((item) =>
        items.push({ ...item, type: 'workshop' })
      )
    }

    // Add course bundles
    coursesData.courseBundle.forEach((item) =>
      items.push({ ...item, type: 'courseBundle' })
    )

    return items
  }, [coursesData])

  // Filter options with counts
  const filterOptions = useMemo(() => {
    const options = [
      { value: 'all' as FilterType, label: 'All', count: allItems.length },
      {
        value: 'course' as FilterType,
        label: 'Courses',
        count: coursesData.course.length,
      },
      {
        value: 'bootcamp' as FilterType,
        label: 'Bootcamps',
        count: coursesData.bootcamp.length,
      },
      {
        value: 'courseBundle' as FilterType,
        label: 'Bundles',
        count: coursesData.courseBundle.length,
      },
    ]

    if (coursesData.workshop && coursesData.workshop.length > 0) {
      options.splice(3, 0, {
        value: 'workshop' as FilterType,
        label: 'Workshops',
        count: coursesData.workshop.length,
      })
    }

    return options
  }, [allItems.length, coursesData])

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let filtered = allItems

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((item) => item.type === activeFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.shortDescription.toLowerCase().includes(search) ||
          ('categories' in item &&
            item.categories.some((cat) =>
              cat.name.toLowerCase().includes(search)
            ))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'price':
          return a.price - b.price
        case 'rating':
          if ('averageRating' in a && 'averageRating' in b) {
            return b.averageRating - a.averageRating
          }
          return 0
        case 'students':
          if ('totalStudents' in a && 'totalStudents' in b) {
            return b.totalStudents - a.totalStudents
          }
          return 0
        default:
          return 0
      }
    })

    return filtered
  }, [allItems, activeFilter, searchTerm, sortBy])

  // Track course card Tracking
  const handleCourseClick = async (course: CourseItem, position: number) => {
    try {
      const courseSlug = course.slug
      const courseTitle = course.title
      const coursePrice = course.price

      // ✅ Using your event utility function
      event({
        action: 'select_item',
        category: 'ecommerce',
        label: courseSlug,
        value: coursePrice,
      })

      // ✅ Using your fbEvent utility function
      fbEvent('ViewContent', {
        content_type: 'course',
        content_ids: [courseSlug],
        content_name: courseTitle,
        value: coursePrice,
        currency: 'USD',
      })

      // Server-side tracking
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'select_item',
          event_type: 'both',
          ga_parameters: {
            item_list_id: 'courses_listing',
            item_list_name: 'Courses Listing Page',
            items: [
              {
                item_id: courseSlug,
                item_name: courseTitle,
                item_category: 'course',
                item_list_position: position + 1,
                price: coursePrice,
              },
            ],
          },
          fb_custom_data: {
            content_type: 'course',
            content_ids: [courseSlug],
            content_name: courseTitle,
            value: coursePrice,
            currency: 'BDT',
          },
        }),
      })
    } catch (error) {
      console.error('Course click tracking error:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CoursesListingTracking coursesData={coursesData} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          All Courses & Programs
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive collection of JavaScript courses, bootcamps,
          workshops, and course bundles. Master web development with hands-on
          projects and expert instruction.
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between"
      >
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveFilter(option.value)
              }}
              className="transition-all duration-200"
            >
              {option.label}
              <Badge variant="secondary" className="ml-2">
                {option.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={(value: typeof sortBy) => {
              setSortBy(value)
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="students">Students</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setViewMode('grid')
              }}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setViewMode('list')
              }}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-6"
      >
        <p className="text-muted-foreground">
          Showing {filteredItems.length}{' '}
          {filteredItems.length === 1 ? 'result' : 'results'}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </motion.div>

      {/* Course Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeFilter}-${viewMode}-${searchTerm}-${sortBy}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={`${item.type}-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => {
                // ✅ Track item clicks for both courses and bundles
                if (item.type !== 'courseBundle') {
                  handleCourseClick(item as CourseItem, index)
                } else {
                  // Track bundle clicks
                  event({
                    action: 'select_bundle',
                    category: 'ecommerce',
                    label: item.slug,
                    value: item.price,
                  })
                }
              }}
            >
              {item.type === 'courseBundle' ? (
                <CourseBundleCard
                  bundle={item as CourseBundleItem}
                  viewMode={viewMode}
                />
              ) : (
                <CourseCard
                  course={item as CourseItem}
                  viewMode={viewMode}
                  showType={activeFilter === 'all'}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? `No ${
                    activeFilter === 'all'
                      ? 'items'
                      : filterOptions
                          .find((o) => o.value === activeFilter)
                          ?.label.toLowerCase()
                  } found matching "${searchTerm}"`
                : `No ${
                    activeFilter === 'all'
                      ? 'items'
                      : filterOptions
                          .find((o) => o.value === activeFilter)
                          ?.label.toLowerCase()
                  } available`}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setActiveFilter('all')
                // ✅ Track filter clearing
                event({
                  action: 'clear_filters',
                  category: 'engagement',
                  label: 'no_results',
                })
              }}
            >
              Clear filters
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
