import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useContent } from '../context/ContentContext'
import { useTranslation } from 'react-i18next'

export default function TechStack() {
  const { t } = useTranslation()
  const [ref, inView] = useInView()
  const { homepageContent } = useContent()
  const { techs } = homepageContent

  return (
    <section className="relative bg-navy-2">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20" ref={ref}>
        <motion.p
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 text-xs font-bold tracking-[4px] uppercase text-gold mb-4"
        >
          <span className="w-8 h-px bg-gold" />{t('tech_tag')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-head text-[clamp(36px,4vw,60px)] tracking-[-1px] font-[800] mb-10 text-ink"
        >
          {t('tech_title')}
        </motion.h2>

        <div className="flex flex-wrap gap-2">
          {techs && techs.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="flex items-center gap-2 bg-navy border border-gold/10 px-4 py-2.5
                         hover:border-gold/35 hover:text-ink transition-all duration-200 cursor-default group"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
              <span className="text-[13px] font-medium text-muted group-hover:text-ink transition-colors">
                {t.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
