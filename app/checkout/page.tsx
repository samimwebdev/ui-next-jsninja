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
  rocketNumber: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'Please enter a valid Rocket number')
    .optional(),
  rocketTxID: z
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
      rocketNumber: '',
      rocketTxID: '',
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
    } else if (paymentMethod === 'rocket') {
      const { rocketNumber, rocketTxID } = form.getValues()
      isValid = !!rocketNumber && !!rocketTxID
      if (!isValid) {
        form.setError('rocketTxID', {
          message: 'Please complete Rocket payment details',
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

                  <h3 className="font-semibold mb-2">What youll get:</h3>
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
                    <div
                      className="flex items-center space-x-3 p-4 cursor-pointer hover:bg-accent"
                      onClick={() => setPaymentMethod('card')}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </Label>
                    </div>

                    <CollapsibleContent className="p-6 pt-4 border-t border-border">
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
                    <div
                      className="flex items-center space-x-3 p-4 cursor-pointer hover:bg-accent"
                      onClick={() => setPaymentMethod('bkash')}
                    >
                      <RadioGroupItem value="bkash" id="bkash" />
                      <Label
                        htmlFor="bkash"
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="h-6 w-10 flex items-center justify-center">
                          <svg viewBox="0 0 60 60" className="h-6 w-auto">
                            <path
                              d="M5,0 L55,0 C57.7614,0 60,2.23858 60,5 L60,55 C60,57.7614 57.7614,60 55,60 L5,60 C2.23858,60 0,57.7614 0,55 L0,5 C0,2.23858 2.23858,0 5,0 Z"
                              fill="#E2136E"
                            />
                            <path
                              d="M15.2066,25.7439 C15.2066,25.7439 16.2706,25.7169 16.8196,25.1679 C17.3686,24.6189 17.3416,23.5549 17.3416,23.5549 L17.3416,11.3609 L21.8516,11.3609 L21.8516,24.6729 C21.8516,24.6729 21.9866,28.0049 19.4646,30.5269 C16.9426,33.0489 13.6106,32.9139 13.6106,32.9139 L13.6106,28.4039 C13.6106,28.4039 14.6746,28.4309 15.2236,27.8819 C15.7726,27.3329 15.7456,26.2689 15.7456,26.2689 L15.2066,25.7439 Z"
                              fill="white"
                            />
                            <path
                              d="M22.9297,32.9135 L22.9297,11.3605 L27.4397,11.3605 L27.4397,32.9135 L22.9297,32.9135 Z"
                              fill="white"
                            />
                            <path
                              d="M28.5078,32.9135 L28.5078,16.9505 L33.0178,16.9505 L33.0178,32.9135 L28.5078,32.9135 Z"
                              fill="white"
                            />
                            <path
                              d="M28.5078,15.7935 L28.5078,11.3605 L33.0178,11.3605 L33.0178,15.7935 L28.5078,15.7935 Z"
                              fill="white"
                            />
                            <path
                              d="M34.0967,32.9135 L34.0967,19.6015 C34.0967,19.6015 33.9617,16.2695 36.4837,13.7475 C39.0057,11.2255 42.3377,11.3605 42.3377,11.3605 L42.3377,15.8705 C42.3377,15.8705 41.2737,15.8435 40.7247,16.3925 C40.1757,16.9415 40.2027,18.0055 40.2027,18.0055 L40.7417,18.5305 C40.7417,18.5305 39.6777,18.5575 39.1287,19.1065 C38.5797,19.6555 38.6067,20.7195 38.6067,20.7195 L38.6067,32.9135 L34.0967,32.9135 Z"
                              fill="white"
                            />
                            <path
                              d="M43.4189,32.9135 L43.4189,11.3605 L47.9289,11.3605 L47.9289,32.9135 L43.4189,32.9135 Z"
                              fill="white"
                            />
                            <path
                              d="M15.207,42.9135 C15.207,42.9135 16.271,42.8865 16.82,42.3375 C17.369,41.7885 17.342,40.7245 17.342,40.7245 L17.342,37.3605 L21.852,37.3605 L21.852,41.8435 C21.852,41.8435 21.987,45.1755 19.465,47.6975 C16.943,50.2195 13.611,50.0845 13.611,50.0845 L13.611,45.5745 C13.611,45.5745 14.675,45.6015 15.224,45.0525 C15.773,44.5035 15.746,43.4395 15.746,43.4395 L15.207,42.9135 Z"
                              fill="white"
                            />
                            <path
                              d="M22.9297,50.0845 L22.9297,37.3605 L27.4397,37.3605 L27.4397,50.0845 L22.9297,50.0845 Z"
                              fill="white"
                            />
                            <path
                              d="M28.5078,50.0845 L28.5078,37.3605 L33.0178,37.3605 L33.0178,50.0845 L28.5078,50.0845 Z"
                              fill="white"
                            />
                            <path
                              d="M34.0967,50.0845 L34.0967,37.3605 L38.6067,37.3605 L38.6067,50.0845 L34.0967,50.0845 Z"
                              fill="white"
                            />
                            <path
                              d="M39.6758,50.0845 L39.6758,41.8435 C39.6758,41.8435 39.5408,38.5115 42.0628,35.9895 C44.5848,33.4675 47.9168,33.6025 47.9168,33.6025 L47.9168,38.1125 C47.9168,38.1125 46.8528,38.0855 46.3038,38.6345 C45.7548,39.1835 45.7818,40.2475 45.7818,40.2475 L46.3208,40.7725 C46.3208,40.7725 45.2568,40.7995 44.7078,41.3485 C44.1588,41.8975 44.1858,42.9615 44.1858,42.9615 L44.1858,50.0845 L39.6758,50.0845 Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">bKash</span>
                      </Label>
                    </div>

                    <CollapsibleContent className="p-6 pt-4 border-t border-border">
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
                    <div
                      className="flex items-center space-x-3 p-4 cursor-pointer hover:bg-accent"
                      onClick={() => setPaymentMethod('nagad')}
                    >
                      <RadioGroupItem value="nagad" id="nagad" />
                      <Label
                        htmlFor="nagad"
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="h-6 w-10 flex items-center justify-center">
                          <svg viewBox="0 0 60 60" className="h-6 w-auto">
                            <path
                              d="M5,0 L55,0 C57.7614,0 60,2.23858 60,5 L60,55 C60,57.7614 57.7614,60 55,60 L5,60 C2.23858,60 0,57.7614 0,55 L0,5 C0,2.23858 2.23858,0 5,0 Z"
                              fill="#F9622F"
                            />
                            <path
                              d="M30,15 C36.0751,15 41,19.9249 41,26 C41,32.0751 36.0751,37 30,37 C23.9249,37 19,32.0751 19,26 C19,19.9249 23.9249,15 30,15 Z"
                              fill="white"
                            />
                            <path
                              d="M30,19 C33.866,19 37,22.134 37,26 C37,29.866 33.866,33 30,33 C26.134,33 23,29.866 23,26 C23,22.134 26.134,19 30,19 Z"
                              fill="#F9622F"
                            />
                            <path
                              d="M13,41 L47,41 C48.1046,41 49,41.8954 49,43 L49,45 C49,46.1046 48.1046,47 47,47 L13,47 C11.8954,47 11,46.1046 11,45 L11,43 C11,41.8954 11.8954,41 13,41 Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">Nagad</span>
                      </Label>
                    </div>

                    <CollapsibleContent className="p-6 pt-4 border-t border-border">
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

                  {/* Rocket Option */}
                  <Collapsible
                    open={paymentMethod === 'rocket'}
                    className="border border-border rounded-lg overflow-hidden transition-all duration-200"
                  >
                    <div
                      className="flex items-center space-x-3 p-4 cursor-pointer hover:bg-accent"
                      onClick={() => setPaymentMethod('rocket')}
                    >
                      <RadioGroupItem value="rocket" id="rocket" />
                      <Label
                        htmlFor="rocket"
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="h-6 w-10 flex items-center justify-center">
                          <svg viewBox="0 0 60 60" className="h-6 w-auto">
                            <path
                              d="M5,0 L55,0 C57.7614,0 60,2.23858 60,5 L60,55 C60,57.7614 57.7614,60 55,60 L5,60 C2.23858,60 0,57.7614 0,55 L0,5 C0,2.23858 2.23858,0 5,0 Z"
                              fill="#8C3494"
                            />
                            <path
                              d="M30,10 C38.2843,10 45,16.7157 45,25 C45,33.2843 38.2843,40 30,40 C21.7157,40 15,33.2843 15,25 C15,16.7157 21.7157,10 30,10 Z"
                              fill="white"
                            />
                            <path
                              d="M30,15 C35.5228,15 40,19.4772 40,25 C40,30.5228 35.5228,35 30,35 C24.4772,35 20,30.5228 20,25 C20,19.4772 24.4772,15 30,15 Z"
                              fill="#8C3494"
                            />
                            <path
                              d="M30,20 C32.7614,20 35,22.2386 35,25 C35,27.7614 32.7614,30 30,30 C27.2386,30 25,27.7614 25,25 C25,22.2386 27.2386,20 30,20 Z"
                              fill="white"
                            />
                            <path
                              d="M15,42 L45,42 C46.1046,42 47,42.8954 47,44 L47,48 C47,49.1046 46.1046,50 45,50 L15,50 C13.8954,50 13,49.1046 13,48 L13,44 C13,42.8954 13.8954,42 15,42 Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">Rocket</span>
                      </Label>
                    </div>

                    <CollapsibleContent className="p-6 pt-4 border-t border-border">
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="bg-muted/30 dark:bg-muted p-4 rounded-lg text-center">
                            <QrCode className="h-32 w-32 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">Scan to Pay</p>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">
                                Rocket Payment Instructions:
                              </h4>
                              <ol className="list-decimal list-inside text-sm space-y-1">
                                <li>Open your Rocket app</li>
                                <li>
                                  Scan the QR code or send money to: 01712345678
                                </li>
                                <li>Use reference: {course?.id}</li>
                                <li>
                                  Enter the Transaction ID and your Rocket
                                  number below
                                </li>
                              </ol>
                            </div>

                            <FormField
                              control={form.control}
                              name="rocketNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rocket Number</FormLabel>
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
                              name="rocketTxID"
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
