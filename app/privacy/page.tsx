'use client'

import { useRef, useEffect, useState, type CSSProperties } from 'react'
import type React from 'react'

function useReveal(threshold = 0.1) {
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
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  }
}

const SECTIONS = [
  {
    title: 'What we collect',
    body: 'When you fill out our contact form, we collect your name and email address. Nothing else — no tracking pixels, no cookies beyond what Next.js requires to serve the page, no third-party data brokers.',
  },
  {
    title: 'Why we collect it',
    body: 'Your name and email are used solely to respond to your project inquiry. We reply to understand what you are building, ask follow-up questions, and get a conversation started. That is it.',
  },
  {
    title: 'How we store it',
    body: 'Submitted contact form data is sent directly to our inbox at texfix.info@gmail.com via your email client — we do not store it in any database or third-party CRM. Once your project is complete or you ask us to delete it, your contact details are removed from our inbox.',
  },
  {
    title: 'Who we share it with',
    body: 'Nobody. We do not sell, rent, or share your personal information with advertisers, data brokers, or any third party. Your details stay between you and Texfix Studio.',
  },
  {
    title: 'Your rights',
    body: 'You can ask us at any time to view, correct, or delete the information you shared with us. Just email texfix.info@gmail.com with the subject "Data Request" and we will respond within 48 hours.',
  },
  {
    title: 'Changes to this policy',
    body: 'If we ever change how we handle your data, we will update this page. The date at the bottom reflects when it was last revised.',
  },
]

export default function PrivacyPage() {
  let wordIndex = 0

  const { ref: bodyRef, visible: bodyVisible } = useReveal()

  return (
    <main className="min-h-screen bg-transparent text-white">

      {/* ── Hero ── */}
      <section className="relative flex items-start px-8 md:px-16 lg:px-28 pt-44 pb-20">
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-blue-500/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-[800px] flex-1">
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-zinc-600" />
            <span className="text-zinc-500 font-sans text-xs uppercase tracking-[0.3em]">Legal</span>
          </div>

          <h1
            className="font-bold leading-[0.9] tracking-tighter"
            style={{ fontFamily: 'var(--font-hero)', fontVariationSettings: '"wght" 632' }}
          >
            {[['PRIVACY'], ['POLICY.']].map((line, li) => (
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
                          word === 'POLICY.'
                            ? 'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700'
                            : 'bg-gradient-to-b from-white via-white to-zinc-500'
                        }`}
                        style={{
                          fontSize: 'clamp(3rem, 8vw, 7rem)',
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

          <p
            className="mt-8 text-zinc-500 font-sans text-sm leading-relaxed max-w-xl"

          >
            Simple and honest. We only collect what we need to get back to you about your project.
          </p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="px-8 md:px-16 lg:px-28">
        <div className="h-px w-full bg-white/8" />
      </div>

      {/* ── Body ── */}
      <section ref={bodyRef as React.RefObject<HTMLElement>} className="px-8 md:px-16 lg:px-28 pt-16 pb-36 max-w-[800px]">
        <div className="flex flex-col gap-12">
          {SECTIONS.map((section, i) => (
            <div key={section.title} className="flex flex-col gap-3" style={fadeUp(bodyVisible, i * 0.08)}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-600 font-sans tabular-nums">0{i + 1}</span>
                <span className="block flex-1 h-px bg-white/6" />
              </div>
              <h2
                className="text-lg font-semibold text-white font-sans"
              >
                {section.title}
              </h2>
              <p className="text-zinc-400 font-sans text-sm leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}

          {/* Last updated */}
          <div style={fadeUp(bodyVisible, SECTIONS.length * 0.08)} className="pt-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans">
              Last updated · April 2026
            </span>
          </div>
        </div>
      </section>

    </main>
  )
}
