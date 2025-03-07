'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Lock,
  Smartphone,
  QrCode,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'

interface Course {
  id: string
  title: string
  description: string
  image: string
  originalPrice: number
  discountedPrice: number
  features: string[]
}

// Define the form schema for payment details
const paymentFormSchema = z.object({
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  bkashNumber: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'Please enter a valid bKash number')
    .optional(),
  bkashTxID: z
    .string()
    .min(10, 'Transaction ID must be at least 10 characters')
    .optional(),
  nagadNumber: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'Please enter a valid Nagad number')
    .optional(),
  nagadTxID: z
    .string()
    .min(10, 'Transaction ID must be at least 10 characters')
    .optional(),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')

  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('card')

  // Form for payment details
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      bkashNumber: '',
      bkashTxID: '',
      nagadNumber: '',
      nagadTxID: '',
    },
  })

  // Mock course data - in a real app, you would fetch this based on courseId
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Check if user is authenticated (this would be your auth check)
      const userIsAuthenticated = localStorage.getItem('user') !== null
      setIsAuthenticated(true)

      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push(
          `/login?redirect=${encodeURIComponent(
            `/checkout?courseId=${courseId}`
          )}`
        )
        return
      }

      // Mock course data - in a real app, you would fetch this from an API
      setCourse({
        id: courseId || '1',
        title: 'Advanced JavaScript Bootcamp',
        description: 'Master JavaScript with this comprehensive bootcamp',
        image:
          'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        originalPrice: 9999,
        discountedPrice: 7999,
        features: [
          '150+ hours of content',
          'Project-based learning',
          'Lifetime access',
          '3 months of 1:1 support',
        ],
      })

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [courseId, router])

  const handleCheckout = () => {
    // Validate form based on selected payment method
    let isValid = false

    if (paymentMethod === 'card') {
      const { cardNumber, cardExpiry, cardCvc } = form.getValues()
      isValid = !!cardNumber && !!cardExpiry && !!cardCvc
      if (!isValid) {
        form.setError('cardNumber', { message: 'Please complete card details' })
        return
      }
    } else if (paymentMethod === 'bkash') {
      const { bkashNumber, bkashTxID } = form.getValues()
      isValid = !!bkashNumber && !!bkashTxID
      if (!isValid) {
        form.setError('bkashTxID', {
          message: 'Please complete bKash payment details',
        })
        return
      }
    } else if (paymentMethod === 'nagad') {
      const { nagadNumber, nagadTxID } = form.getValues()
      isValid = !!nagadNumber && !!nagadTxID
      if (!isValid) {
        form.setError('nagadTxID', {
          message: 'Please complete Nagad payment details',
        })
        return
      }
    }

    // In a real app, this would process the payment and enroll the user
    // For now, we'll just show a success message and redirect
    alert('Payment successful! You are now enrolled in the course.')
    router.push(`/course-view/${course?.id}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Complete Your Enrollment
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Summary */}
        <div className="lg:col-span-2">
          <Card className="border border-border">
            <CardHeader className="bg-card">
              <CardTitle>Course Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={course?.image || '/placeholder.svg'}
                    alt={course?.title || 'Course image'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold mb-2">{course?.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {course?.description}
                  </p>

                  <h3 className="font-semibold mb-2">What you'll get:</h3>
                  <ul className="space-y-1 mb-4">
                    {course?.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="mt-6 border border-border">
            <CardHeader className="bg-card">
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  {/* Credit/Debit Card Option */}
                  <Collapsible
                    open={paymentMethod === 'card'}
                    className="border border-border rounded-lg overflow-hidden transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2 p-4 cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="h-5 w-5" />
                        Credit/Debit Card
                      </Label>
                    </div>

                    <CollapsibleContent className="p-4 pt-0 border-t border-border">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="1234 5678 9012 3456"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cardExpiry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cardCvc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVC</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* bKash Option */}
                  <Collapsible
                    open={paymentMethod === 'bkash'}
                    className="border border-border rounded-lg overflow-hidden transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2 p-4 cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="bkash" id="bkash" />
                      <Label
                        htmlFor="bkash"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className="h-5 w-5 bg-pink-600 dark:bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          b
                        </div>
                        bKash
                      </Label>
                    </div>

                    <CollapsibleContent className="p-4 pt-0 border-t border-border">
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="bg-muted/30 dark:bg-muted p-4 rounded-lg text-center">
                            <QrCode className="h-32 w-32 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">Scan to Pay</p>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">
                                bKash Payment Instructions:
                              </h4>
                              <ol className="list-decimal list-inside text-sm space-y-1">
                                <li>Open your bKash app</li>
                                <li>
                                  Scan the QR code or send money to: 01712345678
                                </li>
                                <li>Use reference: {course?.id}</li>
                                <li>
                                  Enter the Transaction ID and your bKash number
                                  below
                                </li>
                              </ol>
                            </div>

                            <FormField
                              control={form.control}
                              name="bkashNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>bKash Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="01XXXXXXXXX"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="bkashTxID"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Transaction ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="TrxID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Nagad Option */}
                  <Collapsible
                    open={paymentMethod === 'nagad'}
                    className="border border-border rounded-lg overflow-hidden transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2 p-4 cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="nagad" id="nagad" />
                      <Label
                        htmlFor="nagad"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className="h-5 w-5 bg-orange-600 dark:bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          N
                        </div>
                        Nagad
                      </Label>
                    </div>

                    <CollapsibleContent className="p-4 pt-0 border-t border-border">
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="bg-muted/30 dark:bg-muted p-4 rounded-lg text-center">
                            <QrCode className="h-32 w-32 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">Scan to Pay</p>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">
                                Nagad Payment Instructions:
                              </h4>
                              <ol className="list-decimal list-inside text-sm space-y-1">
                                <li>Open your Nagad app</li>
                                <li>
                                  Scan the QR code or send money to: 01712345678
                                </li>
                                <li>Use reference: {course?.id}</li>
                                <li>
                                  Enter the Transaction ID and your Nagad number
                                  below
                                </li>
                              </ol>
                            </div>

                            <FormField
                              control={form.control}
                              name="nagadNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nagad Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="01XXXXXXXXX"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="nagadTxID"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Transaction ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="TrxID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </RadioGroup>

                <Alert className="mt-6 bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertTitle>Secure Payment</AlertTitle>
                  <AlertDescription>
                    Your payment information is encrypted and secure. We never
                    store your full card details.
                  </AlertDescription>
                </Alert>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 border border-border">
            <CardHeader className="bg-card">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span className="line-through text-muted-foreground">
                    ৳ {course?.originalPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discounted Price</span>
                  <span className="font-bold">৳ {course?.discountedPrice}</span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>৳ {course?.discountedPrice}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 transition-all duration-200"
                size="lg"
              >
                <Lock className="mr-2 h-4 w-4" /> Complete Payment
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By completing your purchase, you agree to our Terms of Service
                and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
