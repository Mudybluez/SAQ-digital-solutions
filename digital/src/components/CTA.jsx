import { motion } from 'framer-motion'
import { Send, Mail } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { useContent } from '../context/ContentContext'

export default function CTA() {
  const [ref, inView] = useInView()
  const { theme } = useContent()

  return (
    <section id="contact" className="relative bg-navy-2 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Background logo watermark */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55%] pointer-events-none opacity-[0.03] select-none">
        <img src="/logo.png" alt="" className="w-full" style={{ mixBlendMode: theme === 'light' ? 'multiply' : 'screen' }} />
      </div>

      {/* Gold radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 25% 50%, rgba(232,149,26,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-28" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 text-xs font-bold tracking-[4px] uppercase text-gold mb-6"
            >
              <span className="w-8 h-px bg-gold" />Готовы начать?
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-head text-[clamp(52px,7vw,110px)] leading-[0.9] tracking-[-1px] font-[800]"
            >
              Давайте<br />создадим<br /><span className="text-gold">что-то</span><br />крутое
            </motion.h2>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-5"
          >
            <p className="text-[16px] text-muted leading-[1.7] mb-2">
              Расскажите нам о своём проекте — мы свяжемся с вами в течение нескольких часов
              и предложим оптимальное решение.
            </p>

            <a
              href="https://t.me/saqdev"
              target="_blank" rel="noopener"
              className="clip-hex inline-flex items-center justify-center gap-3 bg-gold text-navy
                         text-sm font-bold tracking-[1.5px] uppercase py-5 px-10
                         hover:bg-gold-glow transition-colors duration-200 group w-full"
            >
              <Send size={16} />
              Написать в Telegram
            </a>

            <a
              href="mailto:hello@saq.digital"
              className="inline-flex items-center justify-center gap-3 border border-gold/25 text-ink
                         text-sm font-medium tracking-[1px] uppercase py-4 px-10
                         hover:border-gold hover:text-gold transition-all duration-200 w-full"
            >
              <Mail size={15} />
              hello@saq.digital
            </a>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4 border-t border-gold/10">
              {[['47+','Проектов'],['32+','Клиентов'],['3+','Года']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-head text-3xl text-gold tracking-[1px]">{n}</div>
                  <div className="text-xs text-muted tracking-[1.5px] uppercase mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
