import type { Testimonial } from './testimonial-types'

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Daniel S.',
    handle: '@daniel_s',
    avatar: '/placeholder.svg?height=40&width=40',
    rating: 5,
    text: "I just signed up and created my first website in minutes - this is way better than I was expecting! The product is a chef's kiss!",
    verified: true,
  },
  {
    id: '2',
    name: 'Marco E.',
    handle: '@marcoet',
    avatar: '/placeholder.svg?height=40&width=40',
    rating: 5,
    text: "An AI-powered website builder that's quick, customizable, and helps drive organic traffic! Sign up if you want to try the page builder.",
    verified: true,
  },
  {
    id: '3',
    name: 'Sarah L.',
    handle: '@sarahl',
    avatar: '/placeholder.svg?height=40&width=40',
    rating: 5,
    text: 'The product has a perfect balance between customization and simplicity. Every update just adds more value.',
    verified: true,
  },
  // Add more testimonials as needed...
]
