import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useParticles } from '../hooks/useParticles.js'
import EagleLogo from './EagleLogo.jsx'
import { useContent } from '../context/ContentContext'

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 40 },
  animate:   { opacity: 1, y: 0  },
  transition:{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  const canvasRef = useRef(null)
  useParticles(canvasRef)
  const { homepageContent } = useContent()
  const { hero, stats } = homepageContent

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-navy">

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,149,26,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,149,26,0.03) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Spotlight beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        {['-18deg', '18deg', '0deg'].map((rot, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 mx-auto -top-5 w-[600px] h-[110vh] rounded-b-full animate-beam-sway"
            style={{
              background: `conic-gradient(from 0deg at 50% 0%, transparent 43%, rgba(232,149,26,${i===2?'.16':'.10'}) 48%, rgba(232,149,26,${i===2?'.28':'.18'}) 50%, rgba(232,149,26,${i===2?'.16':'.10'}) 52%, transparent 57%)`,
              transform: `rotate(${rot})`,
              filter: 'blur(18px)',
              opacity: 0.9,
              transformOrigin: '50% 0',
              animationDelay: `${i * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Horizontal accent lines */}
      {[22, 40, 62, 80].map((pct, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-px pointer-events-none z-[2]"
          style={{
            top: `${pct}%`,
            background: 'linear-gradient(90deg, transparent, rgba(232,149,26,0.1), transparent)',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.6 + i * 0.2, ease: 'easeOut' }}
        />
      ))}

      {/* Left fade overlay */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(7,9,15,1) 0%, rgba(7,9,15,0.88) 38%, rgba(7,9,15,0.45) 62%, rgba(7,9,15,0.05) 100%)',
        }}
      />

      {/* RIGHT — Logo Eagle (фон удалён через Canvas API) */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] flex items-center justify-center z-[3] pointer-events-none overflow-hidden">
        {/* Glow halo */}
        <div className="absolute w-[520px] h-[520px] rounded-full animate-glow-pulse"
          style={{ 
            background: 'radial-gradient(ellipse, rgba(232,149,26,0.32) 0%, transparent 68%)',
            willChange: 'transform, opacity',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden'
          }}
        />
        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-[120px] pointer-events-none animate-scan-line"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(232,149,26,0.08) 40%, rgba(232,149,26,0.18) 50%, rgba(232,149,26,0.08) 60%, transparent)',
          }}
        />

        <motion.div
          className="relative w-[min(500px,82%)] animate-float"
          style={{
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden'
          }}
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0,  scale: 1    }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <EagleLogo
            className="w-full select-none"
            style={{
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden'
            }}
          />
        </motion.div>

        {/* Right edge line */}
        <div
          className="absolute right-12 top-[15%] bottom-[15%] w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(232,149,26,0.4), transparent)' }}
        />
      </div>

      {/* LEFT — Content */}
      <div className="relative z-[5] max-w-[1400px] mx-auto px-6 md:px-12 pt-28 pb-20 w-full">

        {/* Tag */}
        <motion.div {...fadeUp(0.2)} className="inline-flex items-center gap-3 border border-gold/20 px-5 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-xs font-bold tracking-[3px] uppercase text-gold">
            {hero.tag}
          </span>
        </motion.div>

        {/* Headline */}
        <div className="font-head leading-[0.88] mb-8">
          <motion.span
            {...fadeUp(0.35)}
            className="block text-[clamp(56px,8.5vw,138px)] font-[800] tracking-[-2px] text-ink"
          >
            {hero.headline_1}
          </motion.span>
          <motion.span
            {...fadeUp(0.48)}
            className="block text-[clamp(56px,8.5vw,138px)] font-[800] tracking-[-2px] text-gold"
          >
            {hero.headline_2}
          </motion.span>
          <motion.span
            {...fadeUp(0.60)}
            className="block text-[clamp(56px,8.5vw,138px)] font-[800] tracking-[-2px] text-ink"
          >
            {hero.headline_3}
          </motion.span>
        </div>

        {/* Subtitle */}
        <motion.p {...fadeUp(0.72)}
          className="text-[17px] text-muted max-w-[500px] leading-[1.7] mb-10"
        >
          {hero.subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div {...fadeUp(0.82)} className="flex flex-wrap gap-4 mb-16">
          <a href="#portfolio"
            className="clip-hex inline-flex items-center gap-2 bg-gold text-navy text-sm font-bold tracking-[1.5px] uppercase px-9 py-4 hover:bg-gold-glow transition-colors duration-200 group"
          >
            {hero.cta_primary}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#contact"
            className="inline-flex items-center gap-2 border border-gold/25 text-ink text-sm font-medium tracking-[1px] uppercase px-8 py-4 hover:border-gold hover:text-gold transition-all duration-200"
          >
            {hero.cta_secondary}
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.92)} className="flex flex-wrap gap-10">
          {stats && stats.map(s => (
            <div key={s.label}>
              <div className="font-head text-[46px] leading-none text-gold tracking-[2px]">{s.num}</div>
              <div className="text-xs font-medium tracking-[2px] uppercase text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[6] flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-muted/60" />
        </motion.div>
      </div>
    </section>
  )
}
