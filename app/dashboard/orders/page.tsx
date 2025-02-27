"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Mock data
const orders = [
  {
    id: "1",
    course: "React Masterclass",
    date: "2024-02-26",
    amount: "$99.99",
    status: "Completed",
  },
  {
    id: "2",
    course: "Node.js Advanced",
    date: "2024-02-25",
    amount: "$79.99",
    status: "Processing",
  },
]

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Orders</h3>
        <p className="text-sm text-muted-foreground">View your course enrollment orders.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.course}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                      <DialogDescription>Order ID: {selectedOrder?.id}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Course</h4>
                        <p className="text-sm text-muted-foreground">{selectedOrder?.course}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Date</h4>
                        <p className="text-sm text-muted-foreground">{selectedOrder?.date}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Amount</h4>
                        <p className="text-sm text-muted-foreground">{selectedOrder?.amount}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Status</h4>
                        <p className="text-sm text-muted-foreground">{selectedOrder?.status}</p>
                      </div>
                    </div>
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

