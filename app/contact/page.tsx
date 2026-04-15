'use client'

import { useRef, useEffect, type CSSProperties, useState } from 'react'
import EstimationForm from '@/components/EstimationForm'

const TITLE_LINES = [
  ['LET\'S'],
  ['BUILD'],
  ['TOGETHER.'],
]

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function fadeUp(visible: boolean, delay: number): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  }
}

export default function ContactPage() {
  let wordIndex = 0

  const { ref: formRef, visible: formVisible } = useReveal()

  // Dim the global aurora on this page so content reads clearly
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('.aura-background-component')
    if (!el) return
    const original = el.style.opacity
    el.style.opacity = '0.12'
    el.style.transition = 'opacity 0.6s ease'
    return () => {
      el.style.opacity = original || ''
    }
  }, [])

  return (
    <main className="min-h-screen bg-transparent text-white">

      {/* ── Hero ── */}
      <section className="relative flex items-start px-8 md:px-16 lg:px-28 pt-24 md:pt-44 pb-24">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-[900px] flex-1">
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-zinc-600" />
            <span className="text-zinc-500 font-sans text-xs uppercase tracking-[0.3em]">Contact</span>
          </div>

          <h1
            className="font-bold leading-[0.9] tracking-tighter"
            style={{ fontFamily: 'var(--font-hero)', fontVariationSettings: '"wght" 632' }}
          >
            {TITLE_LINES.map((line, li) => (
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
                          word === 'TOGETHER.'
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

          {/* Paragraph — mobile/tablet only (below title) */}
          <div className="lg:hidden mt-8 max-w-sm">
            <p className="text-zinc-400 font-sans text-sm leading-relaxed">
              Whether you have a fully formed idea or just a problem worth solving, we want to hear about it.
              Tell us what you are working on and we will get back to you within 24 hours.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-end self-end pb-2 max-w-[320px] ml-16 shrink-0">
          <p className="text-zinc-400 font-sans text-sm leading-relaxed">
            Whether you have a fully formed idea or just a problem worth solving, we want to hear about it.
            Tell us what you are working on and we will get back to you within 24 hours.
          </p>
          <span className="mt-4 text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans">
            {new Date().getFullYear()} · Texfix Studio
          </span>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="px-8 md:px-16 lg:px-28">
        <div className="h-px w-full bg-white/8" />
      </div>

      {/* ── Form Section ── */}
      <section
        ref={formRef as React.RefObject<HTMLElement>}
        className="px-8 md:px-16 lg:px-28 pt-20 pb-36"
      >
        <div className="flex flex-col xl:flex-row gap-20 xl:gap-16">

          {/* Left: estimation form */}
          <div className="flex-1 min-w-0" style={fadeUp(formVisible, 0)}>
            <div
              className="rounded-2xl p-6 md:p-10"
              style={{
                background: 'linear-gradient(175deg, rgba(255,255,255,0.06) 0%, rgba(10,10,15,0.92) 40%, rgba(0,0,0,0.97) 100%)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: 'inset 0 -20px 80px -20px rgba(255,255,255,0.12), inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.30), 0 8px 60px rgba(0,0,0,0.70), 0 0 60px rgba(59,130,246,0.06)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <EstimationForm />
            </div>
          </div>

          {/* Right: contact info */}
          <div
            className="xl:w-[280px] shrink-0 flex flex-col gap-10 pt-0 xl:pt-10"
            style={fadeUp(formVisible, 0.15)}
          >
            {/* Direct email */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans">Direct</span>
              <a
                href="mailto:texfix.info@gmail.com"
                className="text-sm text-zinc-300 hover:text-white transition-colors duration-200 font-sans"
              >
                texfix.info@gmail.com
              </a>
            </div>

            {/* Response time */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans">Response time</span>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                We respond to all inquiries within 24 hours, Saturday–Thursday.
              </p>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans">Follow</span>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Instagram', href: 'https://www.instagram.com/texfix.agency/' },
                  { label: 'TikTok', href: 'https://www.tiktok.com/@texfixstdio?lang=fr' },
                  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61585389652103&locale=fr_FR' },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-sans"
                  >
                    <span>{link.label}</span>
                    <span className="text-zinc-700 group-hover:text-zinc-400 transition-colors duration-200 text-xs">↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans">Based in</span>
              <p className="text-sm text-zinc-400 font-sans">Worldwide · Remote-first</p>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}
