// thanks to oliver: https://www.youtube.com/@olivierlarose1
'use client'
import { ReactLenis } from 'lenis/react'
import { useTransform, motion, useScroll, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
const projects = [
  {
    title: 'Daily Lecture Update',
    description:
      'Originally hailing from Austria, Berlin-based photographer Matthias Leindinger is a young creative brimming with talent and ideas.',
    src: 'rock.jpg',
    link: 'https://images.unsplash.com/photo-1605106702842-01a887a31122?q=80&w=500&auto=format&fit=crop',
    color: '#16357F',
  },
  {
    title: 'Must Complete On Time',
    description:
      'This is a story on the border between reality and imaginary, about the contradictory feelings that the insularity of a rocky, arid, and wild territory provokes”—so French photographer Clément.',
    src: 'tree.jpg',
    link: 'https://images.unsplash.com/photo-1605106250963-ffda6d2a4b32?w=500&auto=format&fit=crop&q=60',
    color: '#53CD99',
  },
  {
    title: 'Daily Support',
    description:
      'Though he views photography as a medium for storytelling, Zissou’s images don’t insist on a narrative. Both crisp and ethereal.',
    src: 'water.jpg',
    link: 'https://images.unsplash.com/photo-1605106901227-991bd663255c?w=500&auto=format&fit=crop',
    color: '#6A177D',
  },
  {
    title: 'Exam After Ending',
    description:
      'The coastlines of Denmark are documented in tonal colors in a pensive new series by Danish photographers Ulrik Hasemann and Mathias Svold; an ongoing project investigating how humans interact with and disrupt the Danish coast.',
    src: 'house.jpg',
    link: 'https://images.unsplash.com/photo-1605106715994-18d3fecffb98?w=500&auto=format&fit=crop&q=60',
    color: '#02a95c',
  },
  {
    title: 'Internship',
    description:
      'Dutch photographer Mark Rammers has shared with IGNANT the first chapter of his latest photographic project, ‘all over again’—captured while in residency at Hektor, an old farm in Los Valles, Lanzarote.',
    src: 'cactus.jpg',
    link: 'https://images.unsplash.com/photo-1506792006437-256b665541e2?w=500&auto=format&fit=crop',
    color: '#5428B8',
  },
]
export function BootcampSpeciality() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })
  return (
    <ReactLenis root>
      <main ref={container} className="text-foreground bg-background">
        <>
          <section className="w-full py-12 grid place-content-center text-center ">
            <h2 className="2xl:text-4xl text-4xl px-8 mb-6 font-semibold  text-center tracking-tight leading-[120%]">
              Speciality of The Bootcamp
            </h2>
            <p className="text-muted-foreground text-lg">
              Detail information about course
            </p>
          </section>
        </>

        <section className="w-full ">
          {projects.map((project, i) => {
            const targetScale = 1 - (projects.length - i) * 0.05
            return (
              <Card
                key={`p_${i}`}
                i={i}
                url={project?.link}
                src={project?.src}
                title={project?.title}
                color={project?.color}
                description={project?.description}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            )
          })}
        </section>
      </main>
    </ReactLenis>
  )
}

interface CardProps {
  i: number
  title: string
  description: string
  src: string
  url: string
  color: string
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
}
export const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      ref={container}
      className="min-h-[600] flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={`flex flex-col relative -top-[25%] h-[450px] w-[70%] rounded-md p-10 origin-top`}
      >
        <h3 className="text-3xl text-left font-semibold text-white">{title}</h3>
        <div className={`flex h-full mt-5 gap-10`}>
          <div className={`w-[40%] relative top-[10%]`}>
            <p className="text-white">{description}</p>
          </div>

          <div
            className={`relative w-[60%] h-full rounded-lg overflow-hidden `}
          >
            <motion.div
              className={`w-full h-full`}
              style={{ scale: imageScale }}
            >
              <Image fill src={url} alt="image" className="object-cover" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
