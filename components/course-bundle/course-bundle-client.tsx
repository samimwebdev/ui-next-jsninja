'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Grid,
  List,
  Package,
  Star,
  TrendingUp,
  Clock,
  Users,
  BookOpen,
} from 'lucide-react'
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
import { Card, CardContent } from '@/components/ui/card'
import { CourseCard } from '@/components/courses/course-card'
import {
  CourseBundlePageData,
  CourseBundleStats,
} from '@/types/course-bundle-types'
import { CourseType } from '@/types/checkout-types'

interface CourseBundleClientProps {
  bundleData: CourseBundlePageData
}

export const CourseBundleClient: React.FC<CourseBundleClientProps> = ({
  bundleData,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | CourseType>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<
    'title' | 'price' | 'rating' | 'students' | 'level'
  >('title')

  // Calculate bundle statistics
  const bundleStats = useMemo((): CourseBundleStats => {
    const courses = bundleData?.courseBases || []
    const totalCourses = courses.filter(
      (course) => course.courseType === 'course'
    ).length
    const totalBootcamps = courses.filter(
      (course) => course.courseType === 'bootcamp'
    ).length
    const totalLessons = courses.reduce(
      (sum, course) => sum + (course.totalLessons || 0),
      0
    )
    const totalStudents = courses.reduce(
      (sum, course) => sum + (course.totalStudents || 0),
      0
    )
    const averageRating =
      courses.length > 0
        ? courses.reduce(
            (sum, course) => sum + (course.averageRating || 0),
            0
          ) / courses.length
        : 0
    const individualPrice = courses.reduce(
      (sum, course) => sum + (course.price || 0),
      0
    )
    const bundlePrice = bundleData?.price || 0
    const savings = individualPrice - bundlePrice
    const savingsPercentage =
      individualPrice > 0 ? (savings / individualPrice) * 100 : 0

    // Calculate total duration (simplified - you might want to improve this)
    const totalDurationHours = courses.reduce((sum, course) => {
      const duration = course.duration || '0'
      const hours = parseInt(duration.toString().replace(/\D/g, '')) || 0
      return sum + hours
    }, 0)
    const totalDuration = `${totalDurationHours} hours`

    return {
      totalCourses,
      totalBootcamps,
      totalLessons,
      totalStudents,
      averageRating,
      totalDuration,
      individualPrice,
      bundlePrice,
      savings,
      savingsPercentage,
    }
  }, [bundleData])

  // Filter options with counts
  const filterOptions = useMemo(() => {
    const courses = bundleData?.courseBases || []
    return [
      { value: 'all' as const, label: 'All', count: courses.length },
      {
        value: 'course' as const,
        label: 'Courses',
        count: bundleStats.totalCourses,
      },
      {
        value: 'bootcamp' as const,
        label: 'Bootcamps',
        count: bundleStats.totalBootcamps,
      },
    ].filter((option) => option.count > 0)
  }, [bundleData?.courseBases, bundleStats])

  // Filtered and sorted courses
  const filteredCourses = useMemo(() => {
    let filtered = bundleData?.courseBases || []

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((course) => course.courseType === filterType)
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(search) ||
          course?.shortDescription?.toLowerCase().includes(search) ||
          (course.categories || []).some((cat) =>
            cat.name?.toLowerCase().includes(search)
          )
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        case 'price':
          return (a.price || 0) - (b.price || 0)
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0)
        case 'students':
          return (b.totalStudents || 0) - (a.totalStudents || 0)
        case 'level':
          const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 }
          return (
            (levelOrder[a.level as keyof typeof levelOrder] || 0) -
            (levelOrder[b.level as keyof typeof levelOrder] || 0)
          )
        default:
          return 0
      }
    })

    return filtered
  }, [bundleData?.courseBases, filterType, searchTerm, sortBy])

  // Helper function to format price
  const formatPrice = (price: number): string => {
    if (!price || price <= 0) return 'Free'
    return `${price.toLocaleString()} BDT`
  }

  // Early return if no bundle data
  if (!bundleData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bundle not found</h1>
          <p className="text-muted-foreground">
            The requested bundle could not be loaded.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center items-center gap-2 mb-4">
          <Package className="h-8 w-8 text-primary" />
          <Badge className="bg-primary text-primary-foreground font-semibold">
            Course Bundle
          </Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {bundleData.title || 'Course Bundle'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
          {bundleData.shortDescription ||
            'Explore our comprehensive course bundle'}
        </p>
        {bundleData.helperText && (
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {bundleData.helperText}
          </p>
        )}
      </motion.div>

      {/* Bundle Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {bundleStats.totalCourses + bundleStats.totalBootcamps}
            </div>
            <div className="text-xs text-muted-foreground">Total Items</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {bundleStats.totalStudents.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Students</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {bundleStats.averageRating.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{bundleStats.totalLessons}</div>
            <div className="text-xs text-muted-foreground">Lessons</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {bundleStats.savingsPercentage.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Savings</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <Package className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-lg font-bold text-primary">
              {formatPrice(bundleStats.bundlePrice)}
            </div>
            <div className="text-xs text-muted-foreground line-through">
              {formatPrice(bundleStats.individualPrice)}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Only show filters if there are courses */}
      {(bundleData.courseBases?.length || 0) > 0 && (
        <>
          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between"
          >
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filterType === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(option.value)}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: typeof sortBy) => setSortBy(value)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="level">Level</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
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
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-muted-foreground">
              Showing {filteredCourses.length} of{' '}
              {bundleData.courseBases?.length || 0} courses
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </motion.div>

          {/* Courses Grid/List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filterType}-${viewMode}-${searchTerm}-${sortBy}`}
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
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CourseCard
                    course={{
                      ...course,
                      categories: course.categories || [],
                    }}
                    viewMode={viewMode}
                    showType={filterType === 'all'}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Results */}
          {filteredCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? `No courses found matching "${searchTerm}"`
                    : `No ${
                        filterType === 'all' ? 'courses' : filterType + 's'
                      } available`}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setFilterType('all')
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* No courses in bundle */}
      {(!bundleData.courseBases || bundleData.courseBases.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses in bundle</h3>
            <p className="text-muted-foreground mb-4">
              This bundle does not contain any courses yet.
            </p>
          </div>
        </motion.div>
      )}

      {/* Bundle Action */}
      {(bundleData.courseBases?.length || 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center bg-muted/50 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold mb-4">Get Complete Bundle</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get access to all {bundleData.courseBases?.length || 0} courses in
            this bundle and save {bundleStats.savingsPercentage.toFixed(0)}%
            compared to individual purchases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {formatPrice(bundleStats.bundlePrice)}
              </div>
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(bundleStats.individualPrice)}
              </div>
              <div className="text-sm text-green-600 font-semibold">
                Save {formatPrice(bundleStats.savings)}
              </div>
            </div>
            <Button size="lg" className="px-8">
              Get Bundle Now
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
