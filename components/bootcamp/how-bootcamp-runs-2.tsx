'use client'

import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { useRef } from 'react'
import { fadeInUp, cardVariants, iconVariants } from '@/lib/animation'

import { Rocket, Laptop, Search, Video } from 'lucide-react'

export const courseCards = [
  {
    icon: Rocket,
    title: 'Module Release Time',
    content:
      'Everyday we will be given a module/practice task. Videos will be released at 10:00pm. Smart students may trick our system to get module access 2 hours earlier than everyone else',
    gradient:
      'from-purple-500/20 to-blue-500/20 dark:from-purple-500/10 dark:to-blue-500/10',
  },
  {
    icon: Laptop,
    title: 'Watch Time Duration',
    content:
      'A full module has approximately 10 videos (each video 12-14 min). You have to spend 4-5 hours watching, practicing the contents. We recommend allocating 6-8 hours everyday for this course.',
    gradient:
      'from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10',
  },
  {
    icon: Search,
    title: 'Search Similar Topic Online',
    content:
      'Keep 1-2 hours everyday to clear our doubts from google, or using our support system. If you do not have any doubts, we recommend you search the similar topic of the module online',
    gradient:
      'from-cyan-500/20 to-teal-500/20 dark:from-cyan-500/10 dark:to-teal-500/10',
  },
  {
    icon: Video,
    title: 'Live Conceptual Session',
    content:
      'You will have a practice day after every 2-4 modules. And there will be a conceptual session on that practice day. We highly recommend our students to join the live conceptual session.',
    gradient:
      'from-teal-500/20 to-purple-500/20 dark:from-teal-500/10 dark:to-purple-500/10',
  },
]

export default function Page() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <LeftSection />
      <RightSection />
    </div>
  )
}

function LeftSection() {
  return (
    <div className="lg:w-1/2 lg:fixed lg:h-screen p-8 lg:p-16 flex flex-col justify-center">
      <motion.h1
        className="text-4xl lg:text-6xl font-bold mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        How Will This Course Work<span className="text-primary">_</span>?
      </motion.h1>
      <motion.p
        className="text-lg text-muted-foreground mb-8"
        {...fadeInUp}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        This course guides you from basics to mastering the MERN stack with
        step-by-step lessons, hands-on projects, and assessments.
      </motion.p>
      <motion.div {...fadeInUp} transition={{ delay: 0.4, duration: 0.5 }}>
        <EnrollButton />
      </motion.div>
    </div>
  )
}

function RightSection() {
  return (
    <div className="lg:w-1/2 lg:ml-[50%] min-h-screen">
      <div className="p-8 lg:p-16 space-y-8">
        {courseCards.map((card, index) => (
          <CardWithAnimation key={index} index={index} {...card} />
        ))}
      </div>
    </div>
  )
}

function EnrollButton() {
  return (
    <Button
      size="lg"
      className="bg-primary hover:bg-primary/90 relative overflow-hidden group"
    >
      <span className="relative z-10">Enroll Now</span>
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </Button>
  )
}

function CardWithAnimation({ icon: Icon, title, content, gradient, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={index}
    >
      <Card
        className={`group relative overflow-hidden backdrop-blur-sm bg-gradient-to-br ${gradient} border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}
      >
        <CardShineEffect />
        <CardHeader className="flex flex-row items-center gap-4 relative z-10">
          <motion.div
            variants={iconVariants}
            className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm"
          >
            <Icon className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </CardHeader>
        <CardContent className="text-muted-foreground relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.2 + 0.4 }}
          >
            {content}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CardShineEffect() {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
      initial={{ x: '-100%' }}
      whileHover={{ x: '100%' }}
      transition={{ duration: 1 }}
    />
  )
}
