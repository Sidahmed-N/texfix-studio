'use client'
import { Icon } from '@iconify/react'
import { useReveal, wordStyle } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import { AnimatedList } from '@/components/ui/animated-list'
import { AnimatedBeamBg } from '@/components/ui/animated-beam-bg'
import { GlobeBg } from '@/components/ui/globe-bg'
import { ThreeDMarquee } from '@/components/ui/3d-marquee'
import AnimatedBadge from '@/components/ui/animated-badge'

// â”€â”€ Bottom tech marquee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const techStack = [
  { icon: 'logos:react', label: 'React' },
  { icon: 'logos:nodejs-icon', label: 'Node.js' },
  { icon: 'logos:typescript-icon', label: 'TypeScript' },
  { icon: 'logos:nextjs-icon', label: 'Next.js' },
  { icon: 'logos:docker-icon', label: 'Docker' },
  { icon: 'logos:postgresql', label: 'PostgreSQL' },
  { icon: 'logos:aws', label: 'AWS' },
  { icon: 'logos:graphql', label: 'GraphQL' },
  { icon: 'logos:tailwindcss-icon', label: 'Tailwind' },
  { icon: 'logos:figma', label: 'Figma' },
  { icon: 'logos:python', label: 'Python' },
  { icon: 'logos:vercel-icon', label: 'Vercel' },
]

// â”€â”€ Card 1 background: animated agency activity feed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface ActivityItem {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

const agencyActivity: ActivityItem[] = [
  { name: 'Deployment live',        description: 'texfix.dev · v2.1.0 shipped',        icon: '🚀', color: '#00C9A7', time: 'just now' },
  { name: 'Sprint completed',       description: 'E-commerce platform · Phase 2',       icon: '✅', color: '#3B82F6', time: '2m ago'   },
  { name: 'Client approved',        description: 'Homepage redesign · Final review',    icon: '💬', color: '#FFB800', time: '5m ago'   },
  { name: 'Perf. milestone hit',    description: '98 / 100 Lighthouse · CWV green',     icon: '⚡', color: '#8B5CF6', time: '12m ago'  },
  { name: 'Security audit passed',  description: '0 vulnerabilities · OWASP clean',    icon: '🔒', color: '#10B981', time: '1h ago'   },
  { name: 'New project kicked off', description: 'SaaS dashboard · 8-week roadmap',    icon: '📋', color: '#F59E0B', time: '2h ago'   },
]

function AgencyActivity({ name, description, icon, color, time }: ActivityItem) {
  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-xl p-3',
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        'transform-gpu bg-transparent backdrop-blur-md',
        '[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
        '[border:1px_solid_rgba(255,255,255,.08)]',
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-9 items-center justify-center rounded-lg flex-shrink-0"
          style={{ backgroundColor: color + '22' }}
        >
          <span className="text-base">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden flex-1">
          <div className="flex items-center gap-1 text-sm font-medium text-white">
            <span className="truncate">{name}</span>
            <span className="text-zinc-600 flex-shrink-0">·</span>
            <span className="text-xs text-zinc-500 flex-shrink-0 whitespace-nowrap">{time}</span>
          </div>
          <p className="text-xs text-zinc-400 truncate">{description}</p>
        </div>
      </div>
    </figure>
  )
}

function AnimatedListBg() {
  return (
    <div className="absolute inset-0 overflow-hidden p-3 pt-6 [mask-image:linear-gradient(to_top,transparent_15%,#000_100%)]">
      <AnimatedList>
        {agencyActivity.map((item, i) => (
          <AgencyActivity key={i} {...item} />
        ))}
      </AnimatedList>
    </div>
  )
}

// â”€â”€ Card 2 background: animated beam (AnimatedBeamBg imported from ui) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€ Card 3 background: 3D scrolling tech stack marquee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const techTiles = [
  { icon: 'logos:react',           label: 'React',        bg: '#0e1e2e' },
  { icon: 'logos:nextjs-icon',     label: 'Next.js',      bg: '#111'    },
  { icon: 'logos:typescript-icon', label: 'TypeScript',   bg: '#0a1628' },
  { icon: 'logos:nodejs-icon',     label: 'Node.js',      bg: '#0e1e0e' },
  { icon: 'logos:postgresql',      label: 'PostgreSQL',   bg: '#0a1628' },
  { icon: 'logos:tailwindcss-icon',label: 'Tailwind',     bg: '#0a1e1e' },
  { icon: 'logos:docker-icon',     label: 'Docker',       bg: '#0a1628' },
  { icon: 'logos:graphql',         label: 'GraphQL',      bg: '#1e0a1e' },
  { icon: 'logos:aws',             label: 'AWS',          bg: '#1e1000' },
  { icon: 'logos:prisma',          label: 'Prisma',       bg: '#111'    },
  { icon: 'logos:redis',           label: 'Redis',        bg: '#1e0a0a' },
  { icon: 'logos:vercel-icon',     label: 'Vercel',       bg: '#111'    },
  { icon: 'logos:github-icon',     label: 'GitHub',       bg: '#111'    },
  { icon: 'logos:figma',           label: 'Figma',        bg: '#1a0e1e' },
  { icon: 'logos:stripe',          label: 'Stripe',       bg: '#0a1028' },
  { icon: 'logos:mongodb-icon',    label: 'MongoDB',      bg: '#0e1e0e' },
  { icon: 'logos:jest',            label: 'Jest',         bg: '#1e0a0a' },
  { icon: 'logos:storybook-icon',  label: 'Storybook',    bg: '#1e0a14' },
  { icon: 'logos:linux-tux',       label: 'Linux',        bg: '#111'    },
  { icon: 'logos:git-icon',        label: 'Git',          bg: '#1e0e0a' },
]

