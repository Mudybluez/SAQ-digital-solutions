import { motion } from 'framer-motion'
import { Monitor, Bot, Zap, ArrowRight } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const services = [
  {
    num: '01',
    icon: Monitor,
    title: 'САЙТЫ',
    desc: 'Лендинги, корпоративные сайты, интернет-магазины, порталы и SaaS-приложения. Современный дизайн, быстрая загрузка, SEO-оптимизация.',
    tags: ['Лендинг', 'E-Commerce', 'Web App', 'CRM'],
  },
  {
    num: '02',
    icon: Bot,
    title: 'БОТЫ',
    desc: 'Telegram-боты для бизнеса, клиентского сервиса, автоворонок и внутренних задач. Интеграция с любыми API и платёжными системами.',
    tags: ['Telegram', 'Автоворонки', 'AI-боты', 'Поддержка'],
  },
  {
    num: '03',
    icon: Zap,
    title: 'АВТОМАТИЗАЦИЯ',
    desc: 'Автоматизируем рутинные процессы: парсинг, рассылки, интеграции, n8n/Make, скрипты и бизнес-логику под ключ.',
    tags: ['n8n', 'Make', 'Python', 'API'],
  },
]

export default function Services() {
  const [ref, inView] = useInView()

  return (
    <section id="services" className="relative bg-navy-2 overflow-hidden">
      {/* Top radial glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(232,149,26,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-28" ref={ref}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 text-xs font-bold tracking-[4px] uppercase text-gold mb-4"
            >
              <span className="w-8 h-px bg-gold" />
              Что мы делаем
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-head text-[clamp(48px,6vw,88px)] leading-[0.95] tracking-[-1px] font-[800]"
            >
              Наши<br /><span className="text-gold">услуги</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[17px] text-muted max-w-md leading-[1.7]"
          >
            Полный цикл разработки — от дизайна до поддержки.
            SAQ Digital System работает с любыми задачами в сфере IT.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/5">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 * i }}
                className="group relative bg-navy p-10 overflow-hidden cursor-default
                           border border-transparent hover:border-gold/20 transition-all duration-300"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Big number */}
                <span className="absolute top-4 right-6 font-head text-[88px] leading-none text-gold/6 group-hover:text-gold/12 transition-colors duration-300 select-none pointer-events-none">
                  {s.num}
                </span>

                {/* Icon */}
                <div className="clip-hex-sm w-14 h-14 border border-gold/20 flex items-center justify-center mb-8 group-hover:border-gold/50 transition-colors duration-300">
                  <Icon size={24} className="text-muted group-hover:text-gold transition-colors duration-300" strokeWidth={1.5} />
                </div>

                <h3 className="font-head text-[32px] tracking-[1px] text-ink mb-4">{s.title}</h3>
                <p className="text-[15px] text-muted leading-[1.7] mb-7">{s.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {s.tags.map(t => (
                    <span key={t} className="text-[11px] font-semibold tracking-[1.5px] uppercase text-gold-dim border border-gold/15 px-3 py-1">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[2px] uppercase text-muted group-hover:text-gold transition-colors duration-200">
                  Подробнее
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
