'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { IconCloud } from '@/components/ui/icon-cloud'
import { AnimatedShinyButton } from '@/components/ui/animated-shiny-button'
import { useReveal } from '@/hooks/use-reveal'

const SERVICES = [
  {
    title: 'Websites',
    desc: 'Marketing sites and landing pages',
    details: 'We craft high-impact websites and landing pages that communicate your brand clearly and convert visitors into customers. From simple one-pagers to multi-section marketing sites, every pixel is intentional and every interaction is smooth.',
    tags: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'CMS'],
  },
  {
    title: 'Web Applications',
    desc: 'Custom-built web apps and platforms',
    details: 'We build fast, scalable web applications tailored to your product vision — from internal tools and dashboards to complex consumer platforms. Every project is engineered with performance, accessibility and long-term maintainability in mind.',
    tags: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'],
  },
  {
    title: 'Mobile Apps',
    desc: 'iOS & Android native and cross-platform',
    details: 'We design and develop mobile applications for both iOS and Android, using React Native for cross-platform efficiency or native development when performance demands it. From onboarding flows to push notifications, we handle the full experience.',
    tags: ['React Native', 'Expo', 'Swift', 'Kotlin'],
  },
  {
    title: 'AI & Automation',
    desc: 'Intelligent tools and workflow pipelines',
    details: 'We integrate AI into real products — custom LLM-powered features, document processing pipelines, intelligent search and recommendation systems. We also automate repetitive workflows so your team can focus on what matters.',
    tags: ['OpenAI', 'LangChain', 'Python', 'n8n'],
  },
  {
    title: 'SaaS Platforms',
    desc: 'Scalable multi-tenant software products',
    details: 'We architect and build SaaS products from scratch — multi-tenant systems, subscription billing, role-based access control and admin dashboards. Built to scale from day one without accumulating technical debt.',
    tags: ['Stripe', 'Prisma', 'AWS', 'Docker'],
  },
  {
    title: 'E-Commerce',
    desc: 'High-converting storefronts and systems',
    details: 'We build e-commerce experiences that are fast, beautiful and optimised for conversion — custom Shopify storefronts, headless commerce setups and bespoke checkout flows. Every detail is crafted to reduce friction and increase revenue.',
    tags: ['Shopify', 'Next.js', 'Headless', 'Stripe'],
  },
]

const QUOTE_LINES = [
  ['GOING', 'PAST'],
  ["WHAT'S"],
  ['POSSIBLE.'],
]

const TECH_SLUGS = [
  'typescript', 'javascript', 'react', 'nextdotjs', 'nodedotjs',
  'express', 'postgresql', 'prisma', 'amazonaws', 'firebase',
  'docker', 'git', 'github', 'vercel', 'figma',
  'tailwindcss', 'html5', 'css3', 'jest', 'visualstudiocode',
]

