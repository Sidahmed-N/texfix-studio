import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import ScrollToSection from '@/components/ScrollToSection'

const About       = dynamic(() => import('@/components/sections/About'))
const Projects    = dynamic(() => import('@/components/sections/Projects'))
const Process     = dynamic(() => import('@/components/sections/Process'))
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'))
const Contact     = dynamic(() => import('@/components/sections/Contact'))

export default function Home() {
  return (
    <main>
      <ScrollToSection />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Process />
      <Testimonials />
      <Contact />
    </main>
  )
}
