'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, Smartphone, Zap, BarChart2, Plus, Check, type LucideIcon } from 'lucide-react'
import AnimatedBadge from '@/components/ui/animated-badge'
import { useReveal } from '@/hooks/use-reveal'
import { HackerBackground } from '@/registry/eldoraui/hacker-background'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { cn } from '@/lib/utils'

const services = [
  {
    num: '01',
    title: 'Custom Software Development',
    desc: 'Bespoke enterprise-grade software engineered for your exact requirements.',
    icon: Code2,
    bullets: [
      'Enterprise ERP & CRM platforms',
      'API development & integrations',
      'Legacy system modernization',
      'Real-time data pipelines',
    ],
    stack: 'Node.js / Python / React / PostgreSQL / AWS',
    stat: { v: '100%', l: 'Custom code' },
  },
  {
    num: '02',
    title: 'Web & Mobile Applications',
    desc: 'High-performance web and mobile apps built for scale and user experience.',
    icon: Smartphone,
    bullets: [
      'Progressive Web Apps (PWA)',
      'Cross-platform mobile (React Native)',
      'SaaS dashboards & portals',
      'E-commerce platforms',
    ],
    stack: 'Next.js / React Native / TypeScript / Tailwind',
    stat: { v: '95+', l: 'Lighthouse score' },
  },
  {
    num: '03',
    title: 'Business Automation',
    desc: 'Automate repetitive workflows to save time, reduce errors, and cut costs.',
    icon: Zap,
    bullets: [
      'Invoice & payment processing',
      'Employee onboarding workflows',
      'Multi-platform data sync',
      'Scheduled reports & exports',
    ],
    stack: 'n8n / Zapier / Python / REST APIs',
    stat: { v: '80%', l: 'Avg. time saved' },
  },
  {
    num: '04',
    title: 'Data Analytics & Dashboards',
    desc: 'Turn raw data into real-time actionable business intelligence.',
    icon: BarChart2,
    bullets: [
      'Real-time KPI dashboards',
      'Sales & conversion analytics',
      'Predictive forecasting',
      'Data warehouse & ETL pipelines',
    ],
    stack: 'Python / SQL / Metabase / BigQuery / Tableau',
    stat: { v: '3x', l: 'Faster decisions' },
  },
]