const TECH_ICONS = TECH_SLUGS.map(
  (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
)

const ROW_CLOSED = 72
const ROW_OPEN   = 320

export default function AboutPage() {
  let wordIndex = 0
  const [openService, setOpenService] = useState<number | null>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const rowRevealRefs = useRef<(HTMLDivElement | null)[]>([])

  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = statsRef.current
    if (!container) return
    const spans = container.querySelectorAll<HTMLSpanElement>('[data-count]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.disconnect()
          spans.forEach((span) => {
            const end = parseFloat(span.dataset.count!)
            const suffix = span.dataset.suffix ?? ''
            const obj = { val: 0 }
            gsap.to(obj, {
              val: end,
              duration: 1.8,
              ease: 'power3.out',
              onUpdate: () => {
                span.textContent = (Number.isInteger(end)
                  ? Math.round(obj.val).toString()
                  : obj.val.toFixed(1)) + suffix
              },
            })
          })
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const { ref: revealServices,  visible: visServices }  = useReveal(0.15)

  useEffect(() => {
    if (!visServices) return
    gsap.fromTo(
      rowRevealRefs.current.filter(Boolean),
      { opacity: 0 },
      { opacity: 1, duration: 1.4, ease: 'power2.out', stagger: 0.12, delay: 0.15, clearProps: 'opacity' }
    )
  }, [visServices])
  const handleServiceClick = (i: number) => {
    const next = openService === i ? null : i
    setOpenService(next)
    rowRefs.current.forEach((row, j) => {
      if (!row) return
      gsap.to(row, {
        height: next === null ? ROW_CLOSED : j === next ? ROW_OPEN : ROW_CLOSED,
        duration: 0.5,
        ease: 'power3.inOut',
      })
    })
  }

  return (
    <main className="min-h-screen bg-transparent text-white">
      <section className="relative flex items-center px-8 md:px-16 lg:px-28 pt-44 pb-12">
        {/* Blue bubble */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="w-full max-w-[900px]">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-zinc-600" />
            <span className="text-zinc-500 font-sans text-xs uppercase tracking-[0.3em]">About Us</span>
          </div>

          {/* Quote */}
          <h1
            className="font-bold leading-[0.9] tracking-tighter"
            style={{ fontFamily: 'var(--font-hero)', fontVariationSettings: '"wght" 632' }}
          >
            {QUOTE_LINES.map((line, li) => (
              <div key={li} className="flex gap-[0.45em] mb-[0.18em]">
                {line.map((word) => {
                  const delay = 0.1 + wordIndex++ * 0.15
                  return (
                    <span
                      key={word}
                      style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
                    >
                      <span
                        className={`block bg-clip-text text-transparent ${
                          word === 'PAST'
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



        </div>
      </section>

      {/* Statement section */}
      <section className="px-8 md:px-16 lg:px-28 pb-32">
        <div className="ml-[50%] h-[2px] bg-white mb-16" />

        <div className="ml-[50%] max-w-[600px]">
          <p
            className="text-white font-sans leading-[1.25] mb-16"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 400 }}
          >
            {[
              'We are a software studio built around people who love creating, designing and engineering',
              'digital products. We work with startups and businesses that want to go further, building',
              'web apps, AI tools and platforms that are both beautiful and fast.',
            ].map((line, i) => (
            <span key={i} className="block">{line}</span>
            ))}
          </p>

          <div className="flex flex-col sm:flex-row gap-10">
            <p className="text-zinc-500 font-sans text-sm leading-relaxed max-w-[320px]">
              We are a small, focused team based in Guelma, Algeria. Every project we take on gets
              our full attention, no handoffs, no bloat. Just sharp execution from start to launch.
            </p>
            <p className="text-zinc-500 font-sans text-sm leading-relaxed max-w-[320px]">
              We are always open to new projects and collaborations. If you have an idea you want
              to bring to life, reach out at{' '}
              <a href="mailto:texfix.info@gmail.com" className="text-zinc-300 hover:text-white transition-colors">
                texfix.info@gmail.com
              </a>{' '}
              and we will get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* Tech stack section */}
      <section className="px-8 md:px-16 lg:px-28 pb-32">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-zinc-500 font-sans text-xs uppercase tracking-[0.3em]">Tech Stacks</span>
        </div>
        <div className="mr-[50%] h-[2px] bg-white mb-16" />

        <div className="flex items-start gap-16">
          <div className="flex-1 max-w-[600px]">
            <p
              className="text-white font-sans leading-[1.25] mb-16"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 400 }}
            >
              {[
                'We work with modern, proven technologies. Our stack is chosen for speed, scalability',
                'and long-term maintainability.',
              ].map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </p>

            <div className="flex flex-col sm:flex-row gap-10">
              <p className="text-zinc-500 font-sans text-sm leading-relaxed max-w-[320px]">
                On the frontend we use React, Next.js and TypeScript. For styling we lean on Tailwind CSS,
                and for animation we use GSAP and Framer Motion.
              </p>
              <p className="text-zinc-500 font-sans text-sm leading-relaxed max-w-[320px]">
                On the backend we work with Node.js, Python and PostgreSQL. For AI features we integrate
                OpenAI and custom model pipelines depending on the project.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-1 items-start justify-start min-h-[400px] sm:min-h-[220px] md:min-h-[400px] sm:ml-8 md:ml-32 mt-4">
            <div
              className="rounded-full border-2 border-white w-[340px] h-[340px] sm:w-[200px] sm:h-[200px] md:w-[340px] md:h-[340px] overflow-hidden flex items-center justify-center"
              style={{
                background: 'radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
                boxShadow: 'inset 0 2px 20px rgba(255,255,255,0.08), inset 0 -4px 12px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <IconCloud images={TECH_ICONS} />
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section ref={revealServices} className="px-8 md:px-16 lg:px-28 pb-32">
        <div className="max-w-[700px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-zinc-500 font-sans text-xs uppercase tracking-[0.3em]">Our Services</span>
          </div>
          <div className="h-[2px] bg-white mb-16 -mr-32 md:-mr-64 lg:-mr-96" />
          <p
            className="text-white font-sans leading-[1.25] mb-12"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 400 }}
          >
            {[
              'From idea to launch, we cover the full spectrum',
              'of digital product development.',
            ].map((line, i) => (
                <span key={i} className="block">{line}</span>
            ))}
          </p>

          <div className="group/list flex flex-col w-full cursor-none">
            {SERVICES.map((service, i) => {
              const isOpen = openService === i
              return (
                <div
                  key={i}
                  ref={(el) => { rowRevealRefs.current[i] = el }}
                  style={!visServices ? { opacity: 0 } : undefined}
                  className={`transition-opacity duration-300 group-hover/list:opacity-40 hover:!opacity-100${isOpen ? '' : ' service-row'}`}
                >
                <div
                  ref={(el) => { rowRefs.current[i] = el }}
                  className="w-full border-t border-white/10 last:border-b last:border-white/10 overflow-hidden"
                  style={{ height: ROW_CLOSED }}
                >
                  <button
                    onClick={() => handleServiceClick(i)}
                    className="group w-full flex items-center justify-between cursor-pointer"
                    style={{ height: ROW_CLOSED }}
                  >
                    <span
                      className="font-medium text-white"
                      style={{
                        fontSize: isOpen ? 'clamp(1.8rem, 3vw, 2.8rem)' : 'clamp(1.4rem, 2vw, 1.875rem)',
                        transition: 'font-size 0.5s cubic-bezier(0.16,1,0.3,1)',
                        fontVariationSettings: '"wght" 500',
                      }}
                    >
                      {service.title}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-500 text-sm tracking-wide hidden sm:block">{service.desc}</span>
                      <span
                        className="text-zinc-400 text-xl leading-none"
                        style={{ transition: 'transform 0.4s ease', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                      >+</span>
                    </div>
                  </button>
                  <div className="pb-8">
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4 max-w-[560px]">{service.details}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span key={tag} className="text-xs text-zinc-500 border border-white/10 px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us section */}
      <section className="px-8 md:px-16 lg:px-28 pb-32">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-zinc-500 font-sans text-xs uppercase tracking-[0.3em]">Why Choose Us</span>
        </div>
        <div className="mr-[50%] h-[2px] bg-white mb-16" />

        <div className="max-w-[600px]">
          <p
            className="text-white font-sans leading-[1.25] mb-16"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 400 }}
          >
            {[
              'We are not an agency. We are a small team',
              'that genuinely cares about what we ship.',
            ].map((line, i) => (
                <span key={i} className="block">{line}</span>
            ))}
          </p>

          <div className="flex flex-col sm:flex-row gap-10 mb-16">
            <p className="text-zinc-500 font-sans text-sm leading-relaxed max-w-[280px]">
              Every project gets our full attention from day one. No handoffs, no account managers.
              You work directly with the people building your product, which means faster decisions
              and sharper execution all the way to launch.
            </p>
            <p className="text-zinc-500 font-sans text-sm leading-relaxed max-w-[280px]">
              We write code built to last. Clean architecture, no unnecessary bloat, and transparent
              communication throughout. You always know what we are building, why we made a decision,
              and what is coming next.
            </p>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 sm:flex sm:flex-row gap-6 sm:gap-10">
            {[
              { value: '12+', label: 'Projects delivered',  count: 12,  suffix: '+' },
              { value: '100%', label: 'Client satisfaction', count: 100, suffix: '%' },
              { value: '3x',  label: 'Avg. faster launch',  count: 3,   suffix: 'x' },
              { value: '3+',  label: 'Years of experience', count: 3,   suffix: '+' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span
                  data-count={stat.count}
                  data-suffix={stat.suffix}
                  className="text-white font-sans font-semibold"
                  style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)' }}
                >
                  0{stat.suffix}
                </span>
                <span className="text-zinc-500 font-sans text-xs tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="px-8 md:px-16 lg:px-28 pb-40">
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
    </main>
  )
}
