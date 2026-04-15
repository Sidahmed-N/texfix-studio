'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { AnimatedShinyButton } from '@/components/ui/animated-shiny-button'

const TITLE_LINES = [
  ['IDEAS', 'THAT'],
  ['BECAME'],
  ['PRODUCTS.'],
]

const ROW_CLOSED = 88
const ROW_OPEN   = 700

const projects = [
  {
    title: 'FactoryIQ',
    subtitle: 'AI-Powered Inventory System',
    location: 'Guelma, Algeria',
    type: 'Enterprise Software',
    tags: ['Next.js', 'Python', 'PostgreSQL', 'OpenAI'],
    details: 'FactoryIQ is a stock management platform built for a soda manufacturing facility. At its core is an AI module that monitors every batch coming off the production line, compares the recorded output against the expected count, and automatically corrects the inventory in real time — adding units when a batch runs short and removing the excess when it runs over. The dashboard gives warehouse and distribution staff a live view of current stock across all product lines, with a full history of every correction the system has made and why. Managers can set thresholds, review flagged batches, and export reports at any time. Everything is designed to keep the numbers accurate without anyone having to manually recount a single crate.',
    image: '/project1.png',
  },
  {
    title: 'Konsole',
    subtitle: 'Gaming Café Management Platform',
    location: 'Worldwide',
    type: 'SaaS Platform',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    details: 'Konsole is a SaaS platform built for gaming café owners who need a single tool to run their entire operation. It handles real-time session timing per machine, POS billing, loyalty point tracking, staff shift management and revenue reporting. Owners get a clean dashboard showing which machines are active, how long each session has been running, and what the day looks like financially. Because it runs in the browser, it works on any device without installation. Konsole is built to scale as a multi-tenant product, meaning each café gets its own workspace, its own data and its own settings while sharing the same infrastructure.',
    image: '/project2.jpg',
  },
  {
    title: 'Tadj Alsihha',
    subtitle: 'Clinic Booking & Portfolio',
    location: 'Biskra, Algeria',
    type: 'Healthcare Web Platform',
    tags: ['Next.js', 'Tailwind CSS', 'Prisma', 'Vercel'],
    details: 'Tadj Alsihha is a web platform built for a private medical clinic that needed both a professional online presence and a way to let patients book appointments without calling. The site presents the clinic, its doctors and its range of services in a clean and trustworthy layout. The booking system lets patients pick a doctor, choose an available time slot and confirm their appointment in a few taps. On the clinic side, staff can view the full schedule, manage appointments and block off unavailable times from a simple admin interface. The goal was to reduce the volume of phone calls the clinic was handling daily while giving patients a more convenient experience.',
    image: '/project3.jpg',
  },
  {
    title: 'Gloss',
    subtitle: 'Beauty Booking Platform',
    location: 'London, UK',
    type: 'Booking & Scheduling System',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Prisma'],
    details: 'Gloss is a booking and business management platform built for beauty salons and independent artists in London. Clients can browse services, check real-time availability and book appointments directly through the platform. On the business side, owners manage their full calendar, assign bookings to specific staff members, maintain client profiles with visit history and preferences, and set up automated reminders to reduce no-shows. Deposits are handled through Stripe at the time of booking, which protects the business from last-minute cancellations. Gloss is designed to feel premium on the client side and practical on the owner side, turning what used to be a phone and notebook operation into a fully digital workflow.',
    image: '/project4.png',
  },
  {
    title: 'Agrovipal',
    subtitle: 'Agricultural Fertiliser Company Website',
    location: 'Boumerdes, Algeria',
    type: 'Corporate Website',
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    details: 'Agrovipal is a company based in Boumerdes, Algeria, specialising in the import, distribution and promotion of agricultural fertilisers. Their old website had a broken layout in several areas and a very basic design that no longer reflected who they were. We rebuilt it from scratch as a clean, modern corporate site that clearly communicates what the company does, who they work with and what they stand for. The new site features a full product catalogue where each fertiliser is presented with its details, specifications and intended use, making it easy for farmers and distributors to find what they need. A contact section lets potential partners and clients reach the team directly, turning the website from a static page into an active business tool.',
    image: '/project5.jpg',
  },
  {
    title: 'Lumea',
    subtitle: 'Skincare E-Commerce Store',
    location: 'Madrid, Spain',
    type: 'E-Commerce',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
    details: 'Lumea is an e-commerce store built for a skincare brand based in Madrid. The site is designed to feel as premium as the products it sells, with a clean layout, high-quality product photography and smooth interactions throughout. Customers can browse the full product range, read ingredient breakdowns and usage guides for each item, add products to their cart and check out securely through Stripe. The store includes a skincare routine builder that helps customers figure out which products are right for their skin type, increasing both engagement and average order value. On the backend, the brand manages inventory, processes orders and tracks revenue from a simple admin panel without needing any technical knowledge.',
    image: '/project6.jpg',
  },
  {
    title: 'Real',
    subtitle: 'Real Estate Agency Website & Booking',
    location: 'Lyon, France',
    type: 'Real Estate Platform',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS'],
    details: 'Real is a website built for a real estate agency in Lyon. The platform serves as the agency\'s primary client-facing tool, presenting their portfolio of properties including houses, apartments and new development projects in a clean and browsable layout. Each listing comes with a full detail page covering photos, floor plans, key specs and pricing. Clients who are interested in a property can book a visit directly through the site, picking a date and time that works for them. The agency receives the request, confirms the appointment and manages their full visit calendar from the admin dashboard. The booking system replaces back-and-forth phone calls with a structured process that saves time on both sides and reduces the chance of missed appointments. The site is also built with SEO in mind, helping the agency attract buyers and renters who are actively searching for properties in the region.',
    image: '/project7.jpg',
  },
  {
    title: 'Luman',
    subtitle: 'Digital Marketing Agency Website',
    location: 'Paris, France',
    type: 'Agency Website',
    tags: ['Framer'],
    details: 'Luman is a website built for a digital marketing agency in Paris. The site is their main showcase, presenting who they are, the services they offer across social media, paid advertising, branding and content, and a selection of their past work. The design is bold and confident, matching the standard the agency holds itself to. Visitors can browse their portfolio of past campaigns, read about each service in clear terms and get in touch directly through the site. Built entirely in Framer with no custom code, the result is a fast, polished and easy to update website that gives the agency a strong first impression online.',
    image: '/project8.jpg',
  },
  {
    title: 'Richmen Accessoires',
    subtitle: 'Accessories E-Commerce Store',
    location: 'Biskra, Algeria',
    type: 'E-Commerce',
    tags: ['WordPress', 'Elementor', 'WooCommerce'],
    details: 'Richmen Accessoires is an e-commerce store built for an accessories shop in Biskra. The site presents the brand\'s full catalogue across different collections, letting customers browse products, view detailed photos and descriptions, and place orders directly through the store. WooCommerce powers the shopping experience — customers add items to their cart, go through a straightforward checkout and receive order confirmation automatically. The design was built with Elementor to match the brand\'s style, keeping the focus on the products and making the path from discovery to purchase as simple as possible.',
    image: '/project9.png',
  },
  {
    title: 'StockFlow',
    subtitle: 'Stock Management Desktop App',
    location: 'Algeria',
    type: 'Desktop Application',
    tags: ['Electron', 'React', 'TypeScript', 'SQLite'],
    details: 'StockFlow is an offline desktop application built for wholesalers in the Algerian market. It gives business owners a complete tool to run their operation from one place — managing suppliers, tracking stock levels, handling client records, generating invoices, logging expenses and monitoring purchases all within a single interface. The app works entirely offline, meaning it runs reliably without an internet connection, which was a core requirement for the businesses it was built for. It was developed in three languages, Arabic, English and French, with full right-to-left support for Arabic, making it accessible to a wide range of users across the country. StockFlow is built around the real workflows of Algerian wholesalers, with features and terminology that match how they actually operate rather than a generic international template.',
    image: '/project10.jpeg',
  },
]

