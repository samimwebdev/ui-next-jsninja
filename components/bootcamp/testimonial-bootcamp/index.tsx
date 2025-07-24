import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Marquee from '@/components/ui/marquee'
import { ReviewLayoutContentSection } from '@/types/bootcamp-page-types'
import Link from 'next/link'
import React, { ComponentProps } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Ayesha Rahman',
    designation: 'Frontend Developer',
    company: 'WebWorks',
    testimonial:
      'The JavaScript Bootcamp gave me the confidence and skills to land my first developer job. The hands-on projects and supportive mentors made all the difference!',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
  },
  {
    id: 2,
    name: 'Tanvir Hasan',
    designation: 'Junior Engineer',
    company: 'CodeCraft',
    testimonial:
      'I loved the real-world projects and the interactive classes. The curriculum is up-to-date and the instructors are always ready to help.',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    id: 3,
    name: 'Mehedi Islam',
    designation: 'Student',
    company: 'University of Dhaka',
    testimonial:
      'As a complete beginner, I was nervous, but the bootcamp structure made learning JavaScript and React fun and approachable. Highly recommended!',
    avatar: 'https://randomuser.me/api/portraits/men/13.jpg',
  },
  {
    id: 4,
    name: 'Farzana Akter',
    designation: 'Freelancer',
    company: 'Upwork',
    testimonial:
      "The bootcamp's focus on practical skills and portfolio building helped me secure freelance projects right after graduation.",
    avatar: 'https://randomuser.me/api/portraits/women/14.jpg',
  },
  {
    id: 5,
    name: 'Rafiq Chowdhury',
    designation: 'React Developer',
    company: 'TechNova',
    testimonial:
      'The mentorship and peer support were outstanding. I learned more in 12 weeks than in a year of self-study.',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
  {
    id: 6,
    name: 'Sumaiya Sultana',
    designation: 'Intern',
    company: 'StartupHub',
    testimonial:
      'The job placement support and career guidance were invaluable. I landed an internship within a month of finishing the bootcamp!',
    avatar: 'https://randomuser.me/api/portraits/women/16.jpg',
  },
]

const TestimonialBootcamp: React.FC<{ data: ReviewLayoutContentSection }> = ({
  data,
}) => (
  <div className=" flex justify-center items-center py-12">
    <div className="h-full w-full text-center">
      <div className="mb-12">
        <h2 className="text-4xl md:text-4xl font-bold tracking-tight px-6">
          - Testimonials + JavaScript Bootcamp Success Stories
        </h2>
        <p className="text-muted-foreground text-lg">
          - What about the people who have already taken the course? Heres what
          - they have to say + Hear from graduates who transformed their careers
          through our JavaScript Bootcamp.
        </p>
      </div>
      <div className="relative">
        <div className="z-10 absolute left-0 inset-y-0 w-[15%] bg-gradient-to-r from-background to-transparent" />
        <div className="z-10 absolute right-0 inset-y-0 w-[15%] bg-gradient-to-l from-background to-transparent" />
        <Marquee pauseOnHover className="[--duration:20s]">
          <TestimonialList />
        </Marquee>
        <Marquee pauseOnHover reverse className="mt-0 [--duration:20s]">
          <TestimonialList />
        </Marquee>
      </div>
    </div>
  </div>
)

const TestimonialList = () =>
  testimonials.map((testimonial) => (
    <div
      key={testimonial.id}
      className="min-w-96 max-w-sm bg-accent rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.designation}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="#" target="_blank">
            <TwitterLogo className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <p className="mt-5 text-[17px]">{testimonial.testimonial}</p>
    </div>
  ))

const TwitterLogo = (props: ComponentProps<'svg'>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>X</title>
    <path
      fill="currentColor"
      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
    />
  </svg>
)

export default TestimonialBootcamp
