'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
  AlertTriangle,
  Shield,
  MessageCircle,
  Mail,
  ShieldAlert,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  fetchLoginHistory,
  reportSuspiciousLogin,
} from '@/lib/actions/user-login-history'
import { LoginHistoryItem } from '@/types/dashboard-types'
import {
  getDeviceType,
  getDeviceInfo,
  getStatusVariant,
  formatTimestamp,
} from '@/lib/login-utils'

function LoginRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-700" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-700" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28 bg-slate-200 dark:bg-slate-700" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 bg-slate-200 dark:bg-slate-700" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-16 bg-slate-200 dark:bg-slate-700" />
      </TableCell>
    </TableRow>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="font-medium text-destructive">
              Error Loading Login History
            </p>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ninja-gold/10 dark:bg-ninja-gold/5 mb-4">
          <Shield className="h-10 w-10 text-ninja-gold" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Login History</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Your login activities will appear here once you start accessing
          courses.
        </p>
      </CardContent>
    </Card>
  )
}

const DeviceIcon = ({ type }: { type: string }) => {
  const iconClass = 'h-4 w-4 text-muted-foreground'
  switch (type) {
    case 'desktop':
      return <Monitor className={iconClass} />
    case 'mobile':
      return <Smartphone className={iconClass} />
    case 'laptop':
      return <Laptop className={iconClass} />
    case 'tablet':
      return <Tablet className={iconClass} />
    default:
      return <Monitor className={iconClass} />
  }
}

