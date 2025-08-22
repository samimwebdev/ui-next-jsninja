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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="p-6">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <p className="dark:text-destructive-foreground">
          Error in login history: {message}
        </p>
      </div>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="p-8 text-center">
      <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">No login history</h3>
      <p className="text-muted-foreground">
        Your login activities will appear here once you start accessing courses.
      </p>
    </Card>
  )
}

const DeviceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'desktop':
      return <Monitor className="h-4 w-4" />
    case 'mobile':
      return <Smartphone className="h-4 w-4" />
    case 'laptop':
      return <Laptop className="h-4 w-4" />
    case 'tablet':
      return <Tablet className="h-4 w-4" />
    default:
      return <Monitor className="h-4 w-4" />
  }
}

export default function LoginHistoryPage() {
  const [selectedLogin, setSelectedLogin] = useState<LoginHistoryItem | null>(
    null
  )
  const [reportReason, setReportReason] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false) // FIX: Add dialog state
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
      // FIX: Close dialog and reset state
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

  // FIX: Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedLogin(null)
    setReportReason('')
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Login History</h3>
          <p className="text-sm text-muted-foreground">
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

  const loginHistory = data?.data?.loginHistory || []

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Login History</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your login activities.
        </p>
      </div>

      {/* Account Status Card */}
      {data?.data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={data.data.isBlocked ? 'destructive' : 'default'}>
                {data.data.isBlocked ? 'Blocked' : 'Active'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last updated: {formatTimestamp(data.data.publishedAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="border rounded-lg">
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
        </div>
      ) : loginHistory.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="border rounded-lg">
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
                    <TableCell className="flex items-center gap-2">
                      <DeviceIcon type={deviceType} />
                      <div>
                        <div className="font-medium">{deviceInfo}</div>
                      </div>
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
                    <TableCell>{formatTimestamp(login.accessDate)}</TableCell>
                    <TableCell>
                      <Badge className={statusInfo.className}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={isDialogOpen}
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
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Report Suspicious Login</DialogTitle>
                            <DialogDescription>
                              If you don&apos;t recognize this login activity,
                              please report it.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium">
                                Login Details:
                              </p>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Device:</strong> {deviceInfo}
                                </p>
                                <p>
                                  <strong>Location:</strong> {location}
                                </p>
                                <p>
                                  <strong>IP Address:</strong> {login.ipAddress}
                                </p>
                                <p>
                                  <strong>Time:</strong>{' '}
                                  {formatTimestamp(login.accessDate)}
                                </p>
                                <p>
                                  <strong>Access Type:</strong>{' '}
                                  {statusInfo.label}
                                </p>
                              </div>
                            </div>
                            <Textarea
                              placeholder="Please describe why you're reporting this login..."
                              value={reportReason}
                              onChange={(e) => setReportReason(e.target.value)}
                            />
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
                              className="bg-destructive"
                              disabled={reportMutation.isPending}
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
        </div>
      )}
    </div>
  )
}
