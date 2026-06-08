import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useContent } from '../context/ContentContext'

const PROJECT_TYPES = [
  { value: 'landing', label: 'Лендинг' },
  { value: 'business', label: 'Бизнес-сайт' },
  { value: 'platform', label: 'Кастомная веб-платформа' },
  { value: 'unknown', label: 'Другое / Пока не знаю' }
]

export default function ContactForm() {
  const [ref, inView] = useInView()
  const { homepageContent } = useContent()
  const { contact } = homepageContent

  const [form, setForm]     = useState({ name: '', contact: '', type: 'landing', desc: '', company: '' })
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed) { setError('Пожалуйста, дайте согласие на обработку данных'); return }
    if (!form.name.trim() || !form.contact.trim()) { setError('Заполните имя и контакт'); return }
    setError('')

    const payload = {
      name: form.name.trim(),
      phone: form.contact.trim(),
      type: form.type,
      desc: form.desc.trim(),
      consent: agreed,
      company: form.company.trim()
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setSent(true)
      } else {
        throw new Error(data.error || 'Не удалось отправить заявку. Пожалуйста, попробуйте позже.')
      }
    } catch (err) {
      setError(err.message || 'Ошибка отправки заявки. Пожалуйста, напишите напрямую в Telegram.')
    }
  }

  const inputCls = `w-full bg-[#0D1220] border border-white/8 text-ink placeholder-muted/50
    px-4 py-3.5 text-[15px] focus:outline-none focus:border-gold/50 transition-colors duration-200 rounded-none`

  const labelCls = `block text-[10px] font-semibold tracking-[3px] uppercase text-muted mb-2`

  return (
    <section id="contact" className="relative bg-navy overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 40% 60% at 20% 50%, rgba(232,149,26,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] font-semibold tracking-[4px] uppercase text-gold/70 mb-6">
              {contact.tag}
            </p>

            <h2 className="font-head font-[800] text-[clamp(52px,6vw,100px)] leading-[0.88] tracking-[-2px] text-ink mb-8">
              {contact.title}
            </h2>

            <p className="text-[16px] text-muted leading-[1.7] max-w-sm mb-10">
              {contact.subtitle}
            </p>

            <div className="space-y-3 text-[14px]">
              <p className="text-muted/60 text-[12px] uppercase tracking-[2px] font-medium mb-4">Или напишите напрямую:</p>
              <a href="https://t.me/saq_digital_systems" target="_blank" rel="noopener"
                 className="flex items-center gap-3 text-gold hover:text-gold-glow transition-colors font-mono">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
                </svg>
                t.me/saq_digital_systems
              </a>
              <a href="https://wa.me/77471846771" target="_blank" rel="noopener"
                 className="flex items-center gap-3 text-gold hover:text-gold-glow transition-colors font-mono">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp: +7 747 184 6771
              </a>
            </div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8951A" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-head font-[800] text-3xl text-ink mb-3">Заявка отправлена!</h3>
                <p className="text-muted text-[15px] mb-8">Спасибо за обращение! Мы свяжемся с вами в ближайшее время для обсуждения деталей.</p>
                <button onClick={() => setSent(false)}
                  className="text-[13px] text-gold/60 hover:text-gold border-b border-gold/20 hover:border-gold transition-colors">
                  Отправить ещё одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className={labelCls}>Имя</label>
                  <input type="text" placeholder={contact.placeholder_name}
                    value={form.name} onChange={set('name')}
                    className={inputCls} />
                </div>

                {/* Contact */}
                <div>
                  <label className={labelCls}>Телефон / Telegram</label>
                  <input type="text" placeholder={contact.placeholder_contact}
                    value={form.contact} onChange={set('contact')}
                    className={inputCls} />
                </div>

                {/* Project type */}
                <div>
                  <label className={labelCls}>Тип проекта</label>
                  <div className="relative">
                    <select value={form.type} onChange={set('type')}
                      className={`${inputCls} appearance-none cursor-pointer pr-10`}>
                      {PROJECT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                 {/* Description */}
                <div>
                  <label className={labelCls}>Описание</label>
                  <textarea placeholder={contact.placeholder_message}
                    rows={4} value={form.desc} onChange={set('desc')}
                    className={`${inputCls} resize-y min-h-[110px]`} />
                </div>

                {/* Honeypot */}
                <input type="text" name="company" value={form.company} onChange={set('company')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                {/* Privacy */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    onClick={() => setAgreed(v => !v)}
                    className={`mt-0.5 w-5 h-5 shrink-0 border transition-all duration-200 flex items-center justify-center
                      ${agreed ? 'bg-gold border-gold' : 'border-white/20 group-hover:border-gold/40'}`}
                  >
                    {agreed && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <polyline points="2 6 5 9 10 3" stroke="#07090F" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-muted/70 leading-[1.5]">
                    {contact.checkbox_text || 'Я согласен с'}{' '}
                    <Link to="/privacy" target="_blank" rel="noopener"
                       className="text-muted underline underline-offset-2 hover:text-ink transition-colors">
                      {contact.checkbox_link || 'Политикой конфиденциальности'}
                    </Link>
                  </span>
                </label>

                {error && <p className="text-[13px] text-red-400">{error}</p>}

                {/* Submit */}
                <button type="submit"
                  className="w-full bg-gold text-navy font-head font-[800] text-[17px] tracking-[-0.3px]
                             py-4 hover:bg-gold-glow active:scale-[0.99] transition-all duration-200 mt-2">
                  {contact.submit_btn}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
