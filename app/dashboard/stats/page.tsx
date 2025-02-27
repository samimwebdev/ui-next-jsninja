"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Book, Clock, GraduationCap } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

// Mock data for daily activity
const generateActivityData = () => {
  const days = 52
  const data = []
  for (let i = 0; i < days; i++) {
    data.push(Math.floor(Math.random() * 4)) // 0-3 for activity levels
  }
  return data
}

const courses = [
  { id: "1", name: "React Masterclass" },
  { id: "2", name: "Node.js Advanced" },
  { id: "3", name: "Full Stack Bootcamp" },
]

const courseStats = {
  "1": {
    modulesCompleted: 14,
    totalModules: 20,
    timeSpent: "45h 30m",
    lessonsCompleted: 42,
    totalLessons: 56,
    progress: 75,
    assignments: [
      {
        name: "React Router Implementation",
        score: 95,
        totalScore: 100,
        submittedDate: "2024-02-25",
        deadline: "2024-02-26",
        status: "Completed",
      },
      {
        name: "State Management Project",
        score: 88,
        totalScore: 100,
        submittedDate: "2024-02-20",
        deadline: "2024-02-22",
        status: "Completed",
      },
    ],
    quizzes: [
      {
        name: "React Fundamentals",
        score: 18,
        totalQuestions: 20,
        completedDate: "2024-02-18",
        timeSpent: "25m",
      },
      {
        name: "Advanced React Patterns",
        score: 15,
        totalQuestions: 20,
        completedDate: "2024-02-23",
        timeSpent: "30m",
      },
    ],
    weeklyProgress: [
      { week: "Week 1", progress: 20 },
      { week: "Week 2", progress: 35 },
      { week: "Week 3", progress: 50 },
      { week: "Week 4", progress: 65 },
      { week: "Week 5", progress: 75 },
    ],
    dailyActivity: generateActivityData(),
  },
  "2": {
    modulesCompleted: 8,
    totalModules: 15,
    timeSpent: "28h 45m",
    lessonsCompleted: 24,
    totalLessons: 45,
    progress: 53,
    assignments: [
      {
        name: "API Development",
        score: 90,
        totalScore: 100,
        submittedDate: "2024-02-24",
        deadline: "2024-02-25",
        status: "Completed",
      },
      {
        name: "Database Integration",
        score: 0,
        totalScore: 100,
        submittedDate: "-",
        deadline: "2024-02-28",
        status: "Pending",
      },
    ],
    quizzes: [
      {
        name: "Node.js Basics",
        score: 16,
        totalQuestions: 20,
        completedDate: "2024-02-20",
        timeSpent: "28m",
      },
      {
        name: "Express.js Framework",
        score: 12,
        totalQuestions: 20,
        completedDate: "2024-02-25",
        timeSpent: "35m",
      },
    ],
    weeklyProgress: [
      { week: "Week 1", progress: 15 },
      { week: "Week 2", progress: 25 },
      { week: "Week 3", progress: 40 },
      { week: "Week 4", progress: 48 },
      { week: "Week 5", progress: 53 },
    ],
    dailyActivity: generateActivityData(),
  },
  "3": {
    modulesCompleted: 4,
    totalModules: 12,
    timeSpent: "120h 15m",
    lessonsCompleted: 85,
    totalLessons: 140,
    progress: 33,
    assignments: [
      {
        name: "E-commerce Project",
        score: 92,
        totalScore: 100,
        submittedDate: "2024-02-20",
        deadline: "2024-02-22",
        status: "Completed",
      },
      {
        name: "Authentication System",
        score: 85,
        totalScore: 100,
        submittedDate: "2024-02-15",
        deadline: "2024-02-18",
        status: "Completed",
      },
    ],
    quizzes: [
      {
        name: "HTML & CSS Basics",
        score: 14,
        totalQuestions: 20,
        completedDate: "2024-02-12",
        timeSpent: "40m",
      },
      {
        name: "JavaScript Fundamentals",
        score: 10,
        totalQuestions: 20,
        completedDate: "2024-02-17",
        timeSpent: "45m",
      },
    ],
    weeklyProgress: [
      { week: "Week 1", progress: 8 },
      { week: "Week 2", progress: 15 },
      { week: "Week 3", progress: 22 },
      { week: "Week 4", progress: 28 },
      { week: "Week 5", progress: 33 },
    ],
    dailyActivity: generateActivityData(),
  },
}

export default function StatsPage() {
  const [selectedCourse, setSelectedCourse] = useState("1")
  const stats = courseStats[selectedCourse as keyof typeof courseStats]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Course Statistics</h2>
          <p className="text-muted-foreground">Track your progress and performance.</p>
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-[280px]">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.modulesCompleted}/{stats.totalModules}
            </div>
            <Progress value={(stats.modulesCompleted / stats.totalModules) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent Learning</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeSpent}</div>
            <p className="text-xs text-muted-foreground">Total time spent on course</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.lessonsCompleted}/{stats.totalLessons}
            </div>
            <Progress value={(stats.lessonsCompleted / stats.totalLessons) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.progress}%</div>
            <Progress value={stats.progress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="progress" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {stats.dailyActivity.map((activity, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-4 w-4 rounded-sm",
                    activity === 0 && "bg-muted",
                    activity === 1 && "bg-emerald-200",
                    activity === 2 && "bg-emerald-400",
                    activity === 3 && "bg-emerald-600",
                  )}
                  title={`Activity Level: ${activity}`}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-muted" />
                <span className="text-muted-foreground">No activity</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-emerald-200" />
                <span className="text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-emerald-400" />
                <span className="text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-emerald-600" />
                <span className="text-muted-foreground">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.assignments.map((assignment) => (
                <TableRow key={assignment.name}>
                  <TableCell>{assignment.name}</TableCell>
                  <TableCell>
                    {assignment.score}/{assignment.totalScore}
                  </TableCell>
                  <TableCell>{assignment.submittedDate}</TableCell>
                  <TableCell>{assignment.deadline}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        assignment.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead>Time Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.quizzes.map((quiz) => (
                <TableRow key={quiz.name}>
                  <TableCell>{quiz.name}</TableCell>
                  <TableCell>
                    {quiz.score}/{quiz.totalQuestions}
                  </TableCell>
                  <TableCell>{quiz.completedDate}</TableCell>
                  <TableCell>{quiz.timeSpent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

