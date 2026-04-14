'use client'

import { Fragment, useRef, useState, useTransition } from 'react'
import gsap from 'gsap'
import {
  SERVICES,
  PROJECT_TYPES,
  FEATURES,
  COMPANY_TYPES,
  STEP_LABELS,
  STEP_TITLES,
  type ServiceId,
} from '@/lib/form-data'
import { calculatePrice } from '@/lib/pricing'
import { sendConsultation } from '@/app/actions/send-consultation'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5

interface FormState {
  serviceId:   ServiceId | null
  projectType: string | null
  features:    string[]
  companyType: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDZD(n: number) {
  return n.toLocaleString('fr-DZ') + ' DZD'
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-10">
      {STEP_LABELS.map((label, i) => {
        const num    = i + 1
        const done   = num < step
        const active = num === step

        return (
          <Fragment key={label}>
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                style={done ? {
                  background: 'linear-gradient(160deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: '1px solid rgba(59,130,246,0.6)',
                  boxShadow: '0 0 14px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
                  color: '#fff',
                } : active ? {
                  background: 'linear-gradient(175deg, rgba(59,130,246,0.12) 0%, rgba(0,0,0,0.4) 100%)',
                  border: '1px solid rgba(59,130,246,0.5)',
                  boxShadow: '0 0 10px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.10)',
                  color: '#93c5fd',
                  backdropFilter: 'blur(8px)',
                } : {
                  background: 'linear-gradient(175deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.2) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  color: '#52525b',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {done ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : num}
              </div>
              <span
                className={`text-[10px] tracking-widest uppercase hidden sm:block transition-colors duration-300 ${
                  active ? 'text-blue-400' : done ? 'text-zinc-500' : 'text-zinc-700'
                }`}
              >
                {label}
              </span>
            </div>

            {i < STEP_LABELS.length - 1 && (
              <div
                className="flex-1 h-px mx-3 mb-5 transition-all duration-500"
                style={{ background: num < step
                  ? 'linear-gradient(90deg, rgba(59,130,246,0.8), rgba(59,130,246,0.4))'
                  : 'rgba(255,255,255,0.06)'
                }}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

// ─── Option Card ──────────────────────────────────────────────────────────────

function OptionCard({
  label,
  icon,
  description,
  selected,
  onClick,
}: {
  label:        string
  icon?:        string
  description?: string
  selected:     boolean
  onClick:      () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full text-left p-4 rounded-xl transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ef-option-card"
      style={selected ? {
        background: 'linear-gradient(175deg, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.06) 50%, rgba(0,0,0,0.20) 100%)',
        border: '1px solid rgba(59,130,246,0.45)',
        boxShadow: '0 0 28px rgba(59,130,246,0.14), inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -2px 0 rgba(0,0,0,0.30), 0 0 0 1px rgba(59,130,246,0.10)',
        backdropFilter: 'blur(14px)',
      } : undefined}
    >
      {/* Check dot */}
      {selected && (
        <div
          className="absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(160deg, #60a5fa 0%, #2563eb 100%)',
            boxShadow: '0 0 8px rgba(59,130,246,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {icon && (
        <span className="block text-xl mb-2 leading-none">{icon}</span>
      )}

      <p
        className={`text-sm font-medium pr-5 transition-colors duration-150 leading-snug ${
          selected ? 'text-white' : 'text-zinc-300 group-hover:text-white'
        }`}
      >
        {label}
      </p>

      {description && (
        <p
          className={`text-xs mt-1.5 leading-relaxed transition-colors duration-150 ${
            selected ? 'text-blue-200/60' : 'text-zinc-600 group-hover:text-zinc-500'
          }`}
        >
          {description}
        </p>
      )}
    </button>
  )
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span className="text-zinc-600 text-xs uppercase tracking-widest w-28 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-zinc-200 text-sm leading-relaxed">{value || '—'}</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EstimationForm() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>({
    serviceId:   null,
    projectType: null,
    features:    [],
    companyType: null,
  })
  const [outcome,        setOutcome]        = useState<'talk' | 'budget' | null>(null)
  const [budget,         setBudget]         = useState('')
  const [budgetSent,     setBudgetSent]     = useState(false)
  const [customFeature,  setCustomFeature]  = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const [contactName,  setContactName]  = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactMsg,   setContactMsg]   = useState('')
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [contactError, setContactError] = useState('')
  const [isPending, startTransition] = useTransition()

  const contentRef = useRef<HTMLDivElement>(null)

  // ── GSAP step transition ────────────────────────────────────────────────────

  function animateToStep(next: Step, dir: 'forward' | 'back') {
    const el = contentRef.current
    if (!el) { setStep(next); return }

    const xOut = dir === 'forward' ? -44 : 44
    const xIn  = dir === 'forward' ? 44 : -44

    gsap.to(el, {
      x: xOut, opacity: 0, duration: 0.22, ease: 'power2.in',
      onComplete() {
        setStep(next)
        setShowCustomInput(false)
        setCustomFeature('')
        if (dir === 'back') {
          setOutcome(null)
          setBudgetSent(false)
          setBudget('')
        }
        gsap.fromTo(el,
          { x: xIn, opacity: 0 },
          { x: 0,   opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
      },
    })
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  function canProceed(): boolean {
    if (step === 1) return !!form.serviceId
    if (step === 2) return !!form.projectType
    if (step === 3) return true          // features are optional
    if (step === 4) return !!form.companyType
    return false
  }

  const handleNext = () => { if (canProceed()) animateToStep((step + 1) as Step, 'forward') }
  const handleBack = () => { if (step > 1)     animateToStep((step - 1) as Step, 'back')    }

  // ── Price ───────────────────────────────────────────────────────────────────

  const price =
    form.serviceId && form.projectType && form.companyType
      ? calculatePrice(form.serviceId, form.projectType, form.features, form.companyType)
      : null

  const hasCustom = form.features.some(f => f.startsWith('Custom: '))

  const serviceLabel = SERVICES.find(s => s.id === form.serviceId)?.label ?? ''

  // ── Render steps ────────────────────────────────────────────────────────────

  function renderBody() {
    switch (step) {

      // ── Step 1: Service Type ─────────────────────────────────────────────
      case 1:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SERVICES.map(s => (
              <OptionCard
                key={s.id}
                label={s.label}
                icon={s.icon}
                selected={form.serviceId === s.id}
                onClick={() =>
                  setForm(prev => ({
                    ...prev,
                    serviceId:   s.id,
                    projectType: null,
                    features:    [],
                  }))
                }
              />
            ))}
          </div>
        )

      // ── Step 2: Project Type ─────────────────────────────────────────────
      case 2:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(form.serviceId ? PROJECT_TYPES[form.serviceId] : []).map(pt => (
              <OptionCard
                key={pt}
                label={pt}
                selected={form.projectType === pt}
                onClick={() =>
                  setForm(prev => ({ ...prev, projectType: pt, features: [] }))
                }
              />
            ))}
          </div>
        )

      // ── Step 3: Features ─────────────────────────────────────────────────
      case 3:
        return (
          <div>
            <p className="text-zinc-600 text-xs uppercase tracking-widest mb-4">
              Select all that apply — optional
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(form.serviceId ? FEATURES[form.serviceId] : []).map(f => (
                <OptionCard
                  key={f}
                  label={f}
                  selected={form.features.includes(f)}
                  onClick={() =>
                    setForm(prev => ({
                      ...prev,
                      features: prev.features.includes(f)
                        ? prev.features.filter(x => x !== f)
                        : [...prev.features, f],
                    }))
                  }
                />
              ))}
            </div>

            {/* Custom features chips */}
            {form.features.filter(f => f.startsWith('Custom: ')).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {form.features.filter(f => f.startsWith('Custom: ')).map(f => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                    style={{
                      background: 'linear-gradient(160deg, rgba(124,58,237,0.18) 0%, rgba(0,0,0,0.25) 100%)',
                      border: '1px solid rgba(124,58,237,0.35)',
                      color: '#c4b5fd',
                    }}
                  >
                    <svg className="w-3 h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
                    {f.replace('Custom: ', '')}
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, features: prev.features.filter(x => x !== f) }))}
                      className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add custom feature */}
            <div className="mt-4">
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
                  style={{
                    background: 'linear-gradient(175deg, rgba(124,58,237,0.08) 0%, rgba(0,0,0,0.18) 100%)',
                    border: '1px dashed rgba(124,58,237,0.30)',
                    color: '#a78bfa',
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
                  Add custom feature
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. Loyalty points system"
                    value={customFeature}
                    onChange={e => setCustomFeature(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const trimmed = customFeature.trim()
                        if (trimmed) {
                          const tagged = `Custom: ${trimmed}`
                          if (!form.features.includes(tagged)) {
                            setForm(prev => ({ ...prev, features: [...prev.features, tagged] }))
                          }
                        }
                        setCustomFeature('')
                        setShowCustomInput(false)
                      }
                      if (e.key === 'Escape') {
                        setCustomFeature('')
                        setShowCustomInput(false)
                      }
                    }}
                    className="ef-budget-input flex-1"
                    style={{ maxWidth: '280px' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = customFeature.trim()
                      if (trimmed) {
                        const tagged = `Custom: ${trimmed}`
                        if (!form.features.includes(tagged)) {
                          setForm(prev => ({ ...prev, features: [...prev.features, tagged] }))
                        }
                      }
                      setCustomFeature('')
                      setShowCustomInput(false)
                    }}
                    className="px-3 py-2 rounded-lg text-sm transition-all duration-200"
                    style={{
                      background: 'linear-gradient(160deg, #a78bfa 0%, #7c3aed 100%)',
                      border: '1px solid rgba(124,58,237,0.6)',
                      boxShadow: '0 0 16px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.20)',
                      color: '#fff',
                    }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCustomFeature(''); setShowCustomInput(false) }}
                    className="px-3 py-2 rounded-lg text-sm transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#71717a',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      // ── Step 4: Company Type ─────────────────────────────────────────────
      case 4:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {COMPANY_TYPES.map(c => (
              <OptionCard
                key={c.id}
                label={c.label}
                description={c.description}
                selected={form.companyType === c.label}
                onClick={() =>
                  setForm(prev => ({ ...prev, companyType: c.label }))
                }
              />
            ))}
          </div>
        )

      // ── Step 5: Result ───────────────────────────────────────────────────
      case 5:
        return (
          <div className="space-y-3">

            {/* Summary card */}
            <div
              className="rounded-xl p-5"
              style={{
                background: 'linear-gradient(175deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.15) 100%)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.07), inset 0 -2px 0 rgba(0,0,0,0.25), 0 4px 24px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-3">
                Project Summary
              </p>
              <SummaryRow label="Service"      value={serviceLabel}            />
              <SummaryRow label="Project Type" value={form.projectType ?? ''}  />
              <SummaryRow
                label="Features"
                value={form.features.length > 0
                  ? form.features.map(f => f.startsWith('Custom: ') ? `★ ${f.replace('Custom: ', '')}` : f).join(', ')
                  : 'None selected'}
              />
              <SummaryRow label="Company" value={form.companyType ?? ''} />
            </div>

            {/* Price card */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'linear-gradient(160deg, rgba(59,130,246,0.20) 0%, rgba(59,130,246,0.06) 50%, rgba(0,0,0,0.25) 100%)',
                border: '1px solid rgba(59,130,246,0.35)',
                boxShadow: '0 0 60px rgba(59,130,246,0.10), inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -2px 0 rgba(0,0,0,0.30), 0 4px 32px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <p className="text-blue-400/60 text-[10px] uppercase tracking-widest mb-3">
                Estimated Budget Range
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none">
                {price
                  ? <>{fmtDZD(price.min)} <span className="text-zinc-500">—</span> {fmtDZD(price.max)}</>
                  : '—'
                }
              </p>
              <p className="text-zinc-600 text-xs mt-3">
                Estimates in Algerian Dinars (DZD) · Final quote after consultation
              </p>
              {hasCustom && (
                <p className="text-amber-400/70 text-xs mt-2">
                  ⚠ Custom features will be scoped and priced separately before the final quote.
                </p>
              )}
            </div>

            {/* CTA buttons */}
            {!outcome && (
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOutcome('talk')}
                  className="flex-1 py-3 px-5 rounded-lg text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(160deg, #60a5fa 0%, #2563eb 100%)',
                    border: '1px solid rgba(59,130,246,0.6)',
                    boxShadow: '0 0 28px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.20)',
                  }}
                >
                  Yes, let&apos;s talk
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setOutcome('budget')}
                  className="flex-1 py-3 px-5 rounded-lg text-zinc-300 hover:text-white font-medium text-sm transition-all duration-200"
                  style={{
                    background: 'linear-gradient(175deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.20) 100%)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.20)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  My budget is lower
                </button>
              </div>
            )}

            {/* Outcome: talk — inline contact form */}
            {outcome === 'talk' && (
              <div
                className="rounded-xl p-6 space-y-5"
                style={{
                  background: 'linear-gradient(160deg, rgba(59,130,246,0.16) 0%, rgba(59,130,246,0.04) 60%, rgba(0,0,0,0.20) 100%)',
                  border: '1px solid rgba(59,130,246,0.30)',
                  boxShadow: '0 0 40px rgba(59,130,246,0.08), inset 0 2px 0 rgba(255,255,255,0.10), inset 0 -2px 0 rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(14px)',
                }}
              >
                {contactStatus === 'sent' ? (
                  <div className="text-center space-y-3 py-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                      style={{
                        background: 'linear-gradient(160deg, rgba(34,197,94,0.20) 0%, rgba(22,163,74,0.15) 100%)',
                        border: '1px solid rgba(34,197,94,0.35)',
                        boxShadow: '0 0 20px rgba(34,197,94,0.25)',
                      }}
                    >
                      <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-white font-medium text-base">Request sent!</p>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      We&apos;ll review your project and get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center space-y-1">
                      <p className="text-white font-medium text-base leading-relaxed">
                        Book a free consultation
                      </p>
                      <p className="text-zinc-500 text-sm">
                        No commitment — we&apos;ll discuss your project in detail.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-1.5">
                            Name <span className="text-blue-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={contactName}
                            onChange={e => setContactName(e.target.value)}
                            placeholder="Your full name"
                            disabled={contactStatus === 'sending'}
                            className="ef-budget-input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-1.5">
                            Email <span className="text-blue-400">*</span>
                          </label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={e => setContactEmail(e.target.value)}
                            placeholder="you@example.com"
                            disabled={contactStatus === 'sending'}
                            className="ef-budget-input w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-1.5">
                          Phone / WhatsApp <span className="text-zinc-700 normal-case tracking-normal">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={e => setContactPhone(e.target.value)}
                          placeholder="+213 XXX XXX XXX"
                          disabled={contactStatus === 'sending'}
                          className="ef-budget-input w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-500 text-xs uppercase tracking-widest mb-1.5">
                          Message <span className="text-zinc-700 normal-case tracking-normal">(optional)</span>
                        </label>
                        <textarea
                          value={contactMsg}
                          onChange={e => setContactMsg(e.target.value)}
                          placeholder="Tell us about your project, timeline, or any questions..."
                          rows={3}
                          disabled={contactStatus === 'sending'}
                          className="ef-budget-input w-full resize-none"
                        />
                      </div>
                    </div>

                    {contactStatus === 'error' && contactError && (
                      <p className="text-red-400/90 text-xs text-center">{contactError}</p>
                    )}

                    <div className="flex flex-col items-center gap-3 pt-1">
                      <button
                        type="button"
                        disabled={!contactName.trim() || !contactEmail.trim() || contactStatus === 'sending'}
                        onClick={() => {
                          setContactStatus('sending')
                          setContactError('')
                          startTransition(async () => {
                            const result = await sendConsultation({
                              name: contactName.trim(),
                              email: contactEmail.trim(),
                              phone: contactPhone.trim(),
                              message: contactMsg.trim(),
                              service: serviceLabel,
                              projectType: form.projectType ?? '',
                              features: form.features,
                              companyType: form.companyType ?? '',
                              priceMin: price?.min ?? null,
                              priceMax: price?.max ?? null,
                            })
                            if (result.ok) {
                              setContactStatus('sent')
                            } else {
                              setContactStatus('error')
                              setContactError(result.error || 'Something went wrong.')
                            }
                          })
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: 'linear-gradient(160deg, #60a5fa 0%, #2563eb 100%)',
                          border: '1px solid rgba(59,130,246,0.6)',
                          boxShadow: '0 0 24px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
                        }}
                      >
                        {contactStatus === 'sending' ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Request
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setOutcome(null); setContactStatus('idle'); setContactError('') }}
                        className="text-zinc-700 hover:text-zinc-400 text-xs transition-colors"
                      >
                        ← Go back
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Outcome: budget — input */}
            {outcome === 'budget' && !budgetSent && (
              <div
                className="rounded-xl p-5 space-y-4"
                style={{
                  background: 'linear-gradient(175deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.15) 100%)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.07), inset 0 -2px 0 rgba(0,0,0,0.25), 0 4px 24px rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(14px)',
                }}
              >
                <p className="text-zinc-200 text-sm font-medium">What&apos;s your budget?</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && budget.trim()) setBudgetSent(true) }}
                    placeholder="e.g. 50,000"
                    className="ef-budget-input flex-1"
                  />
                  <span
                    className="text-zinc-500 text-sm px-3 py-2.5 rounded-lg whitespace-nowrap"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    DZD
                  </span>
                  <button
                    type="button"
                    onClick={() => { if (budget.trim()) setBudgetSent(true) }}
                    disabled={!budget.trim()}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                    style={budget.trim() ? {
                      background: 'linear-gradient(160deg, #60a5fa 0%, #2563eb 100%)',
                      border: '1px solid rgba(59,130,246,0.6)',
                      boxShadow: '0 0 18px rgba(59,130,246,0.30), inset 0 1px 0 rgba(255,255,255,0.20)',
                      color: '#fff',
                    } : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#52525b',
                      cursor: 'not-allowed',
                    }}
                  >
                    Send
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setOutcome(null)}
                  className="text-zinc-700 hover:text-zinc-400 text-xs transition-colors"
                >
                  ← Go back
                </button>
              </div>
            )}

            {/* Outcome: budget — sent */}
            {outcome === 'budget' && budgetSent && (
              <div
                className="rounded-xl p-6 text-center space-y-3"
                style={{
                  background: 'linear-gradient(175deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.15) 100%)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.07), inset 0 -2px 0 rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(14px)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                  style={{
                    background: 'linear-gradient(160deg, rgba(59,130,246,0.20) 0%, rgba(29,78,216,0.15) 100%)',
                    border: '1px solid rgba(59,130,246,0.35)',
                    boxShadow: '0 0 12px rgba(59,130,246,0.25)',
                  }}
                >
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-white font-medium">Got it!</p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  We&apos;ll review your budget and get back to you within 24 hours.
                </p>
              </div>
            )}

          </div>
        )

      default:
        return null
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      <style>{`
        .ef-option-card {
          background: linear-gradient(175deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.18) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.03), 0 4px 16px rgba(0,0,0,0.30);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .ef-option-card:hover {
          background: linear-gradient(175deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.14) 100%);
          border-color: rgba(255,255,255,0.18);
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -2px 0 rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.06), 0 6px 24px rgba(0,0,0,0.40);
        }
        .ef-budget-input {
          width: 100%;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: #fff;
          outline: none;
          border-radius: 0.5rem;
          background: linear-gradient(175deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.15) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.07), inset 0 -2px 0 rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.03);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ef-budget-input::placeholder { color: rgba(113,113,122,0.5); }
        .ef-budget-input:focus {
          border-color: rgba(59,130,246,0.50);
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.07), inset 0 -2px 0 rgba(0,0,0,0.30), 0 0 0 1px rgba(59,130,246,0.20), 0 0 16px rgba(59,130,246,0.10);
        }

        @property --ef-gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --ef-gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --ef-gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }
        @property --ef-gradient-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }
        .ef-shiny-btn {
          --shiny-cta-bg: #000000;
          --shiny-cta-bg-subtle: #0f1729;
          --shiny-cta-fg: #ffffff;
          --shiny-cta-highlight: #3B82F6;
          --shiny-cta-highlight-subtle: #60A5FA;
          --animation: ef-gradient-angle linear infinite;
          --duration: 3s;
          --shadow-size: 2px;
          --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);
          isolation: isolate;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          padding: 0.6rem 1.5rem;
          font-size: 0.875rem;
          line-height: 1.2;
          font-weight: 500;
          border: 1px solid transparent;
          border-radius: 0.5rem;
          color: var(--shiny-cta-fg);
          background:
            linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
            conic-gradient(
              from calc(var(--ef-gradient-angle) - var(--ef-gradient-angle-offset)),
              transparent,
              var(--shiny-cta-highlight) var(--ef-gradient-percent),
              var(--ef-gradient-shine) calc(var(--ef-gradient-percent) * 2),
              var(--shiny-cta-highlight) calc(var(--ef-gradient-percent) * 3),
              transparent calc(var(--ef-gradient-percent) * 4)
            ) border-box;
          animation: var(--animation);
          animation-duration: var(--duration);
          transition: var(--transition);
          transition-property: --ef-gradient-angle-offset, --ef-gradient-percent, --ef-gradient-shine, box-shadow;
        }
        .ef-shiny-btn:hover {
          box-shadow: 0 0 20px rgba(59,130,246,0.4), inset 0 0 20px rgba(59,130,246,0.1);
          --ef-gradient-percent: 20%;
          --ef-gradient-angle-offset: 95deg;
          --ef-gradient-shine: var(--shiny-cta-highlight-subtle);
        }
        .ef-shiny-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }
        .ef-shiny-btn::before,
        .ef-shiny-btn::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          transform: translateX(-50%);
        }
        .ef-shiny-btn::before {
          top: -1px;
          width: 60%;
          height: var(--shadow-size);
          background: linear-gradient(90deg, transparent, var(--shiny-cta-highlight-subtle), var(--shiny-cta-highlight), var(--shiny-cta-highlight-subtle), transparent);
          filter: blur(var(--shadow-size));
          opacity: 0;
          transition: opacity var(--transition);
        }
        .ef-shiny-btn:hover::before { opacity: 1; }
        .ef-shiny-btn::after {
          bottom: -1px;
          width: 40%;
          height: var(--shadow-size);
          background: linear-gradient(90deg, transparent, var(--shiny-cta-highlight), transparent);
          filter: blur(calc(var(--shadow-size) / 1.5));
          opacity: 0;
          transition: opacity var(--transition);
        }
        .ef-shiny-btn:hover::after { opacity: 1; }
        @keyframes ef-gradient-angle {
          to { --ef-gradient-angle: 360deg; }
        }
      `}</style>

      {/* Progress bar */}
      <ProgressBar step={step} />

      {/* Animated content wrapper */}
      <div ref={contentRef}>

        {/* Step header */}
        <div className="mb-6">
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] mb-2">
            {step < 5 ? `Step ${step} of 4` : 'Complete'}
          </p>
          <h3
            className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            {STEP_TITLES[step]}
          </h3>
        </div>

        {/* Step body */}
        {renderBody()}

      </div>

      {/* Navigation — steps 1–4 */}
      {step < 5 && (
        <div className="flex items-center justify-between mt-8">

          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-zinc-700 bg-transparent px-5 py-2 text-sm transition-all duration-500 ease-out before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:transition-transform before:duration-700 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 hover:before:translate-x-[100%] active:scale-95"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <svg className="relative z-10 w-4 h-4 text-white group-hover:text-blue-300 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="relative z-10 font-medium tracking-wide text-white group-hover:text-blue-300 transition-colors duration-300">Back</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="ef-shiny-btn flex items-center gap-2"
          >
            {step === 3 && form.features.length === 0 ? 'Skip Features' : step === 4 ? 'See Estimate' : 'Next'}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>
      )}

      {/* Back from result — step 5 */}
      {step === 5 && !budgetSent && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleBack}
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-zinc-700 bg-transparent px-5 py-2 text-sm transition-all duration-500 ease-out before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:transition-transform before:duration-700 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 hover:before:translate-x-[100%] active:scale-95"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <svg className="relative z-10 w-4 h-4 text-white group-hover:text-blue-300 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="relative z-10 font-medium tracking-wide text-white group-hover:text-blue-300 transition-colors duration-300">Edit Estimate</span>
          </button>
        </div>
      )}

    </div>
  )
}
