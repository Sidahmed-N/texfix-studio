'use client'

import { useEffect, useRef } from 'react'

const PILLS = [
  { label: 'Web Apps',        top: 25,   left: 15   },
  { label: 'Mobile',          top: 12.5, left: 50   },
  { label: 'AI & Automation', top: 22.5, left: 72   },
  { label: 'Websites',        top: 30,   left: 78   },
  { label: 'SaaS Platforms',  top: 50,   left: 20   },
  { label: 'E-Commerce',      top: 80,   left: 20   },
  { label: 'Custom Software', top: 75,   left: 72   },
]

export default function Contact() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const pillWrapRefs = useRef<HTMLDivElement[]>([])
  const pillBoxRefs  = useRef<HTMLDivElement[]>([])
  const pillsLayerRef = useRef<HTMLDivElement>(null)
  const buttonRef    = useRef<HTMLDivElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let st: ReturnType<Awaited<typeof import('gsap/ScrollTrigger')>['ScrollTrigger']['create']> | undefined
    let floats: ReturnType<typeof import('gsap').gsap.to>[] = []
    let onResize: (() => void) | undefined
    let cancelled = false

    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (cancelled) return

      // Measure pill natural sizes
      const pillSizes = pillBoxRefs.current.map(el => {
        const r = el.getBoundingClientRect()
        return { width: r.width, height: r.height }
      })

      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const btnW = 3 * rem
      const btnH = 3 * rem

      const getCtaRem = () => (window.innerWidth < 1000 ? 14 : 16)
      let ctaRem = getCtaRem()

      onResize = () => { ctaRem = getCtaRem(); ScrollTrigger.refresh() }
      window.addEventListener('resize', onResize)

      // Floating idle animations
      floats = pillWrapRefs.current.map((el, i) =>
        gsap.to(el, {
          y: '+=28',
          duration: 1.2 + 0.37 * (i % 0.8 === 0 ? 0.8 : i % 0.8),
          delay: 0.53 * (i % 2),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      )

      // Tablets use touch scroll — tighter scrub reduces perceived lag
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024
      const scrubAmt = isTablet ? 0.3 : 1

      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${3 * window.innerHeight}px`,
        pin: true,
        pinSpacing: true,
        scrub: scrubAmt,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p = self.progress

          // — title parallax out
          if (titleRef.current) {
            gsap.set(titleRef.current, { y: p <= 0.3333 ? `${-(p / 0.3333) * 100}%` : '-100%' })
          }

          // Phase 1 (0–50%): pills converge to centre
          if (p <= 0.5) {
            const e = p / 0.5
            pillWrapRefs.current.forEach((el, i) => {
              gsap.set(el, {
                top:  `${PILLS[i].top  + (50 - PILLS[i].top)  * e}%`,
                left: `${PILLS[i].left + (50 - PILLS[i].left) * e}%`,
              })
            })
            pillBoxRefs.current.forEach((el, i) => {
              const s = pillSizes[i]
              gsap.set(el, {
                width:        `${s.width  + (btnW - s.width)  * e}px`,
                height:       `${s.height + (btnH - s.height) * e}px`,
                borderRadius: `${0.5 + 24.5 * e}rem`,
                borderWidth:  `${0.125 + (0.35 - 0.125) * e}rem`,
              })
            })
            gsap.set('.cta-pill-label', { opacity: p <= 0.1 ? 1 - p / 0.1 : 0 })
          }

          // Pills layer visibility
          if (pillsLayerRef.current) {
            gsap.set(pillsLayerRef.current, { opacity: p >= 0.5 ? 0 : 1 })
          }

          // — Blue button
          if (buttonRef.current) {
            gsap.set(buttonRef.current, { opacity: +(p >= 0.5) })

            if (p >= 0.5 && p <= 0.75) {
              const e = (p - 0.5) / 0.25
              gsap.set(buttonRef.current, {
                width:     `${3 + (ctaRem - 3) * e}rem`,
                height:    `${3 + 0.5 * e}rem`,
                transform: `translate(-50%, ${-50 + 250 * e}%)`,
              })
              gsap.set('.cta-inner', { opacity: 0 })
            } else if (p > 0.75) {
              gsap.set(buttonRef.current, {
                width:     `${ctaRem}rem`,
                height:    '3.5rem',
                transform: 'translate(-50%, 200%)',
              })
            }
          }

          // — CTA text block
          if (p >= 0.75) {
            const e = (p - 0.75) / 0.25
            gsap.set('.cta-inner', { opacity: e })
            gsap.set(ctaRef.current, { y: -50 + 50 * e, opacity: e })
          } else {
            gsap.set(ctaRef.current, { y: -50, opacity: 0 })
          }
        },
      })

      ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      floats.forEach(f => f.kill())
      if (onResize) window.removeEventListener('resize', onResize)
      if (st) {
        st.kill(true)
        st = undefined
      }
    }
  }, [])

  return (
    <>
      <style>{`
        #contact { overflow: hidden; }
        .pin-spacer:has(#contact) { overflow-x: hidden !important; }
        .cta-pill-label { transition: none; }

        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }
        @property --gradient-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }
        .contact-cta {
          --shiny-cta-bg: #000000;
          --shiny-cta-bg-subtle: #0f1729;
          --shiny-cta-fg: #ffffff;
          --shiny-cta-highlight: #3B82F6;
          --shiny-cta-highlight-subtle: #60A5FA;
          --animation: gradient-angle linear infinite;
          --duration: 3s;
          --shadow-size: 2px;
          --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);
          isolation: isolate;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          padding: 1.1rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          border: 1px solid transparent;
          border-radius: 0.5rem;
          color: var(--shiny-cta-fg);
          background:
            linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
            conic-gradient(
              from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
              transparent,
              var(--shiny-cta-highlight) var(--gradient-percent),
              var(--gradient-shine) calc(var(--gradient-percent) * 2),
              var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
              transparent calc(var(--gradient-percent) * 4)
            ) border-box;
          box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
          text-decoration: none;
          display: inline-block;
          white-space: nowrap;
        }
        .contact-cta::before, .contact-cta::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
        }
        .contact-cta::before {
          --size: calc(100% - var(--shadow-size) * 3);
          --position: 2px;
          --space: calc(var(--position) * 2);
          width: var(--size);
          height: var(--size);
          background: radial-gradient(circle at var(--position) var(--position), white calc(var(--position) / 4), transparent 0) padding-box;
          background-size: var(--space) var(--space);
          background-repeat: space;
          mask-image: conic-gradient(from calc(var(--gradient-angle) + 45deg), black, transparent 10% 90%, black);
          border-radius: 0.5rem;
          opacity: 0.4;
        }
        .contact-cta::after {
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(-50deg, transparent, var(--shiny-cta-highlight), transparent);
          mask-image: radial-gradient(circle at bottom, transparent 40%, black);
          opacity: 0.6;
          animation: shimmer-contact linear infinite var(--duration);
        }
        .contact-cta, .contact-cta::before, .contact-cta::after {
          animation: gradient-angle linear infinite var(--duration);
          animation-composition: add;
        }
        .contact-cta:is(:hover,:focus-visible) {
          --gradient-percent: 20%;
          --gradient-angle-offset: 95deg;
          --gradient-shine: var(--shiny-cta-highlight-subtle);
        }
        .contact-cta:is(:hover,:focus-visible),
        .contact-cta:is(:hover,:focus-visible)::before,
        .contact-cta:is(:hover,:focus-visible)::after {
          animation-play-state: running;
        }
        @keyframes gradient-angle { to { --gradient-angle: 360deg; } }
        @keyframes shimmer-contact { to { rotate: 360deg; } }
      `}</style>

      <section
        ref={sectionRef}
        id="contact"
        className="relative w-full h-svh overflow-hidden hidden sm:block"
      >
        {/* Radial blue tint — aurora shows through from layout */}
        <div className="absolute inset-0 pointer-events-none bg-radial-[circle_at_center] from-blue-500/8 via-transparent to-transparent" />

        {/* Pinned headline (parallaxes out as pills converge) */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex items-center justify-center will-change-transform pointer-events-none select-none"
        >
          <h2
            className="text-center font-bold leading-[0.9] tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase w-full px-4"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
              Let&apos;s Build
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700">
              Something Great
            </span>
          </h2>
        </div>

        {/* Floating pills layer */}
        <div
          ref={pillsLayerRef}
          className="absolute inset-0 pointer-events-none"
        >
          {PILLS.map((pill, i) => (
            <div
              key={pill.label}
              ref={el => { if (el) pillWrapRefs.current[i] = el }}
              className="absolute will-change-[top,left]"
              style={{
                top:       `${pill.top}%`,
                left:      `${pill.left}%`,
                transform: 'translate(-50%,-50%)',
                padding:   'clamp(0.3rem, 1.2vw, 0.75rem) clamp(0.5rem, 2vw, 1.25rem)',
              }}
            >
              {/* Pill glass box */}
              <div
                ref={el => { if (el) pillBoxRefs.current[i] = el }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-[width,height,border-radius]"
                style={{
                  minWidth:     '100%',
                  minHeight:    '100%',
                  background:   'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                  border:       '0.125rem solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  boxShadow:    '0 1px 0 0 rgba(255,255,255,0.08) inset, 0 -1px 0 0 rgba(0,0,0,0.4) inset',
                }}
              />
              <div className="cta-pill-label relative z-10">
                <p className="text-zinc-300 text-[9px] sm:text-xs uppercase tracking-widest whitespace-nowrap">
                  {pill.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Shiny button (pills morph into this) */}
        <div
          ref={buttonRef}
          className="contact-cta absolute top-1/2 left-1/2 opacity-0 will-change-[width,height,transform]"
          style={{
            width:     '3rem',
            height:    '3rem',
            transform: 'translate(-50%, -50%)',
            padding:   0,
          }}
        >
          <a
            href="/contact"
            className="cta-inner opacity-0 absolute inset-0 flex items-center justify-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              Get in Touch
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </div>

        {/* Final CTA text block (fades in last) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            ref={ctaRef}
            className="flex flex-col items-center text-center gap-5 opacity-0 w-full"
            style={{ transform: 'translateY(-50px)' }}
          >
            <h2
              className="text-center font-bold leading-[0.9] tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase w-full px-4"
              style={{ fontFamily: 'var(--font-hero)' }}
            >
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
                Let&apos;s Build
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700">
                Something Great
              </span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl text-center font-light leading-relaxed px-6">
              Ready to turn your idea into a product that scales?<br />
              Let&apos;s talk &mdash; no commitment required.
            </p>
          </div>
        </div>

      </section>

      {/* ── Mobile: static CTA only ── */}
      <section id="contact-mobile" className="sm:hidden relative w-full min-h-svh flex flex-col items-center justify-center gap-8 px-6 bg-zinc-950/60">
        <div className="absolute inset-0 pointer-events-none bg-radial-[circle_at_center] from-blue-500/8 via-transparent to-transparent" />
        <div className="relative flex flex-col items-center text-center gap-6">
          <h2
            className="font-bold leading-[0.9] tracking-tighter text-5xl uppercase"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
              Let&apos;s Build
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700">
              Something<br />Great
            </span>
          </h2>
          <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xs">
            Ready to turn your idea into a product that scales?<br />
            Let&apos;s talk &mdash; no commitment required.
          </p>
          <a href="/contact" className="contact-cta" style={{ borderRadius: '0.5rem' }}>
            Get in Touch
            <svg className="inline-block ml-2 w-4 h-4 align-middle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </>
  )
}
