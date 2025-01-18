import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Clock,
  DollarSign,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import Image from 'next/image'

export const CourseBundle = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Course Bundle Header */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Course Bundle to take a look
          </h1>
          <p className="text-muted-foreground text-lg">
            Enroll the course bundle to get access to all the courses at a
            affordable price
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* JavaScript Course Card */}
          <Card className="group relative overflow-hidden border-2 border-primary/20 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  100 Lessons
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>10 hrs</span>
                </div>
              </div>
              <CardTitle className="text-2xl">JavaScript Bootcamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=2940"
                  alt="JavaScript Course"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  width={600}
                  height={300}
                />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Comprehensive JavaScript course from basics to advanced
                  concepts
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">8000 tk</span>
                  <Button
                    variant="outline"
                    className="gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* React Course Card */}
          <Card className="group relative overflow-hidden border-2 border-primary/20 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  300 Lessons
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>1000 mins</span>
                </div>
              </div>
              <CardTitle className="text-2xl">React Bootcamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2940"
                  alt="React Course"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Master React.js with hands-on projects and real-world
                  applications
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">8000 tk</span>
                  <Button
                    variant="outline"
                    className="gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JavaScript Course Card */}
          <Card className="group relative overflow-hidden border-2 border-primary/20 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  100 Lessons
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>10 hrs</span>
                </div>
              </div>
              <CardTitle className="text-2xl">JavaScript Bootcamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=2940"
                  alt="JavaScript Course"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  width={600}
                  height={300}
                />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Comprehensive JavaScript course from basics to advanced
                  concepts
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">8000 tk</span>
                  <Button
                    variant="outline"
                    className="gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bundle Offer Section */}
        <Card className="border-2 border-primary bg-primary/5 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold">Special Bundle Offer</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Bundle Includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 transition-transform hover:translate-x-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Complete JavaScript Bootcamp</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform hover:translate-x-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Complete React Bootcamp</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform hover:translate-x-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Bonus: Project Resources</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Price:</span>
                    <span className="text-xl line-through">16000 tk</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bundle Price:</span>
                    <span className="text-2xl font-bold text-primary">
                      8000 tk
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">You Save:</span>
                    <span className="text-xl font-semibold text-primary">
                      8000 tk
                    </span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full gap-2 bg-primary hover:bg-primary/90 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
