'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'

export default function GenericPage() {
  return (
    <div className="min-h-screen bg-background text-foreground max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover a world of possibilities with our comprehensive suite of
            tools and resources designed to help you achieve your goals.
          </p>
        </section>

        {/* Overview Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Platform Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">For Developers</h3>
              <p className="text-muted-foreground">
                Access powerful tools and APIs to build robust applications. Our
                platform provides everything you need to create exceptional user
                experiences.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">For Businesses</h3>
              <p className="text-muted-foreground">
                Scale your operations with enterprise-grade solutions. Our
                business tools help you streamline processes and boost
                productivity.
              </p>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Key Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Modern Architecture',
                description:
                  'Built with the latest technologies for optimal performance',
              },
              {
                title: 'Scalable Solutions',
                description:
                  'Grows with your needs, from startup to enterprise',
              },
              {
                title: 'Security First',
                description:
                  'Enterprise-grade security and compliance measures',
              },
              {
                title: 'Real-time Analytics',
                description:
                  'Comprehensive insights into your application metrics',
              },
              {
                title: 'Global CDN',
                description: 'Lightning-fast content delivery worldwide',
              },
              {
                title: '24/7 Support',
                description:
                  'Round-the-clock expert assistance when you need it',
              },
            ].map((feature, index) => (
              <Card className="p-6" key={index}>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Getting Started
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              Begin your journey with our platform in three simple steps:
            </p>
            <ol className="space-y-4 mt-4">
              <li className="text-lg">
                <span className="font-semibold">Create an Account</span> - Sign
                up for free and explore our basic features
              </li>
              <li className="text-lg">
                <span className="font-semibold">Configure Your Workspace</span>{' '}
                - Set up your environment with our guided tutorials
              </li>
              <li className="text-lg">
                <span className="font-semibold">Start Building</span> - Use our
                documentation and templates to create your first project
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
