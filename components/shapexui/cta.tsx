'use client'

import React from 'react'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const CallToAction = () => {
  return (
    <section className="py-12  relative overflow-hidden">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Unlock the Power of{' '}
            <span className="text-yellow-400">Javascript Bootcamp</span>
          </h2>
          <p className="max-w-xl mx-auto mt-6 text-lg leading-relaxed text-muted-foreground">
            Learn Programming Problem Solving, Logic Development and Prepare for
            Future
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: '400+ videos',
              text: 'Tailor every component to fit your brand',
            },
            {
              title: 'Programming and Problem Solving',
              text: 'Optimized for all devices',
            },
            { title: 'Regular Updates', text: 'Stay ahead with new features' },
            {
              title: '20+ projects and assessments',
              text: 'Comprehensive guides for easy setup',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start rounded-lg p-3 backdrop-blur-sm border"
            >
              <div className="ml-4">
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-1.5 text-sm ">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto mt-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto px-12 py-7 bg-yellow-400 text-purple-900 font-bold rounded-full hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-purple-700 transition duration-300"
            >
              Enroll Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction
