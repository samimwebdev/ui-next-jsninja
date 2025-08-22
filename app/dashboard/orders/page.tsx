'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { AlertTriangle, Receipt, ShoppingCart } from 'lucide-react'
import { fetchUserOrders } from '@/lib/actions/user-order'
import { Order } from '@/types/dashboard-types'
import { formatPrice } from '@/lib/course-utils'
import { formatDate } from '@/lib/bootcamp-utils'

function OrderRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-20" />
      </TableCell>
    </TableRow>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <p>Error loading orders: {message}</p>
      </div>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="p-8 text-center">
      <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">No orders found</h3>
      <p className="text-muted-foreground">
        You have not made any purchases yet. Start learning by enrolling in a
        course!
      </p>
    </Card>
  )
}

function OrderStatusBadge({ status }: { status: Order['orderStatus'] }) {
  const statusConfig = {
    Paid: { variant: 'default' as const, label: 'Paid' },
    Pending: { variant: 'secondary' as const, label: 'Pending' },
    Failed: { variant: 'destructive' as const, label: 'Failed' },
    Cancelled: { variant: 'outline' as const, label: 'Cancelled' },
    Refunded: { variant: 'outline' as const, label: 'Refunded' },
  }

  const config = statusConfig[status] || statusConfig.Pending

  return <Badge variant={config.variant}>{config.label}</Badge>
}

function CourseTypeBadge({
  courseType,
}: {
  courseType: 'course' | 'bootcamp'
}) {
  return (
    <Badge variant={courseType === 'bootcamp' ? 'secondary' : 'outline'}>
      {courseType === 'bootcamp' ? 'Bootcamp' : 'Course'}
    </Badge>
  )
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['userOrders'],
    queryFn: fetchUserOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Orders</h3>
          <p className="text-sm text-muted-foreground">
            View your course enrollment orders.
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Orders</h3>
        <p className="text-sm text-muted-foreground">
          View your course enrollment orders.
        </p>
      </div>

      {isLoading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No.</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <OrderRowSkeleton key={i} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No.</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((order, index) => (
                <TableRow key={order.documentId}>
                  <TableCell className="font-mono text-sm">
                    #{index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{order.course.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.amount)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            Order Details
                          </DialogTitle>
                          <DialogDescription>
                            Order ID: {selectedOrder?.documentId}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                  Course
                                </h4>
                                <p className="font-medium">
                                  {selectedOrder.course.title}
                                </p>
                                <CourseTypeBadge
                                  courseType={selectedOrder.course.courseType}
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                  Date
                                </h4>
                                <p>{formatDate(selectedOrder.date)}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                  Amount
                                </h4>
                                <p className="text-lg font-semibold">
                                  {formatPrice(selectedOrder.amount)}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                  Status
                                </h4>
                                <OrderStatusBadge
                                  status={selectedOrder.orderStatus}
                                />
                              </div>
                            </div>

                            <div className="border-t pt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Payment Method:
                                </span>
                                <span className="font-medium">
                                  {selectedOrder.paymentMethod}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Transaction ID:
                                </span>
                                <span className="font-mono text-xs">
                                  {selectedOrder.transactionId}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Order Date:
                                </span>
                                <span>
                                  {formatDate(selectedOrder.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
