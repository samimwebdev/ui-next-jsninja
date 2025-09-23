import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="relative min-h-screen bg-gradient-to-bl from-slate-50 via-slate-100 to-slate-200 dark:from-background dark:via-muted dark:to-card">
      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-ninja-gold/20 via-ninja-orange/10 to-ninja-gold/15 dark:from-ninja-gold/10 dark:via-transparent dark:to-ninja-orange/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-slate-900/10 dark:from-transparent dark:to-transparent" />

      <div className="relative z-10 container px-4 py-12 max-w-md mx-auto min-h-screen flex items-center justify-center">
        <Card className="w-full bg-white/90 dark:bg-card/90 backdrop-blur-lg border border-slate-200/60 dark:border-border/50 shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
              Setup Complete!
            </h2>
            <p className="mt-3 text-slate-600 dark:text-muted-foreground">
              Your authenticator app has been successfully configured.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-green-800 dark:text-green-400">
                    Two-Factor Authentication Enabled
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your account is now protected with an additional layer of
                    security. You will need to enter a code from your
                    authenticator app each time you sign in.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-slate-50 dark:bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-foreground">
                Important Reminders:
              </h4>
              <ul className="text-sm text-slate-600 dark:text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-ninja-gold rounded-full flex-shrink-0 mt-2"></span>
                  Keep your authenticator app installed and accessible
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-ninja-gold rounded-full flex-shrink-0 mt-2"></span>
                  Save backup codes if your authenticator app supports them
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-ninja-gold rounded-full flex-shrink-0 mt-2"></span>
                  Contact support if you lose access to your authenticator app
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-gradient-ninja-primary hover:bg-gradient-ninja-reverse text-slate-900 font-semibold py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2"
                >
                  Continue to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/security">Manage Security Settings</Link>
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-200 dark:border-border">
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                You can disable two-factor authentication anytime from your
                security settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
