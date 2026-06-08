import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const reviews = [
  {
    text: '"SAQ Digital System сделали нам лендинг за 5 дней. Дизайн превзошёл все ожидания — стильно, быстро и без лишних правок."',
    name: 'Айдар Назаров',
    role: 'CEO, TechStart KZ',
    initial: 'А',
  },
  {
    text: '"Telegram-бот для нашего магазина работает идеально. Автоответы, оплата, уведомления — всё интегрировано за 3 дня."',
    name: 'Мадина Ержанова',
    role: 'Основатель, BotStore',
    initial: 'М',
  },
  {
    text: '"Автоматизировали выгрузку данных и рассылки — экономим 20+ часов в неделю. Команда SAQ — профессионалы своего дела."',
    name: 'Тимур Касымов',
    role: 'Operations Lead, LogiKZ',
    initial: 'Т',
  },
]

export default function Testimonials() {
  const [ref, inView] = useInView()

  return (
    <section id="about" className="relative bg-navy">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-28 text-center" ref={ref}>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 text-xs font-bold tracking-[4px] uppercase text-gold mb-4"
        >
          <span className="w-8 h-px bg-gold" />Отзывы<span className="w-8 h-px bg-gold" />
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-head text-[clamp(40px,5vw,80px)] leading-[0.95] tracking-[-1px] font-[800] mb-16"
        >
          Что говорят<br /><span className="text-gold">клиенты</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
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
              <p className="text-[15px] text-ink/90 leading-[1.75] italic mb-8">{r.text}</p>
              <div className="flex items-center gap-3">
                <div className="clip-hex-sm w-11 h-11 bg-navy-3 border border-gold/20 flex items-center justify-center
                                font-head text-lg text-gold group-hover:border-gold/40 transition-colors">
                  {r.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{r.name}</div>
                  <div className="text-xs text-muted mt-0.5">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
