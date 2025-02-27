'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Medal, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data
const courses = [
  { id: '1', name: 'React Masterclass' },
  { id: '2', name: 'Node.js Advanced' },
]

// Mock current user
// const currentUser = {
//   id: 'current',
//   name: 'John Doe',
//   rank: 5,
//   score: 850,
//   progress: '85%',
//   totalAssignments: 45,
//   completedAssignments: 38,
//   averageScore: 88,
// }

const leaderboardData = {
  '1': [
    { id: '1', rank: 1, name: 'Alice Brown', score: 990, progress: '99%' },
    { id: '2', rank: 2, name: 'Bob Wilson', score: 920, progress: '92%' },
    { id: '3', rank: 3, name: 'Carol White', score: 880, progress: '88%' },
    { id: '4', rank: 4, name: 'David Clark', score: 870, progress: '87%' },
    { id: 'current', rank: 5, name: 'John Doe', score: 850, progress: '85%' },
    { id: '5', rank: 6, name: 'Eve Martin', score: 840, progress: '84%' },
    { id: '6', rank: 7, name: 'Frank Johnson', score: 820, progress: '82%' },
    { id: '7', rank: 8, name: 'Grace Lee', score: 800, progress: '80%' },
    { id: '8', rank: 9, name: 'Henry Davis', score: 780, progress: '78%' },
    { id: '9', rank: 10, name: 'Ivy Chen', score: 760, progress: '76%' },
  ],
  '2': [
    { id: '10', rank: 1, name: 'Zack Brown', score: 995, progress: '99.5%' },
    { id: '11', rank: 2, name: 'Yara Wilson', score: 950, progress: '95%' },
    { id: '12', rank: 3, name: 'Xavier White', score: 900, progress: '90%' },
    { id: 'current', rank: 4, name: 'John Doe', score: 880, progress: '88%' },
    { id: '13', rank: 5, name: 'Wade Clark', score: 860, progress: '86%' },
    { id: '14', rank: 6, name: 'Victor Martin', score: 840, progress: '84%' },
    { id: '15', rank: 7, name: 'Uma Johnson', score: 820, progress: '82%' },
    { id: '16', rank: 8, name: 'Tom Lee', score: 800, progress: '80%' },
    { id: '17', rank: 9, name: 'Sarah Davis', score: 780, progress: '78%' },
    { id: '18', rank: 10, name: 'Ryan Chen', score: 760, progress: '76%' },
  ],
}

export default function LeaderboardPage() {
  const [selectedCourse, setSelectedCourse] = useState('1')

  const currentUserStats = leaderboardData[
    selectedCourse as keyof typeof leaderboardData
  ].find((user) => user.id === 'current')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
          <p className="text-muted-foreground">
            Track your ranking and progress across courses.
          </p>
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentUserStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Your Current Standing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Rank</p>
                <p className="text-2xl font-bold">#{currentUserStats.rank}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Score</p>
                <p className="text-2xl font-bold">{currentUserStats.score}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Progress</p>
                <p className="text-2xl font-bold">
                  {currentUserStats.progress}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Course</p>
                <p className="text-2xl font-bold">
                  {courses.find((c) => c.id === selectedCourse)?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Learners</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData[selectedCourse as keyof typeof leaderboardData]
                .slice(0, 10)
                .map((entry) => (
                  <TableRow
                    key={entry.id}
                    className={
                      entry.id === 'current' ? 'bg-primary/10 font-medium' : ''
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {entry.rank <= 3 && (
                          <Medal
                            className={
                              entry.rank === 1
                                ? 'text-yellow-500'
                                : entry.rank === 2
                                ? 'text-gray-400'
                                : 'text-amber-600'
                            }
                          />
                        )}
                        {entry.rank}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`/images/avatar-${entry.id}.jpg`} />
                          <AvatarFallback>{entry.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>
                          {entry.name}
                          {entry.id === 'current' && ' (You)'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{entry.score}</TableCell>
                    <TableCell>{entry.progress}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
