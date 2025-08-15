import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ClipboardList, Clock, Trophy } from 'lucide-react'
import type { CourseQuiz, CourseQuizQuestion } from '@/types/course-quiz-types'

interface CourseQuizInstructionsProps {
  quizData: CourseQuiz
  questions: CourseQuizQuestion[]
  onStartQuiz: () => void
}

export default function CourseQuizInstructions({
  quizData,
  questions,
  onStartQuiz,
}: CourseQuizInstructionsProps) {
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0)
  const averageTime = Math.round(
    questions.reduce((sum, q) => sum + (q.timeLimit || 60), 0) /
      questions.length
  )

  return (
    <>
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Welcome to the Quiz
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Test your understanding of the lesson concepts
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quiz Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{questions.length}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold">{averageTime}s</div>
            <div className="text-sm text-muted-foreground">Per Question</div>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold">{quizData.passingScore}%</div>
            <div className="text-sm text-muted-foreground">To Pass</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Instructions:</h4>
          <div
            className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: quizData.instructions }}
          />
        </div>

        {/* Additional Info */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Total Points Available: {totalPoints}</p>
          <p>• You can navigate between questions before submitting</p>
          <p>• Make sure you have a stable internet connection</p>
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          onClick={onStartQuiz}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
        >
          Start Quiz
        </Button>
      </CardFooter>
    </>
  )
}
