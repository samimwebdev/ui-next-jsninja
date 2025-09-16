import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface CheckoutErrorProps {
  error?: Error | null
}

export function CheckoutError({ error }: CheckoutErrorProps) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="text-center">
        <CardContent className="pt-6">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error?.message ||
              'The course you are looking for could not be found or you do not have access to it.'}
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </CardContent>
      </Card>
    </div>
  )
}
