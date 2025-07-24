import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  AssessmentQuestion,
  QuizSubmissionResponse,
} from '@/types/bootcamp-page-types'
import { Award, AlertCircle, Loader2 } from 'lucide-react'

interface QuizResultsProps {
  isSubmitting: boolean
  submissionError: string | null
  submissionResults: QuizSubmissionResponse | null
  questions: AssessmentQuestion[]
  getSelectedOptionTexts: (questionIndex: number) => string[]
  onCloseQuiz: () => void
}

export default function QuizResults({
  isSubmitting,
  submissionError,
  submissionResults,
  questions,
  getSelectedOptionTexts,
  onCloseQuiz,
}: QuizResultsProps) {
  // Helper function to get option text by IDs for correct answers
  const getCorrectAnswerTexts = (
    question: AssessmentQuestion,
    correctOptionIds: string[]
  ) => {
    if (!correctOptionIds || correctOptionIds.length === 0) return []

    return correctOptionIds.map((optionId) => {
      const option = question.options?.find(
        (opt: AssessmentQuestion['options'][number]) => opt.id === optionId
      )
      console.log(option, 'Option for correct answer')
      return option?.text
    })
  }

  return (
    <>
      <CardHeader className="pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            {isSubmitting ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <Award className="h-8 w-8 text-primary" />
            )}
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-center text-primary">
          {isSubmitting ? 'Processing...' : 'Quiz Results'}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[60vh] overflow-y-auto">
        {isSubmitting ? (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">
              Calculating your results...
            </p>
          </div>
        ) : submissionError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Submission Error</p>
              <p className="text-sm">{submissionError}</p>
            </div>
            <p className="text-muted-foreground">
              Unable to calculate results. Please try again.
            </p>
          </div>
        ) : submissionResults ? (
          <>
            <div className="text-center space-y-4">
              <p className="text-5xl font-bold mb-4">
                {submissionResults.score} / {submissionResults.totalScore}
              </p>
              <div className="relative pt-4">
                <Progress
                  value={submissionResults.percentage}
                  className="w-full h-4 rounded-full"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  {submissionResults.passed
                    ? 'Congratulations! You passed the assessment!'
                    : submissionResults.percentage >= 50
                    ? 'Good effort! Keep learning to improve your score.'
                    : "Keep learning! There's room for improvement."}
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-6">
              {questions.map((q, index) => {
                // Get selected option texts for display
                const selectedOptionTexts = getSelectedOptionTexts(index)

                const serverResult = submissionResults.answers.find(
                  (a) => a.questionId === q.id
                )

                // Get correct answers
                const correctAnswerTexts = serverResult?.correctAnswers
                  ? getCorrectAnswerTexts(q, serverResult.correctAnswers)
                  : []
                console.log(correctAnswerTexts, 'Correct Answer Texts')
                console.log(serverResult, 'Server Result')

                return (
                  <div key={q.id} className="p-5 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-semibold text-lg flex-1">{q.title}</p>
                      {serverResult && (
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            serverResult.correct
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          }`}
                        >
                          {serverResult.correct ? 'Correct' : 'Incorrect'}
                        </div>
                      )}
                    </div>

                    {/* Your Answer */}
                    <div className="mb-2">
                      <span className="font-medium">Your answer: </span>
                      <span>
                        {selectedOptionTexts.length > 0
                          ? selectedOptionTexts.join(', ')
                          : 'No answer'}
                      </span>
                    </div>

                    {/* Correct Answer */}
                    {correctAnswerTexts.length > 0 && (
                      <div className="mb-2">
                        <span className="font-medium">Correct answer: </span>
                        <span className="text-green-600 dark:text-green-400">
                          {correctAnswerTexts.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Explanation */}
                    {serverResult?.explanation && (
                      <div
                        className="mt-2 text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{
                          __html: serverResult?.explanation || '',
                        }}
                      />
                    )}

                    {/* Points */}
                    <div className="mt-2 text-sm">
                      <span className="font-medium">
                        Points: {serverResult?.points ?? q.points ?? 1}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">
              No results available.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center pt-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button
          onClick={onCloseQuiz}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-8 rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Close Quiz'}
        </Button>
      </CardFooter>
    </>
  )
}
