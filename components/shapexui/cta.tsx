'use client'

import React from 'react'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Video, Code, RefreshCw, FileCheck } from 'lucide-react'

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '24px 24px',
          }}
        ></div>
      </div>
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-white">
            Unlock the Power of{' '}
            <span className="text-yellow-400 relative inline-block">
              Javascript Bootcamp
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 rounded-full"></span>
            </span>
          </h2>
          <p className="max-w-xl mx-auto mt-6 text-lg leading-relaxed text-gray-200">
            Learn Programming Problem Solving, Logic Development and Prepare for
            Future
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Video className="h-8 w-8" />,
              title: '400+ videos',
              text: 'Tailor every component to fit your brand',
            },
            {
              icon: <Code className="h-8 w-8" />,
              title: 'Programming and Problem Solving',
              text: 'Optimized for all devices',
            },
            {
              icon: <RefreshCw className="h-8 w-8" />,
              title: 'Regular Updates',
              text: 'Stay ahead with new features',
            },
            {
              icon: <FileCheck className="h-8 w-8" />,
              title: '20+ projects and assessments',
              text: 'Comprehensive guides for easy setup',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex items-start rounded-xl p-6 backdrop-blur-sm bg-white/10 border border-white/20 hover:border-yellow-400/50 hover:bg-white/15 transition-all duration-300 shadow-lg"
            >
              <div className="p-3 rounded-lg bg-yellow-400/20 text-yellow-400">
                {feature.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-300">{feature.text}</p>
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto px-12 py-7 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 font-bold rounded-full hover:from-yellow-300 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-purple-700 transition duration-300 shadow-lg shadow-yellow-500/30 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Enroll Now
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction
