'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  User2,
  Code2,
  FileJson,
  MessagesSquare,
  Github,
  Radio,
  MonitorPlay,
  FileCode,
  Binary,
} from 'lucide-react'

interface CourseCard {
  icon: React.ElementType
  title: string
  description: string
  color: string
}

const courses: CourseCard[] = [
  {
    icon: User2,
    title: 'গল্পের আত্মারাম',
    description:
      'বেসিক লেভেল থেকে - প্রফেশনাল লেভেলের কোর্স তৈরি করতে গেলে আপনার এই সকল বিষয়গুলো নিয়ে সুস্পষ্ট ধারণা অবশ্যই থাকতে হবে।',
    color: 'emerald',
  },
  {
    icon: Code2,
    title: 'বেসিক প্রোগ্রামিং',
    description: 'প্রতিটি মাধ্যমে প্রাথমিক এবং প্রয়োজনীয় হবে।',
    color: 'orange',
  },
  {
    icon: FileJson,
    title: 'বেসিক ডিজাইন',
    description: 'ডিজাইন সম্পর্কে প্রাথমিক এবং প্রয়োজনীয় হবে।',
    color: 'blue',
  },
  {
    icon: MessagesSquare,
    title: 'টেকনিক্যাল ডিজাইন',
    description: 'টেকনিক্যাল ডিজাইনের সম্পর্কে প্রাথমিক ধারণা থাকতে হবে।',
    color: 'indigo',
  },
  {
    icon: FileCode,
    title: 'জাভানি অ্যাসাইনমেন্ট',
    description: 'জাভানি অ্যাসাইনমেন্ট সম্পর্কে ধারণা থাকতে হবে।',
    color: 'yellow',
  },
  {
    icon: Binary,
    title: 'ফরম অ্যাসাইনমেন্ট',
    description: 'ফরম অ্যাসাইনমেন্ট সম্পর্কে ধারণা থাকতে হবে।',
    color: 'pink',
  },
  {
    icon: MonitorPlay,
    title: 'অ্যাসাইনমেন্ট ওয়ান',
    description:
      'অনুগ্রহপূর্বক অনুসরণের জন্য (ওয়ান) সম্পর্কে প্রাথমিক ধারণা থাকতে হবে।',
    color: 'amber',
  },
  {
    icon: Github,
    title: 'বেসিক গিট ও গিটহাব',
    description: 'গিট ও গিটহাব সম্পর্কে প্রাথমিক ধারণা থাকতে হবে।',
    color: 'slate',
  },
  {
    icon: Radio,
    title: 'ডিজম কোড এডিটিং',
    description: 'ডিজম কোড এডিটিং সম্পর্কে কিছুটা প্রাথমিক ধারণা হবে।',
    color: 'cyan',
  },
]

export function CourseGrid() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="w-full md:w-1/3">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LwEFCCGluGzJSRQtZ0K5URp7GLON0J.png"
            alt="Course Learning Path"
            width={200}
            height={200}
            className="mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            কোর্স করতে যা জানতে হবে
          </h1>
          <p className="text-muted-foreground">
            এই কোর্সটি একজনকে বিনিয়োগের জন্য নয়। কোর্সটি করতে চলে প্রাথমিক
            বিষয়গুলো সম্পর্কে আপনার ধারণা থাকতে হবে। এই কোর্স করে চেষ্টা করে
            আপনার বিষয়গুলো আলোচনা যদি না থাকেন, তাহলে রেকমেন্ডেড লিঙ্ক থেকে
            শিখে নিতে পারবেন।
          </p>
        </div>
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const Icon = course.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-${course.color}-100 flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 text-${course.color}-500`} />
                  </div>
                  <h3 className="font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    এখনই শেখা শুরু
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
