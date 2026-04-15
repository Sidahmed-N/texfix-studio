'use client'
import React, { useState, useEffect, useRef } from 'react'
import { AnimatedList } from '@/components/ui/animated-list'
import AnimatedBadge from '@/components/ui/animated-badge'


const notifications = [
  { name: 'Requirements', message: 'Project scope document ready', time: '2m ago' },
  { name: 'Strategy', message: 'Tech stack confirmed: Next.js', time: '5m ago' },
  { name: 'Client', message: 'Budget approved. Ready to go!', time: '10m ago' },
  { name: 'Design', message: 'Wireframes shared for review', time: '15m ago' },
  { name: 'Timeline', message: 'Sprint 1 starts Monday', time: '20m ago' },
  { name: 'API', message: 'Third-party integrations mapped', time: '25m ago' },
  { name: 'Security', message: 'Auth flow architecture done', time: '30m ago' },
]

type DeployPhase = 'idle' | 'launch' | 'live'

// ── Build terminal sequence ─────────────────────────────────────────────────
const BUILD_SEQUENCE: Array<{ cmd: string; out: string[] }> = [
  { cmd: 'npm run build',  out: ['✔ TypeScript compiled', '✔ Bundle optimized · 98 kB'] },
  { cmd: 'npm test',       out: ['✔ 42 tests passed', '✔ Coverage: 94%'] },
  { cmd: 'npm run deploy', out: ['✔ Deployed to texfix.dev'] },
]
const TYPE_MS   = 48
const OUTPUT_MS = 220
const PAUSE_MS  = 700
const DONE_MS   = 1800

type BLine = { kind: 'cmd' | 'out'; text: string }