function TechTile({ icon, label, bg }: { icon: string; label: string; bg: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-zinc-800/60 p-3 w-[72px] h-[72px]"
      style={{ backgroundColor: bg }}
    >
      <Icon icon={icon} className="text-2xl" />
      <span className="text-[9px] text-zinc-500 font-mono leading-none">{label}</span>
    </div>
  )
}

function TechGridBg() {
  const tiles = techTiles.map((t, i) => <TechTile key={i} {...t} />)
  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_15%,#000_80%)] overflow-hidden">
      <ThreeDMarquee items={tiles} columns={4} className="w-full h-full pt-4" />
    </div>
  )
}

// â”€â”€ Card 4 background: uptime / SLA visual â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const UPTIME = 0.999
const R = 42
const CIRC = 2 * Math.PI * R

function UptimeBg() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pb-12 [mask-image:linear-gradient(to_top,transparent_25%,#000_100%)]">
      {/* Circular progress ring */}
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={R}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${UPTIME * CIRC} ${CIRC}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-display font-bold text-white">99.9%</span>
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Uptime</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex gap-8">
        <div className="text-center">
          <div className="text-xl font-bold text-white font-display">&lt;2h</div>
          <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Response</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white font-display">24/7</div>
          <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Support</div>
        </div>
      </div>

      {/* Live status pill */}
      <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(74,222,128,0.7)] animate-pulse" />
        <span className="text-[10px] text-zinc-400 font-mono">All systems operational</span>
      </div>
    </div>
  )
}

// â”€â”€ Feature definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const features = [
  {
    icon: 'lucide:activity',
    name: 'Always Shipping',
    description:
      'Continuous delivery, total visibility — every sprint, every deploy, every win.',
    href: '/about',
    cta: 'See how we work',
    className: 'col-span-5 lg:col-span-2',
    background: <AnimatedListBg />,
  },
  {
    icon: 'lucide:globe',
    name: 'Available Worldwide',
    description:
      'We work with clients across every timezone — remote-first, async-ready, always reachable wherever you are.',
    href: '/about',
    cta: 'Work with us',
    className: 'col-span-5 lg:col-span-3',
    background: <GlobeBg />,
  },
  {
    icon: 'lucide:layers',
    name: 'Full-Stack Expertise',
    description:
      'React, Next.js, Node, TypeScript, PostgreSQL, AWS and more — your entire stack, mastered.',
    href: '/about',
    cta: 'Explore capabilities',
    className: 'col-span-5 lg:col-span-3',
    background: <TechGridBg />,
  },
  {
    icon: 'lucide:share-2',
    name: 'Seamless Integrations',
    description:
      'Client brief in — Next.js, React, AI and cloud deployments out. We connect your vision to the full modern stack.',
    href: '/about',
    cta: 'Explore capabilities',
    className: 'col-span-5 lg:col-span-2',
    background: <AnimatedBeamBg />,
  },
]

// â”€â”€ Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function About() {
  const { ref: revealRef, visible } = useReveal(0.2)
  return (
    <section id="about" className="py-24 border-y border-zinc-900 bg-zinc-950/50 relative">
      {/* Ambient glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 gap-4">
          <div>
            <div className="flex justify-center mb-2">
              <AnimatedBadge text="Philosophy" color="#3B82F6" />
            </div>
            {/* @ts-expect-error ref typing */}
            <h2 ref={revealRef} className="text-4xl font-medium leading-tight uppercase">
              <span className="block">
                {['Engineered', 'for'].map((w, i) => (
                  <span key={w} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.2em' }}>
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500" style={wordStyle(visible, i * 0.12)}>{w}</span>
                  </span>
                ))}
              </span>
              <span className="block">
                {['Growth'].map((w, i) => (
                  <span key={w} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.2em' }}>
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700" style={wordStyle(visible, 0.24 + i * 0.12)}>{w}</span>
                  </span>
                ))}
              </span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: visible ? 'opacity 0.8s ease 0.6s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s' : 'none' }}>
            We don&apos;t just write code. We build digital infrastructure that scales with your
            ambition.
          </p>
        </div>

        {/* Magic-UI-style Bento Grid */}
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>

      {/* Tech Marquee */}
      <div className="py-6 bg-black/20 border-t border-zinc-800 relative overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content gap-16 px-8">
            {[...techStack, ...techStack].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-zinc-400 text-xs uppercase tracking-widest hover:text-white transition-colors"
              >
                <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}