export default function WorkPage() {
  let wordIndex = 0

  const [openProject, setOpenProject] = useState<number | null>(null)
  const openProjectRef = useRef<number | null>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement[]>([])

  const handleProjectClick = (i: number) => {
    const next = openProject === i ? null : i
    setOpenProject(next)
    openProjectRef.current = next
    rowRefs.current.forEach((row, j) => {
      if (!row) return
      let targetHeight: number
      if (next === null || j !== next) {
        targetHeight = ROW_CLOSED
      } else {
        // Measure natural height: temporarily set to auto, read scrollHeight, restore
        row.style.height = 'auto'
        targetHeight = row.scrollHeight
        row.style.height = `${ROW_CLOSED}px`
      }
      gsap.to(row, {
        height: targetHeight,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => ScrollTrigger.refresh(),
      })
    })
  }

  useEffect(() => {
    const thumbnail = thumbnailRef.current
    if (!thumbnail) return

    // Skip on touch/mobile — no cursor to follow
    if (!window.matchMedia('(pointer: fine)').matches) return

    gsap.set(thumbnail, { scale: 0, xPercent: -50, yPercent: -50 })

    const xTo = gsap.quickTo(thumbnail, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(thumbnail, 'y', { duration: 0.4, ease: 'power3.out' })

    const container = containerRef.current
    if (!container) return

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

    const rows = container.querySelectorAll<HTMLDivElement>('.project-row-header')
    const rowHandlers: Array<[HTMLDivElement, () => void]> = []
    rows.forEach((row, index) => {
      const fn = () => {
        gsap.to(thumbnail, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
        gsap.to(thumbnailsRef.current, {
          yPercent: -100 * index,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      row.addEventListener('mouseenter', fn)
      rowHandlers.push([row, fn])
    })

    return () => {
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      rowHandlers.forEach(([row, fn]) => row.removeEventListener('mouseenter', fn))
    }
  }, [])

  return (
    <main className="min-h-screen bg-transparent text-white">
      <section className="relative flex items-start px-8 md:px-16 lg:px-28 pt-44 pb-24">
        {/* Blue bubble */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Left: title */}
        <div className="w-full max-w-[900px] flex-1">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-zinc-600" />
            <span className="text-zinc-500 font-sans text-xs uppercase tracking-[0.3em]">Our Work</span>
          </div>

          {/* Title */}
          <h1
            className="font-bold leading-[0.9] tracking-tighter"
            style={{ fontFamily: 'var(--font-hero)', fontVariationSettings: '"wght" 632' }}
          >
            {TITLE_LINES.map((line, li) => (
              <div key={li} className={`flex mb-[0.18em] ${li === 0 ? 'gap-[1.8em]' : 'gap-[0.45em]'}`}>
                {line.map((word) => {
                  const delay = 0.1 + wordIndex++ * 0.15
                  return (
                    <span
                      key={word}
                      style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
                    >
                      <span
                        className={`block bg-clip-text text-transparent ${
                          word === 'PRODUCTS.'
                            ? 'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700'
                            : 'bg-gradient-to-b from-white via-white to-zinc-500'
                        }`}
                        style={{
                          fontSize: 'clamp(3.2rem, 8.5vw, 7.5rem)',
                        }}
                      >
                        {word}
                      </span>
                    </span>
                  )
                })}
              </div>
            ))}
          </h1>

          {/* Mobile/tablet: intro paragraph below title */}
          <div className="lg:hidden mt-8 max-w-sm">
            <p className="text-zinc-400 font-sans text-sm leading-relaxed">
              A curated selection of web apps, websites, AI tools and platforms we have designed and built
              for startups, scale-ups and ambitious founders across different industries.
              Each one is a real product, shipped, live and actively solving real problems for real users.
            </p>
            <span className="mt-4 block text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans">
              {new Date().getFullYear()} · Texfix Studio
            </span>
          </div>

        </div>

        {/* Right: intro paragraph — desktop only */}
        <div className="hidden lg:flex flex-col justify-end self-end pb-2 max-w-[320px] ml-16 shrink-0">
          <p className="text-zinc-400 font-sans text-sm leading-relaxed">
            A curated selection of web apps, websites, AI tools and platforms we have designed and built
            for startups, scale-ups and ambitious founders across different industries.
            Each one is a real product, shipped, live and actively solving real problems for real users.
          </p>
          <span className="mt-4 text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans">
            {new Date().getFullYear()} · Texfix Studio
          </span>
        </div>

      </section>

      {/* Projects list */}
      <div className="px-8 md:px-16 lg:px-28 pb-0 relative" ref={containerRef}>
        <div className="group/list flex flex-col w-full">
          {projects.map((project, i) => {
            const isOpen = openProject === i
            return (
              <div
                key={i}
                className={`transition-opacity duration-300 group-hover/list:opacity-40 hover:!opacity-100`}
              >
                <div
                  ref={(el) => { rowRefs.current[i] = el }}
                  className="w-full border-t border-white/10 last:border-b last:border-white/10 overflow-hidden"
                  style={{ height: ROW_CLOSED }}
                >
                  {/* Row header */}
                  <button
                    onClick={() => handleProjectClick(i)}
                    className="project-row-header w-full flex md:grid md:grid-cols-[1fr_1fr_1fr] items-center gap-x-8 px-4 cursor-pointer"
                    style={{ height: ROW_CLOSED }}
                  >
                    <div className="flex flex-col text-left flex-1 md:flex-none">
                      <h3
                        className="text-lg md:text-3xl font-medium text-white"
                        style={{ fontVariationSettings: '"wght" 500' }}
                      >
                        {project.title}
                      </h3>
                      <span className="text-zinc-500 text-[10px] mt-0.5">{project.subtitle}</span>
                    </div>
                    <span className="text-zinc-500 text-base tracking-wide hidden md:block text-center">
                      {project.type}
                    </span>
                    <div className="flex items-center gap-4 justify-end">
                      <span className="text-zinc-500 text-xs tracking-wide text-right">{project.location}</span>
                      <span
                        className="text-zinc-400 text-2xl leading-none shrink-0"
                        style={{ transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                      >+</span>
                    </div>
                  </button>

                  {/* Expanded content */}
                  <div className="flex flex-col md:flex-row gap-6 px-4 pb-10 pt-2">
                    {/* Image: left on desktop, full width on mobile */}
                    <div className="rounded-xl overflow-hidden w-full md:w-1/2 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-auto object-contain max-h-[420px]"
                      />
                    </div>
                    {/* Right: case study + tags */}
                    <div className="flex flex-col gap-4 justify-center">
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {project.details}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-zinc-500 border border-white/10 px-3 py-1 rounded-full">
                          {project.type}
                        </span>
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-xs text-zinc-500 border border-white/10 px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Floating thumbnail */}
        <div
          ref={thumbnailRef}
          className="hidden [@media(pointer:fine)]:block fixed top-0 left-0 w-[14rem] h-[9rem] overflow-hidden pointer-events-none z-50 rounded-xl"
          style={{ transformOrigin: 'center center' }}
        >
          {projects.map((project, i) => (
            <div
              key={i}
              className="w-full h-full flex-shrink-0"
              ref={(el) => { if (el) thumbnailsRef.current[i] = el }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll-driven text + marquee section — desktop only */}
      <div className="hidden sm:block">
        <ScrollSection projects={projects} />
      </div>

      {/* Mobile: stacked paragraphs + marquee */}
      <MobileScrollSection projects={projects} />

      {/* CTA */}
      <CtaSection />

    </main>
  )
}

function CtaSection() {
  return (
    <section className="px-8 md:px-16 lg:px-28 pb-40 pt-32">
      <div className="max-w-[700px] mx-auto text-center">
        <div className="h-[2px] bg-white mb-16" />
        <h2
          className="font-bold leading-[0.9] tracking-tighter uppercase mb-6"
          style={{ fontFamily: 'var(--font-hero)', fontVariationSettings: '"wght" 632' }}
        >
          <span
            className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Let&apos;s Build
          </span>
          <span
            className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-600 to-indigo-900"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Something Great
          </span>
        </h2>
        <p className="text-zinc-400 text-base leading-relaxed mb-10 max-w-md mx-auto">
          Ready to turn your idea into a product that scales?<br />
          Let&apos;s talk — no commitment required.
        </p>
        <div>
          <AnimatedShinyButton url="/contact">
            Get in Touch
          </AnimatedShinyButton>
        </div>
      </div>
    </section>
  )
}

const COPY_BLOCKS = [
  'We do not build generic products. Every project starts from a real problem, and we stay with it until the solution is something we are proud to put our name on.',
  'Our work spans industries and continents, from inventory systems for factories in Algeria to booking platforms in London and SaaS tools used by businesses worldwide.',
  'What stays constant across all of it is the standard. Clean code, sharp design, honest timelines, and a product that actually works when it reaches real users.',
]

function splitWords(text: string) {
  return text.split(' ')
}

function MobileScrollSection({ projects }: { projects: { image: string; title: string }[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], []])
  const marqueeRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const words = wordRefs.current
    words[1].forEach(w => w && gsap.set(w, { yPercent: 100 }))
    words[2].forEach(w => w && gsap.set(w, { yPercent: 100 }))

    const overlapCount = 3

    const getWordProgress = (phaseProgress: number, wordIndex: number, totalWords: number) => {
      const totalLength = 1 + overlapCount / totalWords
      const scale = 1 / Math.min(totalLength, 1 + (totalWords - 1) / totalWords + overlapCount / totalWords)
      const startTime = (wordIndex / totalWords) * scale
      const endTime = startTime + (overlapCount / totalWords) * scale
      if (phaseProgress <= startTime) return 0
      if (phaseProgress >= endTime) return 1
      return (phaseProgress - startTime) / (endTime - startTime)
    }

    const animateBlock = (
      outWords: (HTMLSpanElement | null)[],
      inWords: (HTMLSpanElement | null)[],
      phaseProgress: number,
    ) => {
      outWords.forEach((w, i) => {
        if (!w) return
        const p = getWordProgress(phaseProgress, i, outWords.length)
        gsap.set(w, { yPercent: p * -100 })
      })
      inWords.forEach((w, i) => {
        if (!w) return
        const p = getWordProgress(phaseProgress, i, inWords.length)
        gsap.set(w, { yPercent: 100 - p * 100 })
      })
    }

    // Marquee — touch + wheel velocity
    let pos = 0
    let smoothVelocity = 0
    let targetVelocity = 0
    let lastTouchY = 0
    const handleTouchStart = (e: TouchEvent) => { lastTouchY = e.touches[0].clientY }
    const handleTouchMove = (e: TouchEvent) => {
      const dy = lastTouchY - e.touches[0].clientY
      lastTouchY = e.touches[0].clientY
      targetVelocity = Math.abs(dy) * 0.008
    }
    const handleWheel = (e: WheelEvent) => { targetVelocity = Math.abs(e.deltaY) * 0.002 }
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('wheel', handleWheel)

    const ticker = gsap.ticker.add(() => {
      smoothVelocity += (targetVelocity - smoothVelocity) * 0.5
      pos -= 0.45 + smoothVelocity * 9
      const track = marqueeRef.current
      if (track) {
        const trackWidth = track.scrollWidth / 2
        if (pos <= -trackWidth) pos = 0
        gsap.set(track, { x: pos })
      }
      targetVelocity *= 0.9
    })

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      pinSpacing: true,
      start: 'top top',
      end: `+=${5 * window.innerHeight}`,
      scrub: 0.5,
      onUpdate: self => {
        const p = self.progress
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`
        if (p <= 0.5) {
          animateBlock(words[0], words[1], p / 0.5)
        } else {
          words[0].forEach(w => w && gsap.set(w, { yPercent: -100 }))
          animateBlock(words[1], words[2], (p - 0.5) / 0.5)
        }
      },
    })

    return () => {
      st.kill()
      gsap.ticker.remove(ticker)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const images = [...projects, ...projects]

  return (
    <div ref={sectionRef} className="sm:hidden h-screen overflow-hidden">

      {/* Progress bar */}
      <div className="absolute top-10 right-8 w-24 h-px bg-white/10">
        <div ref={progressRef} className="absolute inset-0 bg-white origin-left" style={{ transform: 'scaleX(0)' }} />
      </div>

      {/* Text blocks — stacked, block 0 gives height, 1+2 overlay */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full px-8">
        {COPY_BLOCKS.map((block, bi) => (
          <div
            key={bi}
            style={bi === 0 ? { position: 'relative' } : { position: 'absolute', top: 0, left: 0, right: 0, padding: '0 2rem' }}
          >
            <p className="text-white font-sans leading-[1.4] text-xl" style={{ fontWeight: 450 }}>
              {splitWords(block).map((word, wi) => (
                <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.35em' }}>
                  <span ref={el => { wordRefs.current[bi][wi] = el }} style={{ display: 'block' }}>
                    {word}
                  </span>
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>

      {/* Marquee */}
      <div className="absolute bottom-8 left-0 w-full overflow-hidden h-36 flex items-center">
        <div ref={marqueeRef} className="flex gap-4 will-change-transform">
          {images.map((p, i) => (
            <div key={i} className="relative w-52 h-36 rounded-lg overflow-hidden shrink-0">
              <Image src={p.image} alt={p.title} fill className="object-cover" sizes="208px" />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function ScrollSection({ projects }: { projects: { image: string; title: string }[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], []])
  const marqueeRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const words = wordRefs.current
    // hide blocks 1 and 2 initially
    words[1].forEach(w => w && gsap.set(w, { yPercent: 100 }))
    words[2].forEach(w => w && gsap.set(w, { yPercent: 100 }))

    const overlapCount = 3

    const getWordProgress = (phaseProgress: number, wordIndex: number, totalWords: number) => {
      const totalLength = 1 + overlapCount / totalWords
      const scale = 1 / Math.min(totalLength, 1 + (totalWords - 1) / totalWords + overlapCount / totalWords)
      const startTime = (wordIndex / totalWords) * scale
      const endTime = startTime + (overlapCount / totalWords) * scale
      if (phaseProgress <= startTime) return 0
      if (phaseProgress >= endTime) return 1
      return (phaseProgress - startTime) / (endTime - startTime)
    }

    const animateBlock = (
      outWords: (HTMLSpanElement | null)[],
      inWords: (HTMLSpanElement | null)[],
      phaseProgress: number,
    ) => {
      outWords.forEach((w, i) => {
        if (!w) return
        const p = getWordProgress(phaseProgress, i, outWords.length)
        gsap.set(w, { yPercent: p * -100 })
      })
      inWords.forEach((w, i) => {
        if (!w) return
        const p = getWordProgress(phaseProgress, i, inWords.length)
        gsap.set(w, { yPercent: 100 - p * 100 })
      })
    }

    // marquee velocity — wheel (desktop) + touch (mobile/tablet)
    let marqueePos = 0
    let smoothVelocity = 0
    let targetVelocity = 0
    let lastTouchY = 0

    const handleWheel = (e: WheelEvent) => {
      targetVelocity = Math.abs(e.deltaY) * 0.002
    }
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      const dy = lastTouchY - e.touches[0].clientY
      lastTouchY = e.touches[0].clientY
      targetVelocity = Math.abs(dy) * 0.008
    }
    window.addEventListener('wheel', handleWheel)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    const ticker = gsap.ticker.add(() => {
      smoothVelocity += (targetVelocity - smoothVelocity) * 0.5
      const speed = 0.45 + smoothVelocity * 9
      marqueePos -= speed
      const track = marqueeRef.current
      if (track) {
        const trackWidth = track.scrollWidth / 2
        if (marqueePos <= -trackWidth) marqueePos = 0
        gsap.set(track, { x: marqueePos })
      }
      targetVelocity *= 0.9
    })

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      pinSpacing: true,
      start: 'top top',
      end: `+=${5 * window.innerHeight}`,
      scrub: 0.5,
      onUpdate: self => {
        const p = self.progress
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${p})`
        }
        if (p <= 0.5) {
          const phase1 = p / 0.5
          animateBlock(words[0], words[1], phase1)
        } else {
          const phase2 = (p - 0.5) / 0.5
          words[0].forEach(w => w && gsap.set(w, { yPercent: -100 }))
          animateBlock(words[1], words[2], phase2)
        }
      },
    })

    return () => {
      st.kill()
      gsap.ticker.remove(ticker)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const images = [...projects, ...projects]

  return (
    <div ref={containerRef} className="relative">
      <div ref={sectionRef} className="h-screen overflow-hidden">

        {/* Scroll progress indicator */}
        <div className="absolute top-10 right-8 md:right-16 lg:right-28 w-32 h-px bg-white/10">
          <div
            ref={progressRef}
            className="absolute inset-0 bg-white origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Text blocks */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full px-8 md:px-16 lg:px-28 flex flex-col sm:flex-row gap-6 sm:gap-16">
          {COPY_BLOCKS.map((block, bi) => (
            <div key={bi} className={`flex-1 ${bi > 0 ? 'hidden sm:block' : ''}`}>
              <p className="text-white font-sans leading-[1.25]" style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)', fontWeight: 450 }}>
                {splitWords(block).map((word, wi) => (
                  <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.3em' }}>
                    <span ref={el => { wordRefs.current[bi][wi] = el }} style={{ display: 'block' }}>
                      {word}
                    </span>
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="absolute bottom-8 left-0 w-full overflow-hidden h-48 flex items-center">
          <div ref={marqueeRef} className="flex gap-4 will-change-transform">
            {images.map((p, i) => (
              <div key={i} className="relative w-72 h-48 rounded-lg overflow-hidden shrink-0">
                <Image src={p.image} alt={p.title} fill className="object-cover" sizes="288px" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
