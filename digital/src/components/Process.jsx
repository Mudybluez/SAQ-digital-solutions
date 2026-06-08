import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const steps = [
  { num: '01', title: 'БРИФ',        desc: 'Вы рассказываете о задаче — мы задаём нужные вопросы, чтобы точно понять цели и ожидания.' },
  { num: '02', title: 'ДИЗАЙН',      desc: 'Создаём макеты в Figma с учётом вашего бренда, аудитории и современных UX-стандартов.' },
  { num: '03', title: 'РАЗРАБОТКА',  desc: 'Пишем чистый, масштабируемый код. Регулярно демонстрируем прогресс и принимаем правки.' },
  { num: '04', title: 'ЗАПУСК',      desc: 'Тестируем, деплоим и передаём проект. Обеспечиваем поддержку и доработки после сдачи.' },
]

export default function Process() {
  const [ref, inView] = useInView()

  return (
    <section id="process" className="relative bg-navy">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-28" ref={ref}>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 text-xs font-bold tracking-[4px] uppercase text-gold mb-4"
        >
          <span className="w-8 h-px bg-gold" />
          Как мы работаем
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-head text-[clamp(48px,6vw,88px)] leading-[0.95] tracking-[-1px] font-[800] mb-20"
        >
          Процесс<br /><span className="text-gold">работы</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.12 * i }}
              className="relative pr-0 lg:pr-8 pb-12 lg:pb-0 group"
            >
              {/* Connector line (desktop) */}
              {i < 3 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
                  className="hidden lg:block absolute top-10 left-[80px] right-0 h-px bg-gradient-to-r from-gold/30 to-transparent origin-left"
                />
              )}

              {/* Number box */}
              <div className="clip-hex w-20 h-20 bg-navy-2 border border-gold/20 flex items-center justify-center
                              font-head text-2xl text-gold tracking-[2px] mb-7
                              group-hover:border-gold/50 group-hover:bg-navy-3 transition-all duration-300">
                {s.num}
              </div>

              <h3 className="font-head text-xl tracking-[1px] text-ink mb-3">{s.title}</h3>
              <p className="text-[14px] text-muted leading-[1.7]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
