import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { useContent } from '../context/ContentContext'

export default function Testimonials() {
  const [ref, inView] = useInView()
  const { homepageContent } = useContent()
  const { testimonials } = homepageContent
  const [startIndex, setStartIndex] = useState(0)

  const items = testimonials.items || []
  const hasCarousel = items.length > 3
  
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1)
    }
  }

  const handleNext = () => {
    if (startIndex < items.length - 3) {
      setStartIndex(prev => prev + 1)
    }
  }

  // Get the 3 items currently visible starting from startIndex
  const visibleItems = hasCarousel ? items.slice(startIndex, startIndex + 3) : items

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
          className="font-head text-[clamp(40px,5vw,80px)] leading-[0.95] tracking-[-1px] font-[800] mb-12 text-ink"
        >
          {testimonials.title}
        </motion.h2>

        {/* Carousel Navigation (Visible only if > 3 testimonials) */}
        {hasCarousel && (
          <div className="flex justify-center items-center gap-6 mb-12">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`p-3 border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                startIndex === 0
                  ? 'border-white/5 text-muted/30 cursor-not-allowed'
                  : 'border-gold/30 text-gold hover:border-gold hover:bg-gold/5'
              }`}
              title="Предыдущие"
            >
              <ChevronLeft size={18} />
            </button>
            
            <span className="font-mono text-xs text-muted uppercase tracking-[2px]">
              {startIndex + 1} – {startIndex + 3} из {items.length}
            </span>

            <button
              onClick={handleNext}
              disabled={startIndex >= items.length - 3}
              className={`p-3 border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                startIndex >= items.length - 3
                  ? 'border-white/5 text-muted/30 cursor-not-allowed'
                  : 'border-gold/30 text-gold hover:border-gold hover:bg-gold/5'
              }`}
              title="Следующие"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/5">
          {visibleItems.map((r, i) => {
            const initialChar = r.author ? r.author.trim().charAt(0).toUpperCase() : 'К'
            return (
              <motion.div
                key={r.author || (startIndex + i)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-navy-2 p-10 text-left border border-transparent hover:border-gold/15 transition-colors duration-300 group"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array(5).fill(0).map((_, j) => {
                    const isFilled = j < (r.rating || 5);
                    return (
                      <Star key={j} size={14} className={isFilled ? 'fill-gold text-gold' : 'text-gold/20'} />
                    )
                  })}
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
