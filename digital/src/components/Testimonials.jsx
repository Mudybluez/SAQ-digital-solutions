import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { useContent } from '../context/ContentContext'

export default function Testimonials() {
  const [ref, inView] = useInView()
  const { homepageContent } = useContent()
  const { testimonials } = homepageContent

  return (
    <section id="about" className="relative bg-navy">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-28 text-center" ref={ref}>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 text-xs font-bold tracking-[4px] uppercase text-gold mb-4"
        >
          <span className="w-8 h-px bg-gold" />{testimonials.tag}<span className="w-8 h-px bg-gold" />
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-head text-[clamp(40px,5vw,80px)] leading-[0.95] tracking-[-1px] font-[800] mb-16 text-ink"
        >
          {testimonials.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/5">
          {testimonials.items && testimonials.items.map((r, i) => {
            const initialChar = r.author ? r.author.trim().charAt(0).toUpperCase() : 'К'
            return (
              <motion.div
                key={r.author || i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.12 * i }}
                className="bg-navy-2 p-10 text-left border border-transparent hover:border-gold/15 transition-colors duration-300 group"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-[15px] text-ink/90 leading-[1.75] italic mb-8">"{r.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="clip-hex-sm w-11 h-11 bg-navy-3 border border-gold/20 flex items-center justify-center
                                  font-head text-lg text-gold group-hover:border-gold/40 transition-colors">
                    {initialChar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{r.author}</div>
                    <div className="text-xs text-muted mt-0.5">{r.role}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
