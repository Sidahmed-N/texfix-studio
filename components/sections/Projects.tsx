'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import AnimatedBadge from '@/components/ui/animated-badge'

const projects = [
  {
    title: 'FactoryIQ',
    subtitle: 'AI-Powered Inventory System',
    type: 'Enterprise Software',
    // dark enterprise dashboard on MacBook
    image: '/project1.png',
  },
  {
    title: 'Konsole',
    subtitle: 'Gaming Café Management Platform',
    type: 'Custom Business Software',
    image: '/project2.jpg',
  },
  {
    title: 'Tadj Alsihha',
    subtitle: 'Clinic Booking & Portfolio',
    type: 'Healthcare Web Platform',
    // clean medical/clinic web interface on screen
    image: '/project3.jpg',
  },
  {
    title: 'Gloss',
    subtitle: 'Beauty Booking Platform',
    type: 'Booking & Scheduling System',
    // beauty app UI on iPhone mockup
    image: '/project4.png',
  },
]

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const thumbnail = thumbnailRef.current
    if (!thumbnail) return
    const container = containerRef.current
    if (!container) return

    let cleanup: (() => void) | undefined

    import('gsap').then(({ gsap }) => {
      gsap.set(thumbnail, { scale: 0, xPercent: -50, yPercent: -50 })

      const xTo = gsap.quickTo(thumbnail, 'x', { duration: 0.4, ease: 'power3.out' })
      const yTo = gsap.quickTo(thumbnail, 'y', { duration: 0.4, ease: 'power3.out' })

      let firstMove = true
      const onMouseMove = (e: MouseEvent) => {
        if (firstMove) {
          gsap.set(thumbnail, { x: e.clientX, y: e.clientY })
          firstMove = false
        }
        xTo(e.clientX)
        yTo(e.clientY)
      }

      const onMouseLeave = () => {
        gsap.to(thumbnail, { scale: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
      }

      container.addEventListener('mousemove', onMouseMove)
      container.addEventListener('mouseleave', onMouseLeave)

      const rows = container.querySelectorAll<HTMLDivElement>('.project-row')
      rows.forEach((row, index) => {
        row.addEventListener('mouseenter', () => {
          gsap.to(thumbnail, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
          gsap.to(thumbnailsRef.current, {
            yPercent: -100 * index,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        })
      })

      cleanup = () => {
        container.removeEventListener('mousemove', onMouseMove)
        container.removeEventListener('mouseleave', onMouseLeave)
      }
    })

    return () => { cleanup?.() }
  }, [])

  return (
    <section id="projects" className="bg-black py-24 px-6">
      {/* Section header */}
      <div className="max-w-5xl mx-auto mb-16 text-center">
        <div className="flex justify-center mb-2">
          <AnimatedBadge text="Selected Work" color="#3B82F6" />
        </div>
        <h2 className="font-display text-4xl font-medium uppercase">
          <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">Projects We&apos;re</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700">Proud Of</span>
        </h2>
        <p className="mt-4 text-zinc-400 text-sm max-w-xl mx-auto">
          A curated selection of software products we&apos;ve designed and engineered — from MVPs to full-scale enterprise platforms.
        </p>
      </div>

      {/* Project list + floating thumbnail */}
      <div className="max-w-5xl mx-auto relative" ref={containerRef}>
        {/* Project rows */}
        <div className="flex flex-col w-full">
          {projects.map((project, i) => (
            <a
              key={i}
              href="/work"
              className="project-row group w-full flex items-center justify-between px-8 py-10 border-t border-white/10 cursor-pointer transition-opacity duration-500 hover:opacity-50 last:border-b last:border-white/10"
            >
              <div className="flex flex-col transition-transform duration-500 ease-in-out group-hover:-translate-x-4">
                <h3
                  className="text-3xl md:text-4xl font-medium text-white"
                  style={{ fontVariationSettings: '"wght" 500' }}
                >
                  {project.title}
                </h3>
                <span className="text-zinc-500 text-xs mt-1">{project.subtitle}</span>
              </div>
              <span className="text-zinc-400 text-sm tracking-wide transition-transform duration-500 ease-in-out group-hover:translate-x-4">
                {project.type}
              </span>
            </a>
          ))}
        </div>

        {/* Floating thumbnail */}
        <div
          ref={thumbnailRef}
          className="hidden [@media(pointer:fine)]:block fixed top-0 left-0 w-[22rem] h-[14rem] overflow-hidden pointer-events-none z-50 rounded-xl"
          style={{ transformOrigin: 'center center', transform: 'scale(0) translate(-50%, -50%)' }}
        >
          {projects.map((project, i) => (
            <div
              key={i}
              className="w-full h-full flex-shrink-0 relative"
              ref={(el) => { if (el) thumbnailsRef.current[i] = el }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="352px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

