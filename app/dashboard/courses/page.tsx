"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, GraduationCap, Users } from "lucide-react"

// Mock data
const enrolledCourses = [
  {
    id: "1",
    title: "React Masterclass",
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    href: "/courses/react-masterclass",
    instructor: "John Doe",
    lastAccessed: "2024-02-25",
    duration: "12 weeks",
    enrolledStudents: 1500,
    nextLesson: "Advanced State Management",
  },
  {
    id: "2",
    title: "Node.js Advanced",
    progress: 30,
    totalLessons: 20,
    completedLessons: 6,
    href: "/courses/nodejs-advanced",
    instructor: "Jane Smith",
    lastAccessed: "2024-02-24",
    duration: "10 weeks",
    enrolledStudents: 1200,
    nextLesson: "RESTful API Design",
  },
  {
    id: "3",
    title: "TypeScript Fundamentals",
    progress: 45,
    totalLessons: 15,
    completedLessons: 7,
    href: "/courses/typescript-fundamentals",
    instructor: "Mike Johnson",
    lastAccessed: "2024-02-23",
    duration: "8 weeks",
    enrolledStudents: 900,
    nextLesson: "Advanced Types and Interfaces",
  },
]

const bootcamps = [
  {
    id: "1",
    title: "Full Stack Development",
    progress: 45,
    totalModules: 6,
    completedModules: 3,
    href: "/bootcamps/full-stack",
    duration: "12 weeks",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    instructor: "Alex Johnson",
    enrolledStudents: 50,
    nextModule: "Backend Development with Node.js",
  },
  {
    id: "2",
    title: "Cloud Architecture",
    progress: 60,
    totalModules: 8,
    completedModules: 5,
    href: "/bootcamps/cloud-architecture",
    duration: "16 weeks",
    startDate: "2024-02-01",
    endDate: "2024-05-30",
    instructor: "Sarah Lee",
    enrolledStudents: 40,
    nextModule: "Serverless Architecture",
  },
]

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">My Learning</h3>
        <p className="text-sm text-muted-foreground">Track your course and bootcamp progress.</p>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="bootcamps">Bootcamps</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Link href={course.href} key={course.id}>
                <Card className="transition-colors hover:bg-muted/50 h-full">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolledStudents} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Last accessed: {course.lastAccessed}</span>
                      </div>
                    </div>
                    <div>
                      <Badge variant="secondary">Next: {course.nextLesson}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bootcamps">
          <div className="grid gap-6 md:grid-cols-2">
            {bootcamps.map((bootcamp) => (
              <Link href={bootcamp.href} key={bootcamp.id}>
                <Card className="transition-colors hover:bg-muted/50 h-full">
                  <CardHeader>
                    <CardTitle>{bootcamp.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">Instructor: {bootcamp.instructor}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{bootcamp.progress}%</span>
                      </div>
                      <Progress value={bootcamp.progress} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>
                          {bootcamp.completedModules}/{bootcamp.totalModules} modules
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{bootcamp.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{bootcamp.enrolledStudents} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {bootcamp.startDate} - {bootcamp.endDate}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Badge variant="secondary">Next: {bootcamp.nextModule}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

