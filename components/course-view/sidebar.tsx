'use client'

import * as React from 'react'
import {
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle,
  Video,
  FileText,
  Circle,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Lesson, Module } from './types/course'

interface SidebarProps {
  modules: Module[]
  currentLessonId: string
  onLessonSelect: (moduleId: string, lesson: Lesson) => void
}

export function Sidebar({
  modules,
  currentLessonId,
  onLessonSelect,
}: SidebarProps) {
  const [search, setSearch] = React.useState('')
  const [openModules, setOpenModules] = React.useState<string[]>(['m2'])
  const [filteredModules, setFilteredModules] = React.useState(modules)

  // Calculate progress
  const calculateProgress = () => {
    let completedLessons = 0
    let totalLessons = 0
    let completedModules = 0

    modules.forEach((module) => {
      if (module.completed) {
        completedModules++
      }
      module.lessons.forEach((lesson) => {
        totalLessons++
        if (lesson.completed) {
          completedLessons++
        }
      })
    })

    return {
      completedLessons,
      totalLessons,
      completedModules,
      totalModules: modules.length,
      percentage: Math.round((completedLessons / totalLessons) * 100) || 0,
    }
  }

  const { completedLessons, totalLessons, percentage, completedModules } =
    calculateProgress()

  // Search functionality
  React.useEffect(() => {
    if (!search.trim()) {
      setFilteredModules(modules)
      return
    }

    const searchLower = search.toLowerCase()
    const filtered = modules
      .map((module) => {
        // Check if module title matches
        const moduleMatches = module.title.toLowerCase().includes(searchLower)

        // Filter lessons that match search
        const filteredLessons = module.lessons.filter((lesson) =>
          lesson.title.toLowerCase().includes(searchLower)
        )

        // If module matches or has matching lessons, include it
        if (moduleMatches || filteredLessons.length > 0) {
          // If module matches, return all lessons, otherwise only matching lessons
          return {
            ...module,
            lessons: moduleMatches ? module.lessons : filteredLessons,
          }
        }

        return null
      })
      .filter(Boolean) as Module[]

    setFilteredModules(filtered)

    // Open modules that have matching content
    const modulesToOpen = filtered.map((m) => m.id)
    setOpenModules((prev) => {
      const newOpen = [...new Set([...prev, ...modulesToOpen])]
      return newOpen
    })
  }, [search, modules])

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  return (
    <div className="border-l bg-card">
      {/* Search */}
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search in course"
            className="pl-10 py-6 h-11 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 border-b bg-background/50">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons completed
            </span>
            <span className="text-muted-foreground">
              {completedModules}/{modules.length} modules
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            Overall Progress: {percentage}%
          </p>
        </div>
      </div>

      {/* Modules List */}
      <div className="overflow-auto h-[calc(100vh-180px)]">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <Collapsible
              key={module.id}
              open={openModules.includes(module.id)}
              onOpenChange={() => toggleModule(module.id)}
              className="border-b"
            >
              <CollapsibleTrigger className="flex w-full items-start justify-between py-5 px-6 hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  {module.completed ? (
                    <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 min-w-[24px] min-h-[24px] self-start" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                  <div className="text-sm text-left w-full">
                    <h3 className="font-medium text-base mb-1 break-words">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground">{module.duration}</p>
                  </div>
                </div>
                {openModules.includes(module.id) ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-accent/50">
                {module.lessons.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-3 py-4 px-6 font-normal hover:bg-accent pl-14 relative transition-all duration-200 h-auto',
                      lesson.completed && 'text-emerald-500',
                      currentLessonId === lesson.id &&
                        "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary font-medium shadow-sm before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:content-['']"
                    )}
                    onClick={() => onLessonSelect(module.id, lesson as Lesson)}
                  >
                    <div className="self-start mt-1">
                      {lesson.completed ? (
                        <CheckCircle className="!h-5 !w-5 shrink-0" />
                      ) : lesson.type === 'video' ? (
                        <Video className="!h-5 !w-5 shrink-0 text-muted-foreground" />
                      ) : (
                        <FileText className="!h-5 !w-5 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-1 text-left overflow-hidden">
                      <p className="text-sm leading-normal break-words">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.duration}
                      </p>
                    </div>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              No modules match your search
            </p>
            <Button
              variant="link"
              onClick={() => setSearch('')}
              className="mt-2"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
