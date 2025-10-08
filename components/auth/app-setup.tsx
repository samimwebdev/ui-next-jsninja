'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveTotpSecret } from '@/app/(auth)/actions'
import QRCode from 'react-qr-code'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Shield,
  Copy,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '../ui/card'

const initialState = {
  message: '',
  success: false,
  errors: {},
}

// type ActionState = {
//   message: string
//   success?: boolean
//   errors?: Record<string, string[]>
// }

export default function Setup({
  secret,
  url,
}: {
  secret: string
  url: string
}) {
  const [state, formAction] = useActionState(saveTotpSecret, initialState)
  const [code, setCode] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Handle code input changes
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = code.split('').slice(0, 6)
      while (newCode.length < 6) newCode.push('')
      newCode[index] = value

      const codeString = newCode.join('')
      setCode(codeString)

      // Move to next input if value entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Copy secret to clipboard
  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Handle form submission
  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true)
    formData.append('code', code)
    formAction(formData)
  }

  // Reset submitting state when action completes
  useEffect(() => {
    if (state.message) {
      setIsSubmitting(false)
    }
  }, [state.message])

  // Handle successful setup - redirect to success page
  useEffect(() => {
    if (state.success) {
      // Small delay for user to see success message
      const timer = setTimeout(() => {
        router.push('/app-setup-success')
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [state.success, router])

  return (
    <div className="relative min-h-screen bg-gradient-to-bl from-slate-50 via-slate-100 to-slate-200 dark:from-background dark:via-muted dark:to-card">
      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-ninja-gold/20 via-ninja-orange/10 to-ninja-gold/15 dark:from-ninja-gold/10 dark:via-transparent dark:to-ninja-orange/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-slate-900/10 dark:from-transparent dark:to-transparent" />

      <div className="relative z-10 container px-4 py-12 max-w-2xl mx-auto min-h-screen flex items-center justify-center">
        <Card className="w-full bg-white/90 dark:bg-card/90 backdrop-blur-lg border border-slate-200/60 dark:border-border/50 shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-ninja-gold/10 dark:bg-ninja-gold/20 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-10 w-10 text-ninja-gold" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
              Setup Authenticator App
            </h2>
            <p className="mt-3 text-slate-600 dark:text-muted-foreground">
              Use an app like Google Authenticator, Microsoft Authenticator, or
              Authy to scan the QR code or enter the secret key manually.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Success/Error Messages */}
            {state.message && (
              <div
                className={`p-4 rounded-lg text-sm border ${
                  state.success
                    ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {state.success ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>
                    {state.success
                      ? 'Setup successful! Redirecting to confirmation...'
                      : state.message}
                  </span>
                </div>
              </div>
            )}

            {/* QR Code Section */}
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                Step 1: Scan QR Code
              </h3>
              <div className="inline-block p-6 bg-white rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">
                <QRCode
                  size={256}
                  style={{
                    height: 'auto',
                    maxWidth: '100%',
                    width: '100%',
                  }}
                  value={url}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Point your authenticator app camera at this QR code
              </p>
            </div>

            {/* Manual Entry Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                Step 2: Or Enter Secret Key Manually
              </h3>
              <div className="relative">
                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                  <code className="flex-1 font-mono text-sm text-slate-900 dark:text-slate-100 break-all">
                    {showSecret ? secret : '••••••••••••••••••••••••••••••••'}
                  </code>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSecret(!showSecret)}
                      className="h-8 w-8 p-0 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {showSecret ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copySecret}
                      className="h-8 w-8 p-0 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {copied ? (
                        <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Secret key copied to clipboard!
                  </p>
                )}
              </div>
            </div>

            {/* Verification Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                Step 3: Verify Setup
              </h3>
              <p className="text-sm text-slate-600 dark:text-muted-foreground">
                Enter the 6-digit code generated by your authenticator app to
                complete the setup.
              </p>

              <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="secret" value={secret} />

                <div>
                  <Label className="text-slate-700 dark:text-foreground font-medium mb-4 block text-center">
                    Verification Code
                  </Label>

                  {/* OTP Input Fields */}
                  <div className="flex gap-3 justify-center mb-4">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-500 focus:border-ninja-gold dark:focus:border-ninja-gold"
                        value={code[index] || ''}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        autoComplete="off"
                        disabled={isSubmitting || state.success}
                      />
                    ))}
                  </div>

                  {/* Form Errors */}
                  {state.errors && Object.keys(state.errors).length > 0 && (
                    <div className="text-sm text-red-600 dark:text-red-400 text-center">
                      {Object.values(state.errors).flat().join(', ')}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || code.length !== 6 || state.success}
                  className="w-full bg-gradient-ninja-primary hover:bg-gradient-ninja-reverse text-slate-900 font-semibold py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {state.success ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-slate-900" />
                      Redirecting...
                    </div>
                  ) : isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              </form>
            </div>

            {/* Help Section */}
            <div className="bg-slate-50 dark:bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-foreground">
                Need Help?
              </h4>
              <div className="text-sm text-slate-600 dark:text-muted-foreground space-y-2">
                <p>
                  <strong>Popular Authenticator Apps:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Google Authenticator (iOS/Android)</li>
                  <li>Microsoft Authenticator (iOS/Android)</li>
                  <li>Authy (iOS/Android/Desktop)</li>
                  <li>1Password (Premium)</li>
                </ul>
                <p className="mt-3">
                  Make sure your devices time is synced correctly for the codes
                  to work properly.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-200 dark:border-border">
              <Link
                href="/dashboard"
                className="text-sm text-slate-600 dark:text-muted-foreground hover:text-ninja-gold transition-colors"
              >
                Skip for now and continue to dashboard →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
