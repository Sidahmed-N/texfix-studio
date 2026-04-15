'use client'

import { forwardRef, useRef } from 'react'
import { Icon } from '@iconify/react'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full',
        'border border-zinc-700 bg-zinc-900 shadow-[0_0_12px_rgba(0,0,0,0.5)]',
        className,
      )}
    >
      {children}
    </div>
  ),
)
Circle.displayName = 'Circle'

// ── Inline SVGs for icons that need white/custom colours on dark bg ────────────

function NextjsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0z" />
    </svg>
  )
}

// Anthropic's logo — two stacked triangular peaks
function ClaudeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.813 11.61L12.054 3.67L8.296 11.61zm-1.595.652H9.89L7.59 17.258h9.93zm2.432 5l-2.117-4.346H9.552L7.451 17.262H5.18L12.054 2.87l6.874 14.39z"
        fill="#CC9B7A"
      />
    </svg>
  )
}

function VercelIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 22.525H0L12 1.475z" />
    </svg>
  )
}

function GeminiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gemini-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="100%" stopColor="#9747FF" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C12 2 14.5 9.5 22 12C14.5 14.5 12 22 12 22C12 22 9.5 14.5 2 12C9.5 9.5 12 2 12 2Z"
        fill="url(#gemini-g)"
      />
    </svg>
  )
}

// ── Component ───────────────────────────────────────────────────────────────────
export function AnimatedBeamBg({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const clientRef    = useRef<HTMLDivElement>(null)
  const hubRef       = useRef<HTMLDivElement>(null)
  const reactRef     = useRef<HTMLDivElement>(null)
  const claudeRef    = useRef<HTMLDivElement>(null)
  const dockerRef    = useRef<HTMLDivElement>(null)
  const vercelRef    = useRef<HTMLDivElement>(null)
  const githubRef    = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 flex items-start justify-center overflow-hidden px-10 pt-6 pb-10',
        '[mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]',
        className,
      )}
    >
      {/* ── Grid pattern background ─────────────────────────────────────── */}
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

      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">

        {/* ── Left: client input ──────────────────────────────────────── */}
        <div className="flex flex-col justify-center">
          <Circle ref={clientRef} className="border-zinc-600">
            <User className="w-5 h-5 text-zinc-300" />
          </Circle>
        </div>

        {/* ── Center: TexFix hub ──────────────────────────────────────── */}
        <div className="flex flex-col justify-center">
          <Circle
            ref={hubRef}
            className="size-16 border-signal/60 bg-zinc-950 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
          >
            <span className="font-display font-bold text-2xl text-signal leading-none">T</span>
          </Circle>
        </div>

        {/* ── Right: tech output stack ─────────────────────────────────── */}
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={reactRef}>
            <Icon icon="logos:react" className="text-xl" />
          </Circle>
          <Circle ref={claudeRef}>
            <ClaudeIcon />
          </Circle>
          <Circle ref={dockerRef}>
            <Icon icon="logos:docker-icon" className="text-xl" />
          </Circle>
          <Circle ref={vercelRef}>
            <VercelIcon />
          </Circle>
          <Circle ref={githubRef}>
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </Circle>
        </div>
      </div>

      {/* ── Client → TexFix ──────────────────────────────────────────── */}
      <AnimatedBeam containerRef={containerRef} fromRef={clientRef} toRef={hubRef} duration={3.5} />

      {/* ── TexFix → each output ─────────────────────────────────────── */}
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={reactRef}  duration={3.5} delay={0.2}  curvature={80} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={claudeRef} duration={4}   delay={0.5}  curvature={40} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={dockerRef} duration={3}   delay={0.15} curvature={0} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={vercelRef} duration={3.5} delay={0.35} curvature={-40} />
      <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={githubRef} duration={3}   delay={0.25} curvature={-80} />
    </div>
  )
}

