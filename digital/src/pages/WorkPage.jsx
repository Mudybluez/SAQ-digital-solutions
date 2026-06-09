import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { getProject, projects } from '../data/projects'
import { useContent } from '../context/ContentContext'
import { useTranslation } from 'react-i18next'

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 32 },
  animate:   { opacity: 1, y: 0  },
  transition:{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

const translateProject = (p, lang) => {
  if (lang === 'ru' || !p.translations || !p.translations[lang]) {
    return p
  }
  const t = p.translations[lang]
  return {
    ...p,
    title: t.title || p.title,
    subtitle: t.subtitle || t.description || p.subtitle,
    desc: t.desc || t.description || p.desc,
    description: t.description || p.description,
    category: t.category || p.category,
    overview: t.overview || p.overview,
    challenge: t.challenge || p.challenge,
    solution: t.solution || p.solution,
    solution_points: t.solution_points || p.solution_points,
    results_title: t.results_title || p.results_title,
    results: t.results || p.results,
    facts: t.facts || p.facts
  }
}

export default function WorkPage() {
  const { t } = useTranslation()
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const [rawP, setRawP]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const { theme, language } = useContent()

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)

    // First try fetching from backend API
    fetch(`/api/projects/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.project) {
          const project = data.project;
          setRawP({
            ...project,
            desc: project.desc || project.description || '',
            subtitle: project.subtitle || project.description || '',
            facts: project.facts || {},
            solution_points: project.solution_points || [],
            results: project.results || [],
            screens: Array.isArray(project.screens) ? project.screens.map(s => typeof s === 'string' ? s : (s.grad ? s.grad : '')) : []
          });
        } else {
          // Fall back to static project data
          const staticP = getProject(slug)
          setRawP(staticP);
        }
      })
      .catch(err => {
        console.error('Error fetching project from API, using static fallback:', err);
        const staticP = getProject(slug)
        setRawP(staticP);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug])

  // Translate project on active language change
  const p = rawP ? translateProject(rawP, language) : null

  useEffect(() => {
    if (p) {
      document.title = `${p.title} — SAQ Digital Systems`;
    }
  }, [p])

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      <p className="text-muted text-xs tracking-[2px] uppercase">{t('loading_case')}</p>
    </div>
  )

  if (!p) return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-6">
      <p className="text-muted text-xl">{t('project_not_found')}</p>
      <Link to="/" className="text-gold hover:text-gold-glow transition-colors flex items-center gap-2">
        <ArrowLeft size={16} /> {t('go_home')}
      </Link>
    </div>
  )

  const nextProjectIndex = projects.findIndex(x => x.slug === slug)
  const nextProjectRaw = projects[(nextProjectIndex !== -1 ? nextProjectIndex + 1 : 0) % projects.length]
  const nextProject = translateProject(nextProjectRaw, language)

  return (
    <div className="min-h-screen bg-navy font-body">

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={theme === 'light' ? '/assets/digital_logo_light_no_bg.png' : '/assets/digital_logo_dark.png'} alt="SAQ" className="h-8 w-auto" />
            <span className="font-head font-[800] text-lg tracking-[-0.5px] text-gold">
              SAQ<br />
              <span className="text-[10px] tracking-[2px] text-gold/70 font-body font-semibold uppercase">Digital Systems</span>
            </span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted hover:text-gold transition-colors text-sm"
          >
            <ArrowLeft size={15} /> {t('back')}
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-16 min-h-[70vh] flex items-end overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${p.image})`, opacity: 0.18 }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/60 to-navy" />
        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,149,26,0.08) 0%, transparent 70%)' }} />

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 pb-20 pt-28 w-full">
          {/* Tags */}
          <motion.div {...fadeUp(0.1)} className="flex gap-2 flex-wrap mb-6">
            {p.tags.map(t => (
              <span key={t} className="text-[10px] font-bold tracking-[2.5px] px-3 py-1.5
                                        border border-gold/25 text-gold/70 uppercase">
                {t}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1 {...fadeUp(0.2)}
            className="font-head font-[800] text-[clamp(52px,8vw,120px)] leading-[0.88] tracking-[-2px] text-ink mb-4">
            {p.title}
          </motion.h1>
          <motion.p {...fadeUp(0.3)}
            className="font-head font-[600] text-[clamp(20px,3vw,36px)] tracking-[-0.5px] text-gold mb-6">
            {p.subtitle}
          </motion.p>
          <motion.p {...fadeUp(0.4)}
            className="text-[17px] text-muted max-w-2xl leading-[1.7] mb-10">
            {p.desc}
          </motion.p>

          {/* CTA */}
          <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-4">
            {p.link && (
              <a href={p.link} target="_blank" rel="noopener"
                 className="inline-flex items-center gap-2 bg-gold text-navy font-head font-[800]
                            text-sm tracking-[-0.3px] px-8 py-3.5 hover:bg-gold-glow transition-colors">
                {t('open_project')} <ArrowUpRight size={15} />
              </a>
            )}
            <Link to="/#portfolio"
              className="inline-flex items-center gap-2 border border-gold/25 text-ink
                         text-sm font-medium px-7 py-3.5 hover:border-gold hover:text-gold transition-all">
              {t('all_works')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FACTS ── */}
      <section className="border-y border-gold/10 bg-navy-2">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(p.facts).map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] font-bold tracking-[3px] uppercase text-gold/60 mb-1.5">{k}</p>
                <p className="text-[15px] text-ink font-medium leading-[1.4]">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp(0)} className="lg:sticky lg:top-24">
            <p className="text-[11px] font-bold tracking-[4px] uppercase text-gold mb-4">{t('about_project')}</p>
            <h2 className="font-head font-[800] text-[clamp(36px,4vw,58px)] leading-[0.95] tracking-[-1px] text-ink mb-6">
              {t('overview')}
            </h2>
            <p className="text-[16px] text-muted leading-[1.8]">{p.overview}</p>
          </motion.div>

          {/* Hero screenshot */}
          {p.screens[0] && (
            <motion.div {...fadeUp(0.15)}
              className="relative overflow-hidden cursor-zoom-in rounded-sm"
              onClick={() => setLightbox(0)}>
              <img src={p.screens[0]} alt={p.title} loading="lazy" decoding="async"
                   className="w-full object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 border border-gold/10 pointer-events-none" />
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CHALLENGE & SOLUTION ── */}
      <section className="bg-navy-2">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Challenge */}
            <div>
              <p className="text-[11px] font-bold tracking-[4px] uppercase text-gold/60 mb-4">{t('challenge_tag')}</p>
              <h3 className="font-head font-[800] text-[clamp(28px,3vw,44px)] leading-[0.95] tracking-[-1px] text-ink mb-6">
                {t('challenge_title')}
              </h3>
              <p className="text-[16px] text-muted leading-[1.8]">{p.challenge}</p>
            </div>

            {/* Solution */}
            <div>
              <p className="text-[11px] font-bold tracking-[4px] uppercase text-gold mb-4">{t('solution_tag')}</p>
              <h3 className="font-head font-[800] text-[clamp(28px,3vw,44px)] leading-[0.95] tracking-[-1px] text-ink mb-6">
                {t('solution_title')}
              </h3>
              <p className="text-[16px] text-muted leading-[1.8] mb-8">{p.solution}</p>

              <ul className="space-y-3">
                {p.solution_points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                    <span className="text-[14px] text-muted leading-[1.6]">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      {p.results.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
          <p className="text-[11px] font-bold tracking-[4px] uppercase text-gold mb-4">{t('results_tag')}</p>
          <h2 className="font-head font-[800] text-[clamp(36px,4vw,58px)] leading-[0.95] tracking-[-1px] text-ink mb-14">
            {p.results_title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gold/5">
            {p.results.map((r, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="bg-navy p-10 border border-gold/8">
                <div className="font-head font-[800] text-[clamp(40px,5vw,72px)] leading-none tracking-[-2px] text-gold mb-3">
                  {r.num}
                </div>
                <p className="text-[14px] text-muted leading-[1.5]">{r.lbl}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── SCREENSHOTS GALLERY ── */}
      {p.screens.length > 1 && (
        <section className="bg-navy-2">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
            <p className="text-[11px] font-bold tracking-[4px] uppercase text-gold mb-4">{t('screens_tag')}</p>
            <h2 className="font-head font-[800] text-[clamp(36px,4vw,58px)] leading-[0.95] tracking-[-1px] text-ink mb-12">
              {t('screens_title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {p.screens.map((src, i) => (
                <motion.div key={i} {...fadeUp(i * 0.06)}
                  className="relative overflow-hidden cursor-zoom-in group aspect-[4/3]"
                  onClick={() => setLightbox(i)}>
                  <img src={src} alt={`${p.title} screen ${i + 1}`} loading="lazy" decoding="async"
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity
                                  flex items-center justify-center">
                    <span className="text-[11px] font-bold tracking-[2px] uppercase text-ink">
                      {t('open_btn')}
                    </span>
                  </div>
                  <div className="absolute inset-0 border border-gold/10 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEXT PROJECT ── */}
      <section className="border-t border-gold/10">
        <Link to={`/work/${nextProject.slug}`}
          className="group block max-w-[1400px] mx-auto px-6 md:px-12 py-16 flex items-center justify-between hover:bg-gold/[0.02] transition-colors">
          <div>
            <p className="text-[11px] font-bold tracking-[4px] uppercase text-muted mb-3">{t('next_case')}</p>
            <h3 className="font-head font-[800] text-[clamp(28px,4vw,60px)] tracking-[-1px] text-ink
                           group-hover:text-gold transition-colors leading-none">
              {nextProject.title}
            </h3>
            <p className="text-muted mt-2 text-[15px]">{nextProject.subtitle}</p>
          </div>
          <div className="w-14 h-14 border border-gold/20 flex items-center justify-center
                          group-hover:border-gold group-hover:bg-gold/5 transition-all duration-300 shrink-0">
            <ArrowUpRight size={22} className="text-gold" />
          </div>
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gold/10 bg-navy-2">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex items-center justify-between">
          <p className="text-[13px] text-muted">© 2026 SAQ Creative Agency</p>
          <Link to="/#contact"
            className="text-[13px] text-gold hover:text-gold-glow transition-colors font-medium">
            {t('discuss_project')} →
          </Link>
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-md flex items-center justify-center p-4"
             onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 w-10 h-10 border border-gold/25 flex items-center justify-center
                             text-muted hover:text-gold hover:border-gold transition-all text-xl"
                  onClick={() => setLightbox(null)}>×</button>
          <button className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 border border-gold/25
                             flex items-center justify-center text-muted hover:text-gold transition-all"
                  onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + p.screens.length) % p.screens.length) }}>
            ‹
          </button>
          <img src={p.screens[lightbox]} alt=""
               className="max-h-[90vh] max-w-[90vw] object-contain"
               onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 border border-gold/25
                             flex items-center justify-center text-muted hover:text-gold transition-all"
                  onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % p.screens.length) }}>
            ›
          </button>
          <p className="absolute bottom-5 text-muted text-[12px]">{lightbox + 1} / {p.screens.length}</p>
        </div>
      )}
    </div>
  )
}
