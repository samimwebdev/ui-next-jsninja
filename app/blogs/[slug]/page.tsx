import React from 'react'
import { Calendar, Tag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Blog = {
  slug: string
  Title: string
  Intro: string
  Image: string
  created_at: string
  Tags: string
  Description: string
}
// Static data for the blogs
const data: Blog[] = [
  {
    slug: 'best-places-to-eat-in-hongkong',
    Title: 'Best places to eat in Hong Kong',
    Intro:
      'Discover the top spots for dining in the vibrant city of Hong Kong.',
    Image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png',
    created_at: '2023-09-20',
    Tags: 'Travel, Food, Asia',
    Description:
      '<p>Detailed description about food places in Hong Kong...</p>',
  },
  {
    slug: 'exploring-new-york',
    Title: 'Exploring New York City',
    Intro: 'A guide to the must-see attractions in the Big Apple.',
    Image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png',
    created_at: '2023-08-15',
    Tags: 'Travel, City, USA',
    Description: '<p>Detailed description about exploring New York City...</p>',
  },
  {
    slug: 'hiking-in-the-alps',
    Title: 'Hiking in the Alps',
    Intro:
      'Everything you need to know about trekking through the stunning Alps.',
    Image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1726390892/Black_Minimalist_Website_Mockup_Instagram_Post_j5ca4p.png',
    created_at: '2023-07-05',
    Tags: 'Adventure, Hiking, Nature',
    Description: '<p>Detailed description about hiking in the Alps...</p>',
  },
]

const Page = () => {
  const Cards = () => {
    return (
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item: Blog, index: number) => (
          <Link href="/blogs/1" key={index}>
            <article className="group overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 bg-card-client border border-border">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={item?.Image}
                  layout="fill"
                  objectFit="cover"
                  alt="blog"
                  className="rounded-t-2xl object-cover transition duration-300 group-hover:opacity-75 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-yellow-500" />
                  <time className="text-gray-300">
                    {new Date(item?.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-black dark:text-white line-clamp-2 group-hover:text-yellow-500 transition duration-300">
                  {item?.Title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-800 dark:text-white leading-relaxed">
                  {item?.Intro}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item?.Tags?.split(',').map(
                    (tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1 bg-gray-800 text-gray-300"
                      >
                        <Tag className="w-3 h-3" />
                        {tag.trim()}
                      </span>
                    )
                  )}
                </div>
                <div className="mt-4 flex items-center text-yellow-500 font-medium">
                  <span className="text-sm group-hover:underline">
                    Read more
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition duration-300" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <div
        className="bg-cover bg-center text-center overflow-hidden"
        style={{
          minHeight: '500px',
          backgroundImage: `url('${data[0].Image}')`,
        }}
        title="Woman holding a mug"
      ></div>
      <div className="max-w-7xl mx-auto">
        <div className="mt-3 bg-white shadow-sm rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
          <div className="bg-card-client relative  top-0 -mt-32 p-5 sm:p-10">
            <h1 className="text-white font-bold text-3xl mb-2">
              {data[0].Title}
            </h1>
            <p className="text-white/90 text-xs mt-2">
              Written By:
              <a
                href="javascript:void(0)"
                className="text-white/90 font-bold transition duration-500 ease-in-out"
              >
                {' '}
                Flash UI
              </a>
            </p>
            <p className="text-base leading-8 my-5">{data[0].Intro}</p>
            <div className="dark:text-black">
              <h3 className="text-2xl font-bold my-5">
                #1. What is Lorem Ipsum?
              </h3>

              <p className="text-base leading-8 my-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book.
              </p>

              <blockquote className="border-l-4 text-base italic leading-8 my-5 p-5 text-button">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s
              </blockquote>

              <p className="text-base leading-8 my-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="flex gap-2">
              {data[0].Tags.split(',').map((tag, tagIndex) => (
                <a
                  key={tagIndex}
                  href="#"
                  className="text-sm text-gradient font-medium hover:text-text transition duration-500 ease-in-out"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Blogs */}
      <div className="pb-24">
        <h1 className="h1 text-center text-2xl my-10">Recommended Blogs</h1>
        <Cards />
      </div>
    </div>
  )
}

export default Page