function BuildTerminal() {
  const [history, setHistory]   = useState<BLine[]>([])
  const [typing, setTyping]     = useState('')
  const [cursor, setCursor]     = useState(true)
  const scrollRef               = useRef<HTMLDivElement>(null)

  // blink cursor
  useEffect(() => {
    const t = setInterval(() => setCursor(v => !v), 530)
    return () => clearInterval(t)
  }, [])

  // auto-scroll within container only
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history, typing])

  // sequencer
  useEffect(() => {
    let cancelled = false
    const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    async function run() {
      await delay(400)
      while (!cancelled) {
        for (const { cmd, out } of BUILD_SEQUENCE) {
          // type command
          for (let i = 0; i <= cmd.length; i++) {
            if (cancelled) return
            setTyping(cmd.slice(0, i))
            await delay(TYPE_MS + Math.random() * 20)
          }
          await delay(120)
          if (cancelled) return
          // commit command line
          setHistory(h => [...h, { kind: 'cmd', text: cmd }])
          setTyping('')
          await delay(OUTPUT_MS)
          // print output lines
          for (const line of out) {
            if (cancelled) return
            setHistory(h => [...h, { kind: 'out', text: line }])
            await delay(OUTPUT_MS)
          }
          await delay(PAUSE_MS)
        }
        // done — hold then reset
        await delay(DONE_MS)
        if (cancelled) return
        setHistory([])
        setTyping('')
        await delay(400)
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a] overflow-hidden font-mono text-[11px] select-none">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 flex-shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"/>
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"/>
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"/>
        <span className="ml-auto text-zinc-700 text-[9px] tracking-widest">bash</span>
      </div>
      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-hidden p-3 space-y-1.5">
        {history.map((l, i) => (
          <div key={i} className="leading-snug">
            {l.kind === 'cmd' ? (
              <div className="flex items-center gap-1.5">
                <span className="text-blue-500 flex-shrink-0">❯</span>
                <span className="text-zinc-200">{l.text}</span>
              </div>
            ) : (
              <div className="pl-4 text-emerald-400">{l.text}</div>
            )}
          </div>
        ))}
        {/* Active typing line */}
        <div className="flex items-center gap-1.5 leading-snug">
          <span className="text-blue-500 flex-shrink-0">❯</span>
          <span className="text-zinc-200">{typing}</span>
          <span
            className="inline-block w-[5px] h-[13px] bg-blue-400 align-middle"
            style={{ opacity: cursor ? 1 : 0, transition: 'opacity 0.1s' }}
          />
        </div>
      </div>
    </div>
  )
}

const STARS = [
  { top:'7%',  left:'9%',  s:1.5, d:'0s',   dur:'2.2s' },
  { top:'13%', left:'70%', s:1,   d:'0.6s', dur:'1.8s' },
  { top:'24%', left:'38%', s:1,   d:'1.1s', dur:'2.5s' },
  { top:'16%', left:'54%', s:2,   d:'0.3s', dur:'1.6s' },
  { top:'33%', left:'83%', s:1.5, d:'0.9s', dur:'2.1s' },
  { top:'46%', left:'16%', s:1,   d:'1.4s', dur:'1.9s' },
  { top:'9%',  left:'87%', s:1.5, d:'0.2s', dur:'2.7s' },
  { top:'42%', left:'4%',  s:1,   d:'0.7s', dur:'1.7s' },
  { top:'19%', left:'93%', s:1,   d:'1.5s', dur:'2.4s' },
  { top:'53%', left:'62%', s:1.5, d:'0.4s', dur:'1.5s' },
]

function RocketLaunch() {
  const [phase, setPhase] = useState<DeployPhase>('idle')
  const [tick, setTick]   = useState(0)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const go = (p: DeployPhase) => {
      setPhase(p); setTick(0)
      if (p === 'idle')   t = setTimeout(() => go('launch'), 1600)
      if (p === 'launch') t = setTimeout(() => go('live'),   2100)
      if (p === 'live')   t = setTimeout(() => go('idle'),   3200)
    }
    go('idle')
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== 'live') return
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  const pad = (n: number) => String(n).padStart(2, '0')
  const uptime = `${pad(Math.floor(tick / 60))}:${pad(tick % 60)}`

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <style>{`
        @keyframes rl-star   { 0%,100%{opacity:.12} 50%{opacity:.65} }
        @keyframes rl-idle   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes rl-fly    { 0%{transform:translateY(0);opacity:1} 35%{opacity:1} 100%{transform:translateY(-220px);opacity:0} }
        @keyframes rl-plume  { 0%,100%{transform:scaleY(1);opacity:.9} 45%{transform:scaleY(1.45);opacity:.65} 75%{transform:scaleY(.85);opacity:.95} }
        @keyframes rl-orbit  { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes rl-reveal { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rl-shake  { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-1.5px)} 75%{transform:translateX(1.5px)} }
      `}</style>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
        zIndex: 1,
      }}/>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white pointer-events-none" style={{
          top: s.top, left: s.left, width: s.s, height: s.s,
          animation: `rl-star ${s.dur} ease-in-out ${s.d} infinite`,
          zIndex: 2,
        }}/>
      ))}

      {/* Atmosphere horizon glow */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(59,130,246,0.07) 0%, transparent 100%)',
        zIndex: 2,
      }}/>

      {/* ── IDLE + LAUNCH ── */}
      {phase !== 'live' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-end"
          style={{
            paddingBottom: '2.75rem',
            animation: phase === 'launch' ? 'rl-shake 0.12s ease-in-out 4' : undefined,
            zIndex: 3,
          }}
        >
          {/* Rocket + plume, flies on launch */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            animation: phase === 'launch'
              ? 'rl-fly 2.1s cubic-bezier(0.4,0,0.6,1) forwards'
              : 'rl-idle 2s ease-in-out infinite',
          }}>
            {/* Rocket */}
            <svg width="32" height="58" viewBox="0 0 32 58" fill="none"
              style={{ filter: 'drop-shadow(0 0 7px rgba(147,197,253,0.45))' }}>
              <defs>
                <linearGradient id="rl-nose" x1="16" y1="3" x2="16" y2="18" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#93c5fd"/>
                  <stop offset="100%" stopColor="#dbeafe"/>
                </linearGradient>
                <linearGradient id="rl-body" x1="8" y1="18" x2="24" y2="46" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f1f5f9"/>
                  <stop offset="100%" stopColor="#cbd5e1"/>
                </linearGradient>
              </defs>
              {/* Fuselage */}
              <path d="M16 5 C11 5 8 12 8 22 L8 42 L16 47 L24 42 L24 22 C24 12 21 5 16 5Z" fill="url(#rl-body)"/>
              {/* Nose cone */}
              <path d="M16 5 C12 5 9 10 8 16 L16 19 L24 16 C23 10 20 5 16 5Z" fill="url(#rl-nose)"/>
              {/* Highlight */}
              <path d="M13 5.5 C11.5 6 10 10 9.5 14" stroke="white" strokeWidth="0.6" strokeOpacity="0.5" strokeLinecap="round"/>
              {/* Window ring */}
              <circle cx="16" cy="27" r="4.8" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.2"/>
              <circle cx="16" cy="27" r="2.4" fill="#3b82f6" opacity="0.75"/>
              <circle cx="14.5" cy="25.5" r="0.9" fill="white" opacity="0.55"/>
              {/* Panel lines */}
              <line x1="16" y1="19" x2="16" y2="42" stroke="rgba(148,163,184,0.25)" strokeWidth="0.6"/>
              {/* Left fin */}
              <path d="M8 35 L2 47 L11 44 Z" fill="#94a3b8"/>
              {/* Right fin */}
              <path d="M24 35 L30 47 L21 44 Z" fill="#94a3b8"/>
              {/* Nozzle */}
              <path d="M12 43 L11 49 L16 51 L21 49 L20 43Z" fill="#475569"/>
              <rect x="13" y="42" width="6" height="3" rx="1" fill="#334155"/>
            </svg>

            {/* Thrust plume */}
            <div style={{
              marginTop: '-1px',
              transformOrigin: 'top center',
              animation: 'rl-plume 0.11s ease-in-out infinite',
              opacity: phase === 'launch' ? 1 : 0.45,
              transition: 'opacity 0.3s',
            }}>
              <svg width="20" height={phase === 'launch' ? 34 : 18} viewBox="0 0 20 34" fill="none">
                <defs>
                  <linearGradient id="rl-plume" x1="10" y1="0" x2="10" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"  stopColor="#f1f5f9" stopOpacity="0.95"/>
                    <stop offset="35%" stopColor="#93c5fd" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <ellipse cx="10" cy="6"  rx="4.5" ry="6"   fill="url(#rl-plume)"/>
                <ellipse cx="10" cy="15" rx="3"   ry="9"   fill="url(#rl-plume)" opacity="0.65"/>
                <ellipse cx="10" cy="24" rx="1.8" ry="9"   fill="url(#rl-plume)" opacity="0.35"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Launch platform (idle only) */}
      {phase === 'idle' && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" style={{ zIndex: 3 }}>
          <div className="flex items-end gap-0.5">
            <div className="w-2 h-5 rounded-t-sm bg-zinc-700" style={{ transform: 'skewX(6deg)' }}/>
            <div className="w-14 h-1.5 rounded-sm bg-zinc-700"/>
            <div className="w-2 h-5 rounded-t-sm bg-zinc-700" style={{ transform: 'skewX(-6deg)' }}/>
          </div>
          <div className="w-20 h-1 rounded-full bg-zinc-700"/>
          <div className="w-24 h-0.5 rounded-full bg-zinc-800"/>
          <div className="w-20 h-2 rounded-full" style={{
            background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.28) 0%, transparent 70%)',
            filter: 'blur(3px)',
          }}/>
        </div>
      )}

      {/* ── LIVE / ORBIT STATE ── */}
      {phase === 'live' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5"
          style={{ animation: 'rl-reveal 0.45s ease-out forwards', zIndex: 3 }}>

          {/* Orbital system */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Orbit path */}
            <svg width="96" height="96" viewBox="0 0 96 96" className="absolute inset-0">
              <ellipse cx="48" cy="48" rx="42" ry="16" stroke="#3b82f6"
                strokeWidth="1" strokeOpacity="0.3" fill="none" strokeDasharray="5 4"/>
            </svg>
            {/* Earth / planet */}
            <svg width="32" height="32" viewBox="0 0 32 32" className="relative z-10">
              <defs>
                <radialGradient id="rl-planet" cx="38%" cy="32%" r="62%">
                  <stop offset="0%"   stopColor="#1d4ed8"/>
                  <stop offset="100%" stopColor="#0f172a"/>
                </radialGradient>
              </defs>
              <circle cx="16" cy="16" r="15" fill="url(#rl-planet)" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.45"/>
              <path d="M9 12 Q13 9 16 13 Q18 16 14 18 Q10 16 9 12Z" fill="#1e40af" opacity="0.55"/>
              <path d="M18 14 Q22 12 23 17 Q21 20 18 18Z"            fill="#1e40af" opacity="0.45"/>
              {/* Atmosphere rim */}
              <circle cx="16" cy="16" r="15" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeOpacity="0.1"/>
            </svg>
            {/* Satellite dot */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 84, height: 32,
              animation: 'rl-orbit 2.8s linear infinite',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 7, height: 7, borderRadius: '50%',
                background: '#93c5fd',
                boxShadow: '0 0 6px #3b82f6, 0 0 14px rgba(59,130,246,0.5)',
              }}/>
            </div>
          </div>

          {/* Status text */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"/>
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-emerald-400">DEPLOYED · LIVE</span>
            </div>
            <span className="font-mono text-[9px] tracking-widest text-zinc-600">texfix.dev · uptime {uptime}</span>
          </div>
        </div>
      )}

      {/* Status chip — top-right */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[9px] tracking-widest" style={{ zIndex: 4 }}>
        <span className={`w-1 h-1 rounded-full inline-block ${
          phase === 'idle'   ? 'bg-zinc-600' :
          phase === 'launch' ? 'bg-blue-400 animate-pulse' :
                               'bg-emerald-400 animate-pulse'
        }`}/>
        <span className={
          phase === 'idle'   ? 'text-zinc-600' :
          phase === 'launch' ? 'text-blue-400' :
                               'text-emerald-400'
        }>
          {phase === 'idle' ? 'PRE-LAUNCH' : phase === 'launch' ? 'LIFTOFF' : 'IN ORBIT'}
        </span>
      </div>

      {/* Telemetry bottom */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-zinc-700 tracking-widest" style={{ zIndex: 4 }}>
        <span>deploy pipeline</span>
        <span>v2.4.1</span>
      </div>
    </div>
  )
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="process-step group relative overflow-hidden flex flex-col h-full rounded-2xl bg-black [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] hover:[border:1px_solid_rgba(59,130,246,0.35)] transition-all duration-500">
      {/* Blue radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 30% 30%, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
      />
      {/* Content sits above glow layer */}
      <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
        {children}
      </div>
    </div>
  )
}

