'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Monitor, Smartphone, Laptop, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

// Mock data
const loginHistory = [
  {
    id: 1,
    device: 'Desktop - Chrome',
    location: 'New York, USA',
    ip: '192.168.1.1',
    timestamp: '2024-02-26 10:30 AM',
    deviceType: 'desktop',
    status: 'success',
  },
  {
    id: 2,
    device: 'iPhone - Safari',
    location: 'London, UK',
    ip: '192.168.1.2',
    timestamp: '2024-02-25 03:45 PM',
    deviceType: 'mobile',
    status: 'success',
  },
  {
    id: 3,
    device: 'MacBook - Firefox',
    location: 'Toronto, Canada',
    ip: '192.168.1.3',
    timestamp: '2024-02-24 09:15 AM',
    deviceType: 'laptop',
    status: 'suspicious',
  },
]

const DeviceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'desktop':
      return <Monitor className="h-4 w-4" />
    case 'mobile':
      return <Smartphone className="h-4 w-4" />
    case 'laptop':
      return <Laptop className="h-4 w-4" />
    default:
      return <Monitor className="h-4 w-4" />
  }
}

export default function LoginHistoryPage() {
  const [selectedLogin, setSelectedLogin] = useState<number | null>(null)
  const [reportReason, setReportReason] = useState('')

  const handleReport = () => {
    toast.success('Login reported successfully', {
      description: 'Thank you for reporting this login activity.',
    })
    setSelectedLogin(null)
    setReportReason('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Login History</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your login activities.
        </p>
      </div>

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
          {loginHistory.map((login) => (
            <TableRow key={login.id}>
              <TableCell className="flex items-center gap-2">
                <DeviceIcon type={login.deviceType} />
                {login.device}
              </TableCell>
              <TableCell>{login.location}</TableCell>
              <TableCell>{login.ip}</TableCell>
              <TableCell>{login.timestamp}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    login.status === 'suspicious'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {login.status}
                </span>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLogin(login.id)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Suspicious Login</DialogTitle>
                      <DialogDescription>
                        If you don&apos;t recognize this login activity, please
                        report it.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Login Details:</p>
                        <p className="text-sm">Device: {login.device}</p>
                        <p className="text-sm">Location: {login.location}</p>
                        <p className="text-sm">Time: {login.timestamp}</p>
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
                        onClick={() => setSelectedLogin(null)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleReport} className="bg-destructive">
                        Report Login
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