export default function Services() {
  const sectionRef   = useRef(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef    = useRef<HTMLDivElement>(null)
  const cardRefs     = useRef<HTMLDivElement[]>([])
  const isFlippedRef = useRef(false)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null)
  const { ref: mobileRevealRef, visible: mobileVisible } = useReveal(0.2)

  const handleCardClick = (i: number) => {
    if (!isFlippedRef.current) return
    const next = expandedIdx === i ? null : i
    setExpandedIdx(next)
    if (next === null) {
      gsap.to(cardRefs.current, { flexGrow: 1, duration: 0.45, ease: 'power3.inOut' })
    } else {
      cardRefs.current.forEach((card, j) => {
        gsap.to(card, {
          flexGrow: j === next ? 2.5 : 0.5,
          duration: 0.45,
          ease: 'power3.inOut',
        })
      })
    }
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1000px)', () => {
      let isGapDone  = false
      let isFlipDone = false

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * 4}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,

        onUpdate: (self) => {
          const p = self.progress

          if (p <= 0.25) {
            gsap.set(containerRef.current, {
              width: `${gsap.utils.mapRange(0, 0.25, 75, 62, p)}%`,
            })
          } else {
            gsap.set(containerRef.current, { width: '62%' })
          }

          if (p >= 0.35 && !isGapDone) {
            gsap.to(containerRef.current, { gap: '12px', duration: 0.5, ease: 'power3.out' })
            gsap.to(cardRefs.current, { borderRadius: '16px', duration: 0.5, ease: 'power3.out' })
            isGapDone = true
          } else if (p < 0.35 && isGapDone) {
            gsap.to(containerRef.current, { gap: '0px', duration: 0.5, ease: 'power3.out' })
            cardRefs.current.forEach((card, i) => {
              const r =
                i === 0 ? '16px 0 0 16px' :
                i === 3 ? '0 16px 16px 0' : '0'
              gsap.to(card, { borderRadius: r, duration: 0.5, ease: 'power3.out' })
            })
            isGapDone = false
          }

          if (p >= 0.7 && !isFlipDone) {
            gsap.to(cardRefs.current, {
              rotationY: 180,
              duration: 0.75,
              ease: 'power3.inOut',
              stagger: 0.1,
              onComplete: () => { isFlippedRef.current = true },
            })
            isFlipDone = true
          } else if (p < 0.7 && isFlipDone) {
            isFlippedRef.current = false
            setExpandedIdx(null)
            gsap.to(cardRefs.current, { flexGrow: 1, duration: 0.3, ease: 'power2.out' })
            gsap.to(cardRefs.current, {
              rotationY: 0,
              duration: 0.75,
              ease: 'power3.inOut',
              stagger: -0.1,
            })
            isFlipDone = false
          }
        },
      })

      return () => {}
    })

    return () => { mm.revert() }
  }, [])

  return (
    <>
      {/* Desktop: sticky scroll animation */}
      <section
        ref={sectionRef}
        id="services"
        className="relative w-full h-svh justify-center items-center bg-[#030303] hidden lg:flex"
      >
        <div className="absolute top-[16%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
          <div className="flex justify-center mb-3">
            <AnimatedBadge text="What We Do" color="#3B82F6" />
          </div>
          <div ref={headerRef}>
            <h2 className="font-display text-5xl font-medium leading-tight uppercase">
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">Services Built for</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700">Real Business Outcomes</span>
            </h2>
            <p className="mt-4 text-zinc-400 text-sm max-w-lg mx-auto text-center">
              Custom software, web &amp; mobile applications, and intelligent automation — engineered to scale your operations and accelerate growth.
            </p>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative flex"
          style={{ width: '75%', aspectRatio: '20/7', perspective: '1000px', transform: 'translateY(80px)' }}
        >
          {services.map((s, i) => (
            <div
              key={s.num}
              ref={(el) => { if (el) cardRefs.current[i] = el }}
              className="relative flex-1 h-full"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
                borderRadius:
                  i === 0 ? '16px 0 0 16px' :
                  i === 3 ? '0 16px 16px 0' : '0',
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  borderRadius: 'inherit',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: '#030303',
                }}
              >
                <HackerBackground
                  color="#3B82F6"
                  fontSize={8}
                  speed={1.5}
                  className="opacity-80"
                />
              </div>

              {/* Back */}
              <div
                className="absolute flex flex-col overflow-hidden cursor-pointer select-none transform-gpu bg-black [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
                style={{
                  borderRadius: '16px',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  left: 0,
                  right: 0,
                  top: expandedIdx === i ? '-40px' : 0,
                  bottom: expandedIdx === i ? '-40px' : 0,
                  zIndex: expandedIdx === i ? 20 : 1,
                  transition: 'top 0.45s cubic-bezier(0.4,0,0.2,1), bottom 0.45s cubic-bezier(0.4,0,0.2,1)',
                }}
                onClick={() => handleCardClick(i)}
              >
                <AnimatedGridPattern
                  numSquares={20}
                  maxOpacity={0.04}
                  duration={4}
                  repeatDelay={1}
                  className={cn(
                    '[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]',
                    'inset-0 h-full skew-y-6 fill-blue-400/20 stroke-blue-400/10',
                  )}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse 60% 40% at 30% 30%, rgba(59,130,246,0.07) 0%, transparent 70%)',
                    transition: 'opacity 0.4s ease',
                    opacity: expandedIdx === i ? 1 : 0.6,
                  }}
                />
                <div
                  className="flex-shrink-0 mt-auto"
                  style={{
                    padding: expandedIdx === i ? '1.5rem' : '1.25rem',
                    transition: 'padding 0.4s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-white/25">( {s.num} )</span>
                    <div
                      style={{
                        transform: expandedIdx === i ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    >
                      <Plus className="text-neutral-600 w-3.5 h-3.5" />
                    </div>
                  </div>
                  <s.icon
                    style={{
                      width: expandedIdx === i ? '2rem' : '1.75rem',
                      height: expandedIdx === i ? '2rem' : '1.75rem',
                      transition: 'width 0.3s ease, height 0.3s ease, color 0.3s ease',
                      color: expandedIdx === i ? 'rgb(59 130 246 / 0.7)' : 'rgb(64 64 64)',
                      marginBottom: '0.75rem',
                      display: 'block',
                    }}
                  />
                  <h3
                    className="font-display text-neutral-300 font-semibold leading-snug mb-2"
                    style={{
                      fontSize: expandedIdx === i ? '1.125rem' : '1rem',
                      transition: 'font-size 0.3s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="font-mono text-neutral-400 leading-relaxed"
                    style={{
                      fontSize: expandedIdx === i ? '0.75rem' : '0.7rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: expandedIdx === i ? 'unset' : 2,
                      transition: 'font-size 0.3s ease',
                    }}
                  >
                    {s.desc}
                  </p>
                </div>

                <AnimatePresence>
                  {expandedIdx === i && (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden px-6 pb-6"
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                          hidden: {},
                          visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                        }}
                      >
                        <motion.div
                          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                          className="border-t border-white/5 pt-3 mb-2"
                        />
                        <ul className="space-y-1.5 mb-3">
                          {s.bullets.map((b) => (
                            <motion.li
                              key={b}
                              variants={{
                                hidden: { opacity: 0, y: 4 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.4,0,0.2,1] } },
                              }}
                              className="flex items-start gap-2 text-[13px] text-neutral-400"
                            >
                              <Check className="text-signal/50 mt-0.5 shrink-0 w-[11px] h-[11px]" />
                              {b}
                            </motion.li>
                          ))}
                        </ul>
                        <motion.p
                          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.18 } } }}
                          className="font-mono text-[11px] text-neutral-600 mb-3 leading-relaxed"
                        >
                          {s.stack}
                        </motion.p>
                        <motion.div
                          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.18 } } }}
                          className="flex items-baseline gap-1.5 pt-2 border-t border-white/5"
                        >
                          <span className="font-display font-bold text-neutral-200 text-2xl">{s.stat.v}</span>
                          <span className="font-mono text-[11px] text-neutral-500">{s.stat.l}</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile: expandable cards */}
      <section id="services" className="pt-32 pb-24 px-5 bg-[#030303] lg:hidden">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-3">
            <AnimatedBadge text="What We Do" color="#3B82F6" />
          </div>
          {/* @ts-expect-error ref typing */}
          <h2 ref={mobileRevealRef} className="font-display text-4xl font-medium leading-tight mb-3 uppercase text-center">
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">Services Built for</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700">Real Business Outcomes</span>
            </h2>
          <p className="text-zinc-400 text-sm mb-10 text-center" style={{ opacity: mobileVisible ? 1 : 0, transform: mobileVisible ? 'translateY(0)' : 'translateY(20px)', transition: mobileVisible ? 'opacity 0.8s ease 0.7s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s' : 'none' }}>
            Custom software, web &amp; mobile applications, and intelligent automation — engineered to scale your operations and accelerate growth.
          </p>
          <div className="flex flex-col gap-3">
            {services.map((s, i) => (
              <div
                key={s.num}
                className="relative flex flex-col overflow-hidden cursor-pointer select-none bg-black [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] rounded-2xl"
                onClick={() => setMobileExpanded(mobileExpanded === i ? null : i)}
              >
                <AnimatedGridPattern
                  numSquares={20}
                  maxOpacity={0.04}
                  duration={4}
                  repeatDelay={1}
                  className={cn(
                    '[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]',
                    'inset-0 h-full skew-y-6 fill-blue-400/20 stroke-blue-400/10',
                  )}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse 60% 40% at 30% 30%, rgba(59,130,246,0.07) 0%, transparent 70%)',
                    opacity: mobileExpanded === i ? 1 : 0.6,
                    transition: 'opacity 0.4s ease',
                  }}
                />
                <div className="relative p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] text-white/25">( {s.num} )</span>
                    <div style={{ transform: mobileExpanded === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
                      <Plus className="text-neutral-600 w-3.5 h-3.5" />
                    </div>
                  </div>
                  <s.icon
                    style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      color: mobileExpanded === i ? 'rgb(59 130 246 / 0.7)' : 'rgb(64 64 64)',
                      marginBottom: '0.75rem',
                      display: 'block',
                      transition: 'color 0.3s ease',
                    }}
                  />
                  <h3 className="font-display text-neutral-300 font-semibold leading-snug mb-2 text-base">
                    {s.title}
                  </h3>
                  <p className="font-mono text-neutral-400 leading-relaxed text-[0.7rem]">
                    {s.desc}
                  </p>
                </div>
                <AnimatePresence>
                  {mobileExpanded === i && (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden px-5 pb-5 relative"
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                          hidden: {},
                          visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                        }}
                      >
                        <motion.div
                          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                          className="border-t border-white/5 pt-3 mb-2"
                        />
                        <ul className="space-y-1.5 mb-3">
                          {s.bullets.map((b) => (
                            <motion.li
                              key={b}
                              variants={{
                                hidden: { opacity: 0, y: 4 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.4,0,0.2,1] } },
                              }}
                              className="flex items-start gap-2 text-[13px] text-neutral-400"
                            >
                              <Check className="text-signal/50 mt-0.5 shrink-0 w-[11px] h-[11px]" />
                              {b}
                            </motion.li>
                          ))}
                        </ul>
                        <motion.p
                          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.18 } } }}
                          className="font-mono text-[11px] text-neutral-600 mb-3 leading-relaxed"
                        >
                          {s.stack}
                        </motion.p>
                        <motion.div
                          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.18 } } }}
                          className="flex items-baseline gap-1.5 pt-2 border-t border-white/5"
                        >
                          <span className="font-display font-bold text-neutral-200 text-2xl">{s.stat.v}</span>
                          <span className="font-mono text-[11px] text-neutral-500">{s.stat.l}</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
