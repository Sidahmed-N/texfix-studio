import { AnimatedShinyButton } from '@/components/ui/animated-shiny-button'
import LiveButton from '@/components/ui/live-button'
import AnimatedBadge from '@/components/ui/animated-badge'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden pt-20"
    >
      {/* Background blobs */}
      <div data-hero-bg className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] hero-gradient opacity-20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-6xl mx-auto">
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <AnimatedBadge
            text="Software Development Agency"
            color="#3B82F6"
          />
        </div>

        {/* Headline */}
        <h1 className="font-bold leading-[0.95] tracking-tighter mb-6 mix-blend-screen relative hero-title" style={{ fontFamily: 'var(--font-hero)' }}>
          <span className="block text-[11vw] md:text-[5.5vw]">
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.2em' }}>
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">CUSTOM</span>
            </span>
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">SOFTWARE</span>
            </span>
          </span>
          <span className="block text-[11vw] md:text-[5.5vw]">
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">SOLUTIONS</span>
            </span>
          </span>
        </h1>

        {/* Subheading */}
        <div className="max-w-2xl mx-auto space-y-8">
          <p className="text-xs md:text-sm text-zinc-400 text-center leading-relaxed" style={{ fontFamily: 'var(--font-hero)' }}>
            {['Custom', 'websites,', 'apps,', 'and', 'software', 'made', 'to', 'fit', 'your', 'vision.'].map((word, i) => (
              <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.28em' }}>
                <span className="block">
                  {word}
                </span>
              </span>
            ))}
            <br />
            <span className="text-zinc-500">
              {['From', 'a', 'landing', 'page', 'to', 'a', 'full', 'SaaS', 'platform,', 'we', 'build', 'it', 'right.'].map((word, i) => (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.28em' }}>
                  <span className="block">
                    {word}
                  </span>
                </span>
              ))}
            </span>
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <AnimatedShinyButton url="/work">
              Show Our Work
            </AnimatedShinyButton>
            <span className="hidden sm:block">
              <LiveButton text="Contact Us" url="/contact" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}



