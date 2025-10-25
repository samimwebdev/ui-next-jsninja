'use client'

import { useState } from 'react'
import { TaskSubmission } from '@/types/task-submission-types'
import { TaskReviewCard } from './task-review-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface TaskReviewListProps {
  initialData: TaskSubmission[]
}

export function TaskReviewList({ initialData }: TaskReviewListProps) {
  const [tasks, setTasks] = useState<TaskSubmission[]>(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignment.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || task.submissionStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleTaskUpdate = (updatedTask: TaskSubmission) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.documentId === updatedTask.documentId ? updatedTask : task
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by student name, email, or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status Filter</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Submissions</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="graded">Graded</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTasks.length} of {tasks.length} submissions
      </div>

      {/* Task cards */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <TaskReviewCard
            key={task.documentId}
            task={task}
            onUpdate={handleTaskUpdate}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No submissions found matching your filters
        </div>
      )}
    </div>
  )
}
