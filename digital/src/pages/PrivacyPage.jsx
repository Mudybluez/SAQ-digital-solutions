import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useContent } from '../context/ContentContext'

export default function PrivacyPage() {
  const navigate = useNavigate()
  const { privacyContent } = useContent()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${privacyContent.title || 'Политика конфиденциальности'} — SAQ Creative Agency`
  }, [privacyContent.title])

  return (
    <div className="min-h-screen bg-navy text-ink font-body">
      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="SAQ" className="h-8 w-auto" />
            <span className="font-head font-[800] text-lg tracking-[-0.5px] text-gold">
              SAQ<br />
              <span className="text-[10px] tracking-[2px] text-gold/70 font-body font-semibold uppercase">Digital Systems</span>
            </span>
          </Link>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted hover:text-gold transition-colors text-sm"
          >
            <ArrowLeft size={15} /> На главную
          </button>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="max-w-[800px] mx-auto px-6 pt-32 pb-24">
        <h1 className="font-head font-[800] text-[clamp(36px,5vw,58px)] leading-[1.1] tracking-[-1px] mb-2 text-ink">
          {privacyContent.title}
        </h1>
        <p className="font-mono text-[12px] text-gold uppercase tracking-[2px] mb-12">
          {privacyContent.subtitle}
        </p>

        <div className="prose prose-invert max-w-none text-[15px] text-muted leading-[1.8] space-y-8">
          <p style={{ whiteSpace: 'pre-line' }}>
            {privacyContent.intro}
          </p>

          {privacyContent.sections && privacyContent.sections.map((sec, i) => (
            <div key={i} className="border-t border-gold/10 pt-8">
              <h2 className="font-head font-[700] text-xl text-gold uppercase tracking-[1px] mb-4">
                {sec.title}
              </h2>
              <p style={{ whiteSpace: 'pre-line' }}>
                {sec.content}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
