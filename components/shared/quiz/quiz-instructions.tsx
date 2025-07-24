import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { AssessmentQuestion } from '@/types/bootcamp-page-types'
import { AlertCircle, LogIn } from 'lucide-react'

interface QuizInstructionsProps {
  quizData: {
    title: string
    instructions: string
  }
  questions: AssessmentQuestion[]
  onStartQuiz: () => void
}

export default function QuizInstructions({
  quizData,
  questions,
  onStartQuiz,
}: QuizInstructionsProps) {
  // Parse HTML instructions safely
  const renderInstructions = () => {
    if (quizData.instructions) {
      return (
        <div className="text-center space-y-4">
          <div
            className="prose prose-sm mx-auto dark:prose-invert [&_h4]:text-center [&_h4]:font-semibold [&_h4]:text-lg [&_h4]:mb-4 [&_ul]:list-none [&_ul]:p-0 [&_ul]:space-y-2 [&_li]:text-sm [&_li]:text-muted-foreground [&_p]:mt-4"
            dangerouslySetInnerHTML={{ __html: quizData.instructions }}
          />
        </div>
      )
    }

    // Fallback to default instructions with better hierarchy
    return (
      <div className="text-center space-y-4">
        <h4 className="font-semibold text-lg mb-4">Quiz Rules:</h4>
        <div className="bg-secondary/10 rounded-lg p-6 max-w-md mx-auto">
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>You will have limited time to answer each question</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Use the navigation buttons to move between questions</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                For multiple-choice questions, you can select multiple answers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                Your final score will be displayed at the end of the quiz
              </span>
            </li>
          </ul>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mt-6">
          <div className="flex items-start gap-3">
            <LogIn className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Authentication Required
              </p>
              <p className="text-amber-700 dark:text-amber-300 mt-1">
                You must be logged in to save your progress and submit your
                assessment results.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <CardHeader className="pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          {quizData.title}
        </CardTitle>
        <CardDescription className="text-center text-base mt-2">
          Complete this assessment to check your suitability for the bootcamp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">{renderInstructions()}</CardContent>
      <CardFooter className="justify-center pt-4">
        <Button
          onClick={onStartQuiz}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-8 rounded-full"
          disabled={questions.length === 0}
        >
          {questions.length === 0 ? 'No Questions Available' : 'Start Quiz'}
        </Button>
      </CardFooter>
    </>
  )
}