function AccountBlockedAlert() {
  const handleContactSupport = () => {
    try {
      const supportMessage = `Account Blocked - Urgent Support Needed

Hello,

My account has been blocked and I need immediate assistance to resolve this issue.

Please help me understand why my account was blocked and what steps I need to take to restore access.

Thank you for your urgent attention to this matter.`

      const facebookPageId =
        process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '108194384815914'
      const messengerUrl = `https://m.me/${facebookPageId}?text=${encodeURIComponent(
        supportMessage
      )}`

      const emailSubject = 'Urgent: Account Blocked - Need Assistance'
      const emailUrl = `mailto:${
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@javascriptninja.com'
      }?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
        supportMessage
      )}`

      window.open(messengerUrl, '_blank')
      setTimeout(() => {
        window.location.href = emailUrl
      }, 1000)

      toast.success('Opening support channels...', {
        description: 'Please explain your situation to our support team.',
      })
    } catch (error) {
      console.error('Error opening support channels:', error)
      toast.error('Failed to open support channels')
    }
  }

  return (
    <Card className="border-2 border-destructive bg-gradient-to-br from-destructive/5 via-destructive/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/5">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl text-destructive flex items-center gap-2 mb-2">
              Account Blocked
            </CardTitle>
            <CardDescription className="text-base">
              Your account has been temporarily blocked due to suspicious
              activity.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium">This may have happened due to:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Multiple failed login attempts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Login from unusual locations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Violation of terms of service</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Reported suspicious activity</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                Important: When contacting support, please provide:
              </p>
              <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Your registered email address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Last known login location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Any recent suspicious login notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Explanation of recent account activity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleContactSupport}
            className="flex-1 bg-gradient-ninja-primary hover:opacity-90 text-ninja-navy font-semibold"
            size="lg"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Support (Messenger + Email)
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const email =
                process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
                'support@javascriptninja.com'
              window.location.href = `mailto:${email}?subject=Account Blocked - Urgent`
            }}
            size="lg"
            className="border-2"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Directly
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginHistoryPage() {
  const [selectedLogin, setSelectedLogin] = useState<LoginHistoryItem | null>(
    null
  )
  const [reportReason, setReportReason] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['loginHistory'],
    queryFn: () => fetchLoginHistory(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  })

  const reportMutation = useMutation({
    mutationFn: ({
      fingerprintId,
      report,
    }: {
      fingerprintId: string
      report: string
    }) => reportSuspiciousLogin(fingerprintId, report),
    onSuccess: () => {
      toast.success('Login reported successfully', {
        description: 'Thank you for reporting this login activity.',
      })
      setIsDialogOpen(false)
      setSelectedLogin(null)
      setReportReason('')
      queryClient.invalidateQueries({ queryKey: ['loginHistory'] })
    },
    onError: (error) => {
      toast.error('Failed to report login', {
        description:
          error instanceof Error ? error.message : 'Please try again later.',
      })
    },
  })

  const handleReport = () => {
    if (!selectedLogin || !reportReason.trim()) {
      toast.error('Please provide a reason for reporting this login')
      return
    }

    reportMutation.mutate({
      fingerprintId: selectedLogin.fingerprintId,
      report: reportReason,
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedLogin(null)
    setReportReason('')
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gradient-ninja mb-2">
            Login History
          </h1>
          <p className="text-muted-foreground">
            View and manage your login activities.
          </p>
        </div>
        <ErrorMessage
          message={
            error instanceof Error ? error.message : 'Unknown error occurred'
          }
        />
      </div>
    )
  }

  if (data?.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gradient-ninja mb-2">
            Login History
          </h1>
          <p className="text-muted-foreground">
            View and manage your login activities.
          </p>
        </div>
        <ErrorMessage message={data.error.message} />
      </div>
    )
  }

  const loginHistory = data?.data?.loginHistory || []
  const isBlocked = data?.data?.isBlocked || false

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-ninja mb-2">
          Login History
        </h1>
        <p className="text-muted-foreground">
          View and manage your login activities.
        </p>
      </div>

      {isBlocked && <AccountBlockedAlert />}

      {data?.data && (
        <Card
          className={
            isBlocked ? 'border-2 border-destructive' : 'border-ninja-gold/20'
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center ${
                  isBlocked
                    ? 'bg-destructive/10 ring-4 ring-destructive/5'
                    : 'bg-ninja-gold/10 ring-4 ring-ninja-gold/5'
                }`}
              >
                {isBlocked ? (
                  <ShieldAlert className={`h-5 w-5 text-destructive`} />
                ) : (
                  <Shield className="h-5 w-5 text-ninja-gold" />
                )}
              </div>
              <div>
                <div className="text-lg">Account Security Status</div>
                <div className="text-sm font-normal text-muted-foreground">
                  Last updated: {formatTimestamp(data.data.publishedAt)}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge
                variant={isBlocked ? 'destructive' : 'default'}
                className={
                  isBlocked
                    ? ''
                    : 'bg-ninja-gold/10 text-ninja-gold hover:bg-ninja-gold/20 border-ninja-gold/20'
                }
              >
                {isBlocked ? 'Blocked' : 'Active'}
              </Badge>
              {isBlocked && (
                <p className="text-sm text-destructive font-medium">
                  Your account has been blocked. Please contact support
                  immediately.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <LoginRowSkeleton key={i} />
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : loginHistory.length === 0 ? (
        <EmptyState />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginHistory.map((login) => {
                const deviceType = getDeviceType(login.browserData.userAgent)
                const deviceInfo = getDeviceInfo(login.browserData)
                const statusInfo = getStatusVariant(login.accessType)
                const location = `${login.location.city}, ${login.location.country}`

                return (
                  <TableRow key={login.id}>
                    <TableCell className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <DeviceIcon type={deviceType} />
                      </div>
                      <div className="font-medium">{deviceInfo}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{location}</div>
                        <div className="text-xs text-muted-foreground">
                          {login.location.isp}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {login.ipAddress}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTimestamp(login.accessDate)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusInfo.className}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={isDialogOpen && selectedLogin?.id === login.id}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLogin(login)
                              setIsDialogOpen(true)
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                              Report Suspicious Login
                            </DialogTitle>
                            <DialogDescription>
                              If you don&apos;t recognize this login activity,
                              please report it and we&apos;ll investigate
                              immediately.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                              <p className="text-sm font-semibold">
                                Login Details:
                              </p>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Device:
                                  </span>
                                  <span className="font-medium">
                                    {deviceInfo}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Location:
                                  </span>
                                  <span className="font-medium">
                                    {location}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    IP Address:
                                  </span>
                                  <span className="font-mono font-medium">
                                    {login.ipAddress}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Time:
                                  </span>
                                  <span className="font-medium">
                                    {formatTimestamp(login.accessDate)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">
                                    Status:
                                  </span>
                                  <Badge className={statusInfo.className}>
                                    {statusInfo.label}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Why are you reporting this login?{' '}
                                <span className="text-destructive">*</span>
                              </label>
                              <Textarea
                                placeholder="Please describe why you're reporting this login..."
                                value={reportReason}
                                onChange={(e) =>
                                  setReportReason(e.target.value)
                                }
                                rows={4}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={handleDialogClose}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleReport}
                              className="bg-destructive hover:bg-destructive/90"
                              disabled={
                                reportMutation.isPending || !reportReason.trim()
                              }
                            >
                              {reportMutation.isPending
                                ? 'Reporting...'
                                : 'Report Login'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
