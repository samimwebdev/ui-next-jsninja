'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Shield,
  ShieldCheck,
  ShieldX,
  Smartphone,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { disableTotpAction } from '@/app/(auth)/actions'
import { toast } from 'sonner'
import { UserWithProfile } from '@/types/shared-types'

// interface User {
//   id: number
//   email: string
//   username: string
//   confirmed: boolean
// }

interface SecuritySettingsProps {
  user: UserWithProfile
  initialTotpStatus: boolean
}

export function SecuritySettings({
  user,
  initialTotpStatus,
}: SecuritySettingsProps) {
  const [totpEnabled, setTotpEnabled] = useState(initialTotpStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [showDisableDialog, setShowDisableDialog] = useState(false)
  const router = useRouter()

  const handleEnable2FA = () => {
    router.push('/app-setup')
  }

  const handleDisable2FA = async () => {
    setIsLoading(true)
    try {
      const result = await disableTotpAction()
      if (result.success) {
        setTotpEnabled(false)
        setShowDisableDialog(false)
        toast.success('Two-factor authentication has been disabled')
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to disable 2FA')
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error)
      toast.error('Failed to disable two-factor authentication')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle2FA = (checked: boolean) => {
    if (checked && !totpEnabled) {
      handleEnable2FA()
    } else if (!checked && totpEnabled) {
      setShowDisableDialog(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Account Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Verification Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    user.confirmed
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}
                >
                  {user.confirmed ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">Email Verified</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Badge variant={user.confirmed ? 'default' : 'destructive'}>
                {user.confirmed ? 'Verified' : 'Unverified'}
              </Badge>
            </div>

            {/* 2FA Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    totpEnabled
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : 'bg-yellow-100 dark:bg-yellow-900/20'
                  }`}
                >
                  {totpEnabled ? (
                    <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ShieldX className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">Two-Factor Auth</p>
                  <p className="text-xs text-gray-500">
                    {totpEnabled ? 'Active protection' : 'Not configured'}
                  </p>
                </div>
              </div>
              <Badge variant={totpEnabled ? 'default' : 'secondary'}>
                {totpEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 2FA Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-ninja-gold/10 dark:bg-ninja-gold/20">
                <Shield className="h-5 w-5 text-ninja-gold" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Authenticator App</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use an authenticator app like Google Authenticator or Authy to
                  generate verification codes.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Label htmlFor="2fa-toggle" className="text-sm font-medium">
                    Enable Two-Factor Authentication
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="2fa-toggle"
                checked={totpEnabled}
                onCheckedChange={handleToggle2FA}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Status Alert */}
          <Alert
            className={
              totpEnabled
                ? 'border-green-200 dark:border-green-800'
                : 'border-yellow-200 dark:border-yellow-800'
            }
          >
            <div className="flex items-center gap-2">
              {totpEnabled ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              )}
              <AlertDescription className="text-sm">
                {totpEnabled ? (
                  <>
                    <strong>Two-factor authentication is active.</strong> Your
                    account is protected with an additional layer of security.
                  </>
                ) : (
                  <>
                    <strong>Two-factor authentication is disabled.</strong>{' '}
                    Enable 2FA to add an extra layer of security to your
                    account.
                  </>
                )}
              </AlertDescription>
            </div>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {totpEnabled ? (
              <>
                {/* <Button
                  variant="outline"
                  onClick={() => router.push('/app-setup')}
                  className="flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  Reconfigure 2FA
                </Button> */}
                <Button
                  variant="outline"
                  onClick={() => setShowDisableDialog(true)}
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <ShieldX className="h-4 w-4" />
                  Disable 2FA
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEnable2FA}
                className="flex items-center gap-2 bg-ninja-gold hover:bg-ninja-gold/90 text-slate-900"
              >
                <ShieldCheck className="h-4 w-4" />
                Enable Two-Factor Authentication
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm">
              About Two-Factor Authentication
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>
                Two-factor authentication adds an extra layer of security to
                your account by requiring a verification code from your
                authenticator app in addition to your password.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Works with Google Authenticator, Microsoft Authenticator,
                  Authy, and other TOTP apps
                </li>
                <li>
                  Codes are generated offline and refresh every 30 seconds
                </li>
                <li>
                  Protects your account even if your password is compromised
                </li>
                <li>Can be disabled at any time from this settings page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disable 2FA Confirmation Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Disable Two-Factor Authentication
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              Are you sure you want to disable two-factor authentication? This
              will make your account less secure.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Warning:</strong> Without 2FA, your account will only be
              protected by your password. We strongly recommend keeping 2FA
              enabled for maximum security.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDisableDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable2FA}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ShieldX className="h-4 w-4" />
              )}
              {isLoading ? 'Disabling...' : 'Disable 2FA'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