export default function Process() {
  return (
    <section id="process" className="py-28 relative bg-black/60">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="flex justify-center mb-2">
            <AnimatedBadge text="Methodology" color="#3B82F6" />
          </div>
          <h2 className="font-display text-4xl font-medium uppercase">
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">Our</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700">Development Process</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm max-w-xl mx-auto">
            From discovery to deployment, every project follows a structured, transparent process — so you always know what's being built, why, and when it ships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-stretch">

          {/* Step 1 */}
          <CardShell>
            <span className="self-start mb-6 inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-zinc-900 text-xs text-zinc-300 font-mono tracking-widest shadow-lg">
              STEP 01
            </span>
            <div className="h-64 relative rounded-xl bg-black/40 border border-white/5 overflow-hidden mb-6">
              <AnimatedList>
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="flex w-full max-w-[280px] items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2.5 shadow-md backdrop-blur-sm"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-signal/20 border border-signal/30 text-xs font-bold text-signal">
                      {n.name.charAt(0)}
                    </div>
                    <div className="flex flex-1 flex-col min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white truncate">{n.name}</span>
                        <span className="text-[10px] text-zinc-500 flex-shrink-0">{n.time}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 truncate">{n.message}</span>
                    </div>
                  </div>
                ))}
              </AnimatedList>
            </div>
            <h3 className="font-display text-2xl text-white font-semibold tracking-tight mb-2">Discovery &amp; Planning</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              We analyze requirements, define architecture, and design technical specifications.
            </p>
          </CardShell>

          {/* Step 2 */}
          <CardShell>
            <span className="self-start mb-6 inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-zinc-900 text-xs text-zinc-300 font-mono tracking-widest shadow-lg">
              STEP 02
            </span>
            <div className="h-64 rounded-xl overflow-hidden mb-6 relative border border-white/5">
              <BuildTerminal />
            </div>
            <h3 className="font-display text-2xl text-white font-semibold tracking-tight mb-2">Development &amp; Testing</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              We build the solution, maintain communication, and perform quality testing.
            </p>
          </CardShell>

          {/* Step 3 */}
          <CardShell>
            <span className="self-start mb-6 inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-zinc-900 text-xs text-zinc-300 font-mono tracking-widest shadow-lg">
              STEP 03
            </span>
            <div className="h-64 rounded-xl bg-black/40 border border-white/5 overflow-hidden mb-6 relative">
              <RocketLaunch />
            </div>
            <h3 className="font-display text-2xl text-white font-semibold tracking-tight mb-2">Deployment &amp; Support</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              We deploy to production, train staff, and provide ongoing maintenance.
            </p>
          </CardShell>

        </div>
      </div>
    </section>
  )
}
