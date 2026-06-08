import { useState, useEffect, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { projects as staticProjects } from '../data/projects'

const filters = ['Все', 'Web App', 'Лендинг']

const ProjectCard = forwardRef(function ProjectCard({ p, i, inView }, ref) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.55, delay: i * 0.09 }}
      className={`${p.span}`}
    >
      <Link
        to={`/work/${p.slug}`}
        className={`group relative overflow-hidden cursor-pointer min-h-[340px] bg-gradient-to-br ${p.accent}
                    flex flex-col h-full`}
        style={{ display: 'flex' }}
      >
        {/* BG image */}
        {p.image && (p.image.startsWith('http') || p.image.startsWith('/')) && (
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
               style={{ backgroundImage: `url(${p.image})`, opacity: 0.35 }} />
        )}
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: `linear-gradient(rgba(232,149,26,0.03) 1px,transparent 1px),
                                 linear-gradient(90deg,rgba(232,149,26,0.03) 1px,transparent 1px)`,
               backgroundSize: '40px 40px',
             }} />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

        {/* Arrow */}
        <div className="absolute top-5 right-5 w-8 h-8 border border-gold/20 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-gold/60">
          <ArrowUpRight size={14} className="text-gold" />
        </div>

        {/* Tags */}
        <div className="absolute top-5 left-5 flex gap-1.5 flex-wrap">
          {p.tags.map(t => (
            <span key={t} className="text-[9px] font-bold tracking-[2px] px-2 py-1 bg-navy/60 border border-gold/15 text-gold/70">
              {t}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="relative mt-auto p-7">
          <p className="text-[11px] font-semibold tracking-[3px] uppercase text-gold mb-2">{p.type || p.category}</p>
          <h3 className="font-head font-[800] text-[clamp(24px,2.8vw,38px)] tracking-[-0.5px] text-ink mb-1">
            {p.title}
          </h3>
          <p className="text-[13px] text-muted/70 mb-3 font-medium">{p.subtitle || p.description}</p>
          <p className="text-[13px] text-muted leading-[1.5] max-w-sm
                        max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-400 ease-out">
            {p.desc || p.description}
          </p>
          {/* Stats */}
          {p.results?.length > 0 && (
            <div className="flex gap-5 mt-4 pt-4 border-t border-gold/10
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              {p.results.slice(0, 3).map(s => (
                <div key={s.lbl}>
                  <div className="font-head font-[800] text-[17px] text-gold leading-none">{s.num}</div>
                  <div className="text-[10px] text-muted/60 mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-muted/40 mt-3 font-mono
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {p.tech || (Array.isArray(p.tags) ? p.tags.join(' · ') : '')}
          </p>
        </div>
      </Link>
    </motion.div>
  )
})

export default function Portfolio() {
  const [active, setActive] = useState('Все')
  const [ref, inView]       = useInView()
  const [projectsList, setProjectsList] = useState(staticProjects)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.ok && Array.isArray(data.projects) && data.projects.length > 0) {
          const mapped = data.projects.map((p, idx) => ({
            ...p,
            id: p.id || idx + 1,
            desc: p.desc || p.description || '',
            subtitle: p.subtitle || p.description || '',
            span: p.span || (idx % 3 === 0 ? 'lg:col-span-7' : 'lg:col-span-5'),
            accent: p.accent || (idx % 2 === 0 ? 'from-[#0A0F1F] to-[#111830]' : 'from-[#0A1510] to-[#0F1E14]'),
            cat: p.cat || (p.category.includes('App') || p.category.includes('приложение') || p.category.includes('Platform') ? 'Web App' : 'Лендинг'),
            screens: Array.isArray(p.screens) ? p.screens.map(s => typeof s === 'string' ? s : (s.grad ? s.grad : '')) : []
          }))
          setProjectsList(mapped)
        }
      })
      .catch(err => console.error('Failed to load portfolio projects from API, using static fallback:', err))
  }, [])

  const visible = active === 'Все' ? projectsList : projectsList.filter(p => p.cat === active)

  return (
    <section id="portfolio" className="relative bg-navy-2">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-28" ref={ref}>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 text-xs font-bold tracking-[4px] uppercase text-gold mb-4"
            >
              <span className="w-8 h-px bg-gold" />Наши работы
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-head font-[800] text-[clamp(48px,6vw,88px)] leading-[0.95] tracking-[-1px]"
            >
              Порт<span className="text-gold">фолио</span>
            </motion.h2>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-1"
          >
            {filters.map(f => (
              <button key={f} onClick={() => setActive(f)}
                className={`text-xs font-semibold tracking-[1.5px] uppercase px-5 py-2 border transition-all duration-200
                  ${active === f
                    ? 'border-gold text-gold bg-gold/5'
                    : 'border-transparent text-muted hover:border-gold/30 hover:text-gold'}`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-12 gap-1">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i} inView={inView} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
